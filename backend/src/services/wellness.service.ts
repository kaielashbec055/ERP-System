import { RiskType, Severity } from '@prisma/client';
import { prisma } from '../config/prisma';

// ---------------------------------------------------------------------------
// Mood check-ins (matches frontend `MoodEntry[]` exactly)
// ---------------------------------------------------------------------------

export async function addMoodEntry(
  studentProfileId: string,
  input: { date: string; score: number; tags: string[]; note?: string },
) {
  const entry = await prisma.moodEntry.upsert({
    where: { studentId_date: { studentId: studentProfileId, date: input.date } },
    update: { score: input.score, tags: input.tags, note: input.note },
    create: {
      studentId: studentProfileId,
      date: input.date,
      score: input.score,
      tags: input.tags,
      note: input.note,
    },
  });
  return entry;
}

export async function getMoodEntries(studentProfileId: string, limit = 30) {
  const entries = await prisma.moodEntry.findMany({
    where: { studentId: studentProfileId },
    orderBy: { date: 'desc' },
    take: limit,
  });
  return entries.map((e) => ({
    id: e.id,
    date: e.date,
    score: e.score as 1 | 2 | 3 | 4 | 5,
    tags: e.tags,
    note: e.note ?? undefined,
  }));
}

// ---------------------------------------------------------------------------
// AI Early Warning System (StrugglingStudentAlert)
// Rule-based risk detection over grades, attendance, and mood sentiment.
// Matches frontend `StrugglingStudentAlert[]` exactly.
// ---------------------------------------------------------------------------

function severityToLower(s: Severity): 'high' | 'medium' {
  return s === Severity.HIGH ? 'high' : 'medium';
}

function riskTypeToLower(r: RiskType): 'academic' | 'attendance' | 'wellness' | 'combined' {
  return r.toLowerCase() as any;
}

export interface ListRiskAlertsFilters {
  classId?: string;
  severity?: 'high' | 'medium';
  resolved?: boolean;
}

export async function listRiskAlerts(filters: ListRiskAlertsFilters) {
  const alerts = await prisma.strugglingStudentAlert.findMany({
    where: {
      resolved: filters.resolved ?? false,
      ...(filters.severity ? { severity: filters.severity.toUpperCase() as Severity } : {}),
      ...(filters.classId ? { student: { classId: filters.classId } } : {}),
    },
    include: { student: { include: { user: true, class: true } } },
    orderBy: { dateFlagged: 'desc' },
  });

  return alerts.map((a) => ({
    id: a.id,
    studentId: a.studentId,
    studentName: a.student.user.name,
    avatar: a.student.user.avatarUrl,
    grade: a.student.class ? `${a.student.class.grade}-${a.student.class.section}` : 'Unassigned',
    riskType: riskTypeToLower(a.riskType),
    severity: severityToLower(a.severity),
    reason: a.reason,
    aiRecommendation: a.aiRecommendation,
    dateFlagged: a.dateFlagged.toISOString().split('T')[0],
  }));
}

export async function resolveRiskAlert(id: string) {
  return prisma.strugglingStudentAlert.update({ where: { id }, data: { resolved: true } });
}

/**
 * Deterministic "AI Early Warning" heuristic engine. Scans every active
 * student and raises/updates risk alerts based on three signals:
 *   - Attendance: attendancePercent < 90 (medium) / < 80 (high)
 *   - Academic:   any subject with trend=DOWN and score < 75
 *   - Wellness:   average of last 3 mood scores <= 2
 *
 * This is intentionally transparent and swappable — replace the body of
 * this function with a real ML/LLM call later without touching callers.
 */
export async function generateRiskAlerts(classId?: string): Promise<{ created: number; updated: number }> {
  const students = await prisma.studentProfile.findMany({
    where: classId ? { classId } : {},
    include: {
      subjectGrades: { include: { subject: true } },
      moodEntries: { orderBy: { date: 'desc' }, take: 3 },
    },
  });

  let created = 0;
  let updated = 0;

  for (const student of students) {
    const findings: { riskType: RiskType; severity: Severity; reason: string; aiRecommendation: string }[] = [];

    if (student.attendancePercent < 80) {
      findings.push({
        riskType: RiskType.ATTENDANCE,
        severity: Severity.HIGH,
        reason: `Attendance has fallen to ${student.attendancePercent}%, below the 80% safety threshold.`,
        aiRecommendation: 'Send automated attendance verification request to parent via EduPulse app.',
      });
    } else if (student.attendancePercent < 90) {
      findings.push({
        riskType: RiskType.ATTENDANCE,
        severity: Severity.MEDIUM,
        reason: `Attendance has dropped to ${student.attendancePercent}%, trending below the 90% target.`,
        aiRecommendation: 'Recommend a gentle check-in with the student and a note to the parent.',
      });
    }

    const decliningSubject = student.subjectGrades.find((g) => g.trend === 'DOWN' && g.score < 75);
    if (decliningSubject) {
      findings.push({
        riskType: RiskType.ACADEMIC,
        severity: decliningSubject.score < 60 ? Severity.HIGH : Severity.MEDIUM,
        reason: `Score dropped in ${decliningSubject.subject.name} (currently ${decliningSubject.score}%, trending down).`,
        aiRecommendation: `Recommend scheduling a 1-on-1 review session for ${decliningSubject.subject.name} and consider a deadline extension.`,
      });
    }

    if (student.moodEntries.length >= 2) {
      const avgMood =
        student.moodEntries.reduce((sum, m) => sum + m.score, 0) / student.moodEntries.length;
      if (avgMood <= 2) {
        findings.push({
          riskType: RiskType.WELLNESS,
          severity: Severity.HIGH,
          reason: `Recent mood check-ins average ${avgMood.toFixed(1)}/5, indicating sustained low mood.`,
          aiRecommendation: 'Counselor flag raised automatically. Recommend a gentle check-in by the campus counselor.',
        });
      }
    }

    if (!findings.length) continue;

    // Combine multiple simultaneous findings into one alert, matching the
    // frontend's `riskType: 'combined'` option.
    const chosen =
      findings.length > 1
        ? {
            riskType: RiskType.COMBINED,
            severity: findings.some((f) => f.severity === Severity.HIGH) ? Severity.HIGH : Severity.MEDIUM,
            reason: findings.map((f) => f.reason).join(' '),
            aiRecommendation: findings.map((f) => f.aiRecommendation).join(' '),
          }
        : findings[0];

    const existing = await prisma.strugglingStudentAlert.findFirst({
      where: { studentId: student.id, resolved: false },
    });

    if (existing) {
      await prisma.strugglingStudentAlert.update({
        where: { id: existing.id },
        data: { ...chosen, dateFlagged: new Date() },
      });
      updated++;
    } else {
      await prisma.strugglingStudentAlert.create({
        data: { studentId: student.id, ...chosen },
      });
      created++;
    }
  }

  return { created, updated };
}
