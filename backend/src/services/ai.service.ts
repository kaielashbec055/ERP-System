import { ChatRole, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import * as studentService from './student.service';
import * as wellnessService from './wellness.service';
import * as parentService from './parent.service';
import { env } from '../config/env';

/**
 * ---------------------------------------------------------------------------
 * EduPulse AI — backend-only endpoints (no AI-specific UI, per spec).
 *
 * By default this runs as a fully deterministic, rule-based engine derived
 * from real DB data — it works out of the box with zero external API keys,
 * mirroring (and upgrading) the client-side `generateAIResponse` logic that
 * used to live in ChatContext.tsx. If OPENAI_API_KEY / ANTHROPIC_API_KEY are
 * set in .env, `callExternalLLM()` is the single extension point to swap in
 * a real model call without touching any route/controller code.
 * ---------------------------------------------------------------------------
 */

async function callExternalLLM(_systemPrompt: string, _userPrompt: string): Promise<string | null> {
  if (!env.ai.openaiApiKey && !env.ai.anthropicApiKey) return null;
  // Intentionally left as an extension point: wire up your provider of
  // choice here (fetch to OpenAI/Anthropic) and return the text response.
  // Returning null makes callers fall back to the deterministic engine.
  return null;
}

// ---------------------------------------------------------------------------
// Conversational assistant (chat bubble)
// ---------------------------------------------------------------------------

export async function chat(userId: string, role: Role, prompt: string) {
  await prisma.aiChatMessage.create({
    data: { userId, role: ChatRole.USER, text: prompt, suggestedActions: [] },
  });

  const lower = prompt.toLowerCase();
  let reply: string;
  let suggestedActions: string[] = [];

  if (lower.includes('physics') || lower.includes('exam') || lower.includes('study')) {
    reply = await buildStudyPlanReply(userId, role);
    suggestedActions = ['Generate a 5-question mock quiz', 'Show my weakest subject'];
  } else if (lower.includes('bus') || lower.includes('route') || lower.includes('where')) {
    reply = await buildBusReply(userId, role);
    suggestedActions = ['Track live on map', 'Call the driver'];
  } else if (lower.includes('attendance') || lower.includes('report') || lower.includes('gpa')) {
    reply = await buildAcademicSummaryReply(userId, role);
    suggestedActions = ['View full report card', 'See pending assignments'];
  } else if (lower.includes('sos') || lower.includes('emergency') || lower.includes('safety')) {
    reply =
      '🚨 **EduPulse Emergency SOS Protocol**:\n- Active emergency notifications are broadcast immediately to parents & staff.\n' +
      '- Campus security is placed on high alert.\n- Transport drivers receive live dispatch updates.\n\n' +
      'Use the **SOS button** in the header to issue an urgent campus alert.';
    suggestedActions = ['Open SOS terminal', 'View safety protocols'];
  } else if (role === Role.TEACHER) {
    reply = await buildTeacherInsightReply(userId);
    suggestedActions = ['Contact flagged parents', 'Run AI Early Warning scan'];
  } else if (role === Role.PARENT) {
    reply = await buildParentInsightReply(userId);
    suggestedActions = ['Pay pending fees', 'Book a teacher meeting'];
  } else if (role === Role.ADMIN) {
    reply = await buildAdminSummaryReply();
    suggestedActions = ['Broadcast an alert', 'View live bus fleet'];
  } else {
    reply = `I'm analyzing your query with EduPulse AI intelligence. For "${prompt}", current records show normal metrics and all safety protocols active. Is there a specific report or contact you need?`;
  }

  const external = await callExternalLLM('You are EduPulse AI, a school ERP assistant.', prompt);
  if (external) reply = external;

  await prisma.aiChatMessage.create({
    data: { userId, role: ChatRole.ASSISTANT, text: reply, suggestedActions },
  });

  return { text: reply, suggestedActions };
}

export async function getChatHistory(userId: string, limit = 50) {
  const messages = await prisma.aiChatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
  return messages.map((m) => ({
    id: m.id,
    role: m.role.toLowerCase(),
    text: m.text,
    suggestedActions: m.suggestedActions,
    timestamp: m.createdAt.toISOString(),
  }));
}

async function buildStudyPlanReply(userId: string, role: Role): Promise<string> {
  if (role !== Role.STUDENT) return 'Study plans are generated from a student profile. Ask a student to request one, or view their profile directly.';
  const studentId = await studentService.resolveStudentProfileId(userId);
  const subjects = await studentService.getSubjectGrades(studentId);
  const weakest = [...subjects].sort((a, b) => a.score - b.score)[0];
  if (!weakest) return 'No subject performance data is on file yet.';
  return (
    `Based on your latest scores (${weakest.score}% in ${weakest.subject}), here is your AI Study Plan:\n\n` +
    `1. Review core concepts in ${weakest.subject} (currently trending ${weakest.trend}).\n` +
    `2. Revisit your most recent test (scored ${weakest.lastTestScore}%).\n` +
    `3. Spend 15 focused minutes daily on ${weakest.subject} for the next week.\n\n` +
    `Would you like a 5-question mock quiz on ${weakest.subject}?`
  );
}

async function buildBusReply(userId: string, role: Role): Promise<string> {
  const studentId =
    role === Role.STUDENT ? await studentService.resolveStudentProfileId(userId) : undefined;
  if (!studentId) {
    return '🚌 Live transport updates are available from your dashboard\'s Safety tab, or ask again from a student account.';
  }
  const student = await prisma.studentProfile.findUnique({ where: { id: studentId }, include: { bus: true } });
  if (!student?.bus) return 'No bus route is currently assigned to your profile.';
  const b = student.bus;
  return (
    `🚌 **Live Transport Update**:\n- **Bus**: ${b.busNumber} (${b.routeName})\n` +
    `- **Status**: ${b.status.replace('_', ' ')} (${b.currentSpeed} km/h)\n` +
    `- **ETA**: ${b.etaMinutes} minutes\n- **Driver**: ${b.driverName} (${b.driverPhone})`
  );
}

async function buildAcademicSummaryReply(userId: string, role: Role): Promise<string> {
  if (role !== Role.STUDENT) return 'Academic summaries are generated from a student profile.';
  const studentId = await studentService.resolveStudentProfileId(userId);
  const summary = await studentService.getDashboardSummary(studentId);
  const subjects = await studentService.getSubjectGrades(studentId);
  const top = [...subjects].sort((a, b) => b.score - a.score)[0];
  return (
    `📊 **Academic & Attendance Summary**:\n- **Attendance**: ${summary.attendancePercent}%\n` +
    `- **Current GPA**: ${summary.gpa} / 4.0\n` +
    `- **Top Subject**: ${top ? `${top.subject} (${top.score}%)` : 'N/A'}\n` +
    `- **Pending Tasks**: ${summary.pendingAssignments} assignment(s).`
  );
}

async function buildTeacherInsightReply(userId: string): Promise<string> {
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!teacher) return 'Teacher profile not found.';
  const alerts = await wellnessService.listRiskAlerts({});
  const mine = alerts.slice(0, 2);
  if (!mine.length) return '👨‍🏫 **Teacher AI Insight**: No active risk flags right now — your class is on track.';
  return (
    `👨‍🏫 **Teacher AI Insight**:\n- **${mine.length} Student(s) Flagged**: ` +
    mine.map((a) => `${a.studentName} (${a.riskType})`).join(', ') +
    `.\n- Recommended: reach out via the Communication hub.`
  );
}

async function buildParentInsightReply(userId: string): Promise<string> {
  const parentId = await parentService.resolveParentProfileId(userId);
  const children = await parentService.getChildren(parentId);
  if (!children.length) return "👩‍👦 **Parent AI Assistant**: No children linked to your account yet.";
  const lines = children.map(
    (c) =>
      `${c.name}: ${c.attendancePercent}% attendance, ${c.gpa} GPA, ${
        c.pendingFeeAmount > 0 ? `$${c.pendingFeeAmount} fees due` : 'fees paid'
      }.`,
  );
  return `👩‍👦 **Parent AI Assistant**:\n- ${lines.join('\n- ')}\n\nWould you like to pay fees or book a teacher meeting?`;
}

async function buildAdminSummaryReply(): Promise<string> {
  const [students, staff, buses] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.bus.count(),
  ]);
  return (
    `🏛️ **Administration Command Summary**:\n- **Total Active Students**: ${students}\n` +
    `- **Teaching Staff**: ${staff}\n- **Active Bus Fleet**: ${buses}\n- **System Status**: All safety sensors nominal.`
  );
}

// ---------------------------------------------------------------------------
// Structured analytics endpoints — each returns pure JSON (no prose UI).
// ---------------------------------------------------------------------------

export async function studyPlan(studentUserId: string) {
  const studentId = await studentService.resolveStudentProfileId(studentUserId);
  const [subjects, assignments] = await Promise.all([
    studentService.getSubjectGrades(studentId),
    studentService.getAssignmentsForStudent(studentId),
  ]);

  const focusAreas = [...subjects]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => ({
      subject: s.subject,
      currentScore: s.score,
      trend: s.trend,
      recommendation:
        s.trend === 'down'
          ? `Priority review needed — schedule extra practice in ${s.subject}.`
          : `Maintain momentum in ${s.subject} with regular revision.`,
    }));

  const upcomingDeadlines = assignments
    .filter((a) => a.status !== 'graded')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)
    .map((a) => ({ title: a.title, subject: a.subject, dueDate: a.dueDate, priority: a.priority }));

  return { studentId, focusAreas, upcomingDeadlines, generatedAt: new Date().toISOString() };
}

export async function homeworkHelp(subject: string, question: string) {
  const external = await callExternalLLM(
    `You are a patient tutor helping a student with ${subject}.`,
    question,
  );

  return {
    subject,
    question,
    guidanceSteps: external
      ? [external]
      : [
          `Break the problem down: identify what "${question}" is really asking before solving.`,
          `Recall the core ${subject} concept or formula that applies here.`,
          'Work through a similar, simpler example first to check your method.',
          'Solve step-by-step, showing your work so mistakes are easy to spot.',
          'Double-check units, signs, and whether the final answer is reasonable.',
        ],
    resources: [
      { label: `${subject} core concepts review`, type: 'reading' },
      { label: `${subject} practice problem set`, type: 'practice' },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function performancePrediction(studentUserId: string) {
  const studentId = await studentService.resolveStudentProfileId(studentUserId);
  const [subjects, summary] = await Promise.all([
    studentService.getSubjectGrades(studentId),
    studentService.getDashboardSummary(studentId),
  ]);

  const decliningCount = subjects.filter((s) => s.trend === 'down').length;
  const avgScore = subjects.length ? subjects.reduce((s, x) => s + x.score, 0) / subjects.length : 0;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (decliningCount >= 2 || summary.attendancePercent < 85 || avgScore < 70) riskLevel = 'high';
  else if (decliningCount === 1 || summary.attendancePercent < 92 || avgScore < 82) riskLevel = 'medium';

  return {
    studentId,
    predictedGpaTrend: decliningCount === 0 ? 'stable_or_improving' : 'at_risk',
    riskLevel,
    confidence: subjects.length >= 3 ? 'high' : 'low',
    keyFactors: [
      `${decliningCount} subject(s) trending downward`,
      `Attendance at ${summary.attendancePercent}%`,
      `Average score across subjects: ${avgScore.toFixed(1)}%`,
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function wellnessAnalysis(studentUserId: string) {
  const studentId = await studentService.resolveStudentProfileId(studentUserId);
  const entries = await wellnessService.getMoodEntries(studentId, 7);

  if (!entries.length) {
    return {
      studentId,
      averageMoodLast7Days: null,
      trend: 'insufficient_data',
      flags: [],
      recommendation: 'Encourage a daily check-in to start tracking wellness trends.',
      generatedAt: new Date().toISOString(),
    };
  }

  const average = entries.reduce((s, e) => s + e.score, 0) / entries.length;
  const flags: string[] = [];
  if (average <= 2) flags.push('sustained_low_mood');
  if (entries.length >= 3 && entries.slice(0, 3).every((e) => e.score <= 2)) {
    flags.push('three_consecutive_low_entries');
  }

  return {
    studentId,
    averageMoodLast7Days: Number(average.toFixed(2)),
    trend: average >= 4 ? 'positive' : average >= 3 ? 'neutral' : 'concerning',
    flags,
    recommendation: flags.length
      ? 'Recommend a confidential check-in with the campus counselor.'
      : 'No concerning patterns detected — continue regular check-ins.',
    generatedAt: new Date().toISOString(),
  };
}

export async function parentWeeklyReport(parentUserId: string, studentProfileId: string) {
  const parentId = await parentService.resolveParentProfileId(parentUserId);
  const children = await parentService.getChildren(parentId);
  const child = children.find((c) => c.id === studentProfileId);
  if (!child) throw AppError.forbidden('This student is not linked to your parent account.');

  const wellness = await wellnessAnalysis(
    (await prisma.studentProfile.findUniqueOrThrow({ where: { id: studentProfileId } })).userId,
  );

  return {
    student: { id: child.id, name: child.name, grade: child.grade },
    academic: { gpa: child.gpa, attendancePercent: child.attendancePercent },
    transport: { busRoute: child.busRoute, busStatus: child.busStatus },
    fees: { status: child.feeStatus, pendingAmount: child.pendingFeeAmount },
    wellness: { averageMood: wellness.averageMoodLast7Days, trend: wellness.trend },
    generatedAt: new Date().toISOString(),
  };
}

export async function studentProgressSummary(studentUserId: string) {
  const studentId = await studentService.resolveStudentProfileId(studentUserId);
  const [subjects, assignments, badges, summary] = await Promise.all([
    studentService.getSubjectGrades(studentId),
    studentService.getAssignmentsForStudent(studentId),
    studentService.getBadges(studentId),
    studentService.getDashboardSummary(studentId),
  ]);

  return {
    studentId,
    gpa: summary.gpa,
    attendancePercent: summary.attendancePercent,
    subjectsTracked: subjects.length,
    strongestSubject: [...subjects].sort((a, b) => b.score - a.score)[0]?.subject ?? null,
    weakestSubject: [...subjects].sort((a, b) => a.score - b.score)[0]?.subject ?? null,
    assignmentsPending: assignments.filter((a) => a.status === 'pending').length,
    assignmentsGraded: assignments.filter((a) => a.status === 'graded').length,
    badgesEarned: badges.length,
    xpPoints: summary.xpPoints,
    generatedAt: new Date().toISOString(),
  };
}
