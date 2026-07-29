/* eslint-disable no-console */
import {
  PrismaClient,
  Role,
  Trend,
  Priority,
  AssignmentStatus,
  BadgeCategory,
  RiskType,
  Severity,
  ChildBusStatus,
  FeeStatus,
  GatePassStatus,
  EmergencyType,
  EmergencyStatus,
  AnnouncementCategory,
  NotificationType,
  BusStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SEED_PASSWORD = 'Password123!';

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log('🌱 Seeding EduPulse database with data matching the frontend mockData.ts …');

  // ---------------------------------------------------------------------
  // Clean slate (safe for dev/demo databases only)
  // ---------------------------------------------------------------------
  const tableNames = [
    'ai_chat_messages',
    'messages',
    'conversation_participants',
    'conversations',
    'notifications',
    'circular_announcements',
    'emergency_alerts',
    'digital_gate_passes',
    'fee_payments',
    'fee_invoices',
    'risk_alerts',
    'mood_entries',
    'attendance_records',
    'achievement_badges',
    'assignment_submissions',
    'assignments',
    'subject_grades',
    'bus_stops',
    'buses',
    'class_subjects',
    'parent_students',
    'student_profiles',
    'parent_profiles',
    'teacher_profiles',
    'school_classes',
    'subjects',
    'refresh_tokens',
    'users',
    'schools',
  ];
  await prisma.$transaction(tableNames.map((t) => prisma.$executeRawUnsafe(`TRUNCATE TABLE "${t}" CASCADE;`)));

  // ---------------------------------------------------------------------
  // School + Classes
  // ---------------------------------------------------------------------
  const school = await prisma.school.create({ data: { name: 'EduPulse Academy' } });

  const grade10A = await prisma.schoolClass.create({
    data: { grade: 'Grade 10', section: 'A', schoolId: school.id },
  });
  const grade6B = await prisma.schoolClass.create({
    data: { grade: 'Grade 6', section: 'B', schoolId: school.id },
  });

  // ---------------------------------------------------------------------
  // Subjects
  // ---------------------------------------------------------------------
  const subjectNames = [
    'Advanced Physics',
    'Algebra & Calculus',
    'Computer Science',
    'World History',
    'Chemistry',
    'English Literature',
  ];
  const subjects: Record<string, { id: string; name: string }> = {};
  for (const name of subjectNames) {
    subjects[name] = await prisma.subject.create({ data: { name } });
  }

  // ---------------------------------------------------------------------
  // Users: core 4 demo personas (match MOCK_USERS exactly)
  // ---------------------------------------------------------------------
  const passwordHash = await hash(SEED_PASSWORD);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Eleanor Vance',
      email: 'principal@edupulse.edu',
      passwordHash,
      role: Role.ADMIN,
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      name: 'Dr. Marcus Thorne',
      email: 'm.thorne@edupulse.edu',
      passwordHash,
      role: Role.TEACHER,
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  });
  const teacherProfile = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser.id,
      title: 'Senior STEM Educator',
      subjectSpecialty: 'Physics & Advanced Mathematics',
    },
  });
  await prisma.schoolClass.update({ where: { id: grade10A.id }, data: { classTeacherId: teacherProfile.id } });

  // Additional subject teachers referenced in MOCK_STUDENT_SUBJECTS
  const extraTeacherDefs = [
    { name: 'Mrs. Rebecca Sterling', subject: 'Algebra & Calculus' },
    { name: 'Mr. David Zhang', subject: 'Computer Science' },
    { name: 'Dr. Harrison Ford', subject: 'World History' },
    { name: 'Dr. Elena Rostova', subject: 'Chemistry' },
    { name: 'Ms. Clara Bennett', subject: 'English Literature' },
  ];
  const extraTeacherProfiles: Record<string, { id: string; userId: string }> = {};
  for (const t of extraTeacherDefs) {
    const u = await prisma.user.create({
      data: {
        name: t.name,
        email: `${t.name.split(' ').slice(-1)[0].toLowerCase()}@edupulse.edu`,
        passwordHash,
        role: Role.TEACHER,
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      },
    });
    extraTeacherProfiles[t.subject] = await prisma.teacherProfile.create({
      data: { userId: u.id, title: 'Subject Teacher', subjectSpecialty: t.subject },
    });
  }

  // Wire every subject to Grade 10-A with its teacher
  await prisma.classSubject.create({
    data: { classId: grade10A.id, subjectId: subjects['Advanced Physics'].id, teacherId: teacherProfile.id },
  });
  for (const [subjectName, profile] of Object.entries(extraTeacherProfiles)) {
    await prisma.classSubject.create({
      data: { classId: grade10A.id, subjectId: subjects[subjectName].id, teacherId: profile.id },
    });
  }

  // ---------------------------------------------------------------------
  // Bus + Stops (matches MOCK_BUS_TRACKER exactly)
  // ---------------------------------------------------------------------
  const bus = await prisma.bus.create({
    data: {
      busNumber: 'BUS-14',
      driverName: 'Robert Jenkins',
      driverPhone: '+1 (555) 382-9910',
      routeNumber: 'Route 14',
      routeName: 'North Sector -> Central Campus',
      speedLimit: 45,
      maxCapacity: 40,
      currentSpeed: 38,
      status: BusStatus.ON_TIME,
      etaMinutes: 8,
      passengerCount: 28,
      currentPosX: 340,
      currentPosY: 160,
      schoolId: school.id,
      stops: {
        create: [
          { name: 'Oakridge Estate Gate 2', time: '07:30 AM', order: 1, passed: true, coordX: 80, coordY: 80 },
          { name: 'Pinecrest Apartments', time: '07:42 AM', order: 2, passed: true, coordX: 210, coordY: 120 },
          {
            name: 'Maple Street Circle (Vance Stop)',
            time: '07:54 AM',
            order: 3,
            passed: false,
            coordX: 380,
            coordY: 180,
          },
          { name: 'Westside Transit Hub', time: '08:05 AM', order: 4, passed: false, coordX: 520, coordY: 240 },
          {
            name: 'EduPulse Academy Main Gate',
            time: '08:15 AM',
            order: 5,
            passed: false,
            coordX: 650,
            coordY: 300,
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------
  // Student: Alex Vance (the primary "student" persona)
  // ---------------------------------------------------------------------
  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Vance',
      email: 'alex.vance@edupulse.edu',
      passwordHash,
      role: Role.STUDENT,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });
  const alex = await prisma.studentProfile.create({
    data: {
      userId: alexUser.id,
      classId: grade10A.id,
      rollNumber: '10A-01',
      gpa: 3.88,
      attendancePercent: 97.5,
      busId: bus.id,
      busStatus: ChildBusStatus.ON_ROUTE,
      feeStatus: FeeStatus.PAID,
      pendingFeeAmount: 0,
      xpPoints: 1450,
      streakDays: 14,
    },
  });

  // Rest of the Grade 10-A roster (used by TeacherDashboard's attendance marker + risk alerts)
  const rosterDefs = [
    { name: 'Liam Hemsworth', roll: '10A-02', avatar: '1539571696357-5a69c17a67c6' },
    { name: 'Sophia Chen', roll: '10A-03', avatar: '1517841905240-472988babdf9' },
    { name: 'Marcus Brody', roll: '10A-04', avatar: '1507003211169-0a1dd7228f2d' },
    { name: 'Chloe Bennett', roll: '10A-05', avatar: '1524504388940-b1c1722653e1' },
    { name: 'Daniel Park', roll: '10A-06', avatar: '1500648767791-00dcc994a43e' },
    { name: 'Ethan Wright', roll: '10A-07', avatar: '1507003211169-0a1dd7228f2d' },
  ];
  const roster: Record<string, { id: string; userId: string }> = {};
  for (const s of rosterDefs) {
    const u = await prisma.user.create({
      data: {
        name: s.name,
        email: `${s.name.toLowerCase().replace(/\s+/g, '.')}@edupulse.edu`,
        passwordHash,
        role: Role.STUDENT,
        avatarUrl: `https://images.unsplash.com/photo-${s.avatar}?w=150&auto=format&fit=crop&q=80`,
      },
    });
    roster[s.name] = await prisma.studentProfile.create({
      data: {
        userId: u.id,
        classId: grade10A.id,
        rollNumber: s.roll,
        gpa: 3.2,
        attendancePercent: 92,
        feeStatus: FeeStatus.PAID,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Student: Maya Vance (Alex's sibling — second parent-linked child)
  // ---------------------------------------------------------------------
  const mayaUser = await prisma.user.create({
    data: {
      name: 'Maya Vance',
      email: 'maya.vance@edupulse.edu',
      passwordHash,
      role: Role.STUDENT,
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  });
  const maya = await prisma.studentProfile.create({
    data: {
      userId: mayaUser.id,
      classId: grade6B.id,
      rollNumber: '6B-01',
      gpa: 3.92,
      attendancePercent: 99.0,
      busId: bus.id,
      busStatus: ChildBusStatus.ON_ROUTE,
      feeStatus: FeeStatus.PENDING,
      pendingFeeAmount: 450,
    },
  });

  // ---------------------------------------------------------------------
  // Parent: Sarah Vance
  // ---------------------------------------------------------------------
  const parentUser = await prisma.user.create({
    data: {
      name: 'Sarah Vance',
      email: 'sarah.vance@gmail.com',
      passwordHash,
      role: Role.PARENT,
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });
  const parentProfile = await prisma.parentProfile.create({ data: { userId: parentUser.id } });
  await prisma.parentStudent.createMany({
    data: [
      { parentId: parentProfile.id, studentId: alex.id, relation: 'Mother' },
      { parentId: parentProfile.id, studentId: maya.id, relation: 'Mother' },
    ],
  });

  // ---------------------------------------------------------------------
  // Subject grades for Alex (matches MOCK_STUDENT_SUBJECTS exactly)
  // ---------------------------------------------------------------------
  const subjectGradeDefs = [
    { subject: 'Advanced Physics', score: 94, grade: 'A', teacher: teacherProfile.id, trend: Trend.UP, last: 96 },
    {
      subject: 'Algebra & Calculus',
      score: 88,
      grade: 'A-',
      teacher: extraTeacherProfiles['Algebra & Calculus'].id,
      trend: Trend.UP,
      last: 90,
    },
    {
      subject: 'Computer Science',
      score: 98,
      grade: 'A+',
      teacher: extraTeacherProfiles['Computer Science'].id,
      trend: Trend.STABLE,
      last: 98,
    },
    {
      subject: 'World History',
      score: 82,
      grade: 'B+',
      teacher: extraTeacherProfiles['World History'].id,
      trend: Trend.DOWN,
      last: 78,
    },
    {
      subject: 'Chemistry',
      score: 91,
      grade: 'A',
      teacher: extraTeacherProfiles['Chemistry'].id,
      trend: Trend.UP,
      last: 92,
    },
    {
      subject: 'English Literature',
      score: 87,
      grade: 'B+',
      teacher: extraTeacherProfiles['English Literature'].id,
      trend: Trend.STABLE,
      last: 86,
    },
  ];
  for (const g of subjectGradeDefs) {
    await prisma.subjectGrade.create({
      data: {
        studentId: alex.id,
        subjectId: subjects[g.subject].id,
        teacherId: g.teacher,
        score: g.score,
        grade: g.grade,
        trend: g.trend,
        lastTestScore: g.last,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Assignments (matches MOCK_ASSIGNMENTS exactly) + Alex's submissions
  // ---------------------------------------------------------------------
  const assignmentDefs = [
    {
      title: 'Quantum Wave Functions Problem Set',
      subject: 'Advanced Physics',
      teacher: teacherProfile.id,
      dueDate: '2026-07-31',
      status: AssignmentStatus.PENDING,
      maxScore: 100,
      priority: Priority.HIGH,
    },
    {
      title: 'Sorting Algorithms Implementation',
      subject: 'Computer Science',
      teacher: extraTeacherProfiles['Computer Science'].id,
      dueDate: '2026-08-02',
      status: AssignmentStatus.SUBMITTED,
      score: 98,
      maxScore: 100,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Industrial Revolution Analytical Essay',
      subject: 'World History',
      teacher: extraTeacherProfiles['World History'].id,
      dueDate: '2026-08-04',
      status: AssignmentStatus.PENDING,
      maxScore: 50,
      priority: Priority.MEDIUM,
    },
    {
      title: 'Organic Chemistry Lab Report #4',
      subject: 'Chemistry',
      teacher: extraTeacherProfiles['Chemistry'].id,
      dueDate: '2026-08-05',
      status: AssignmentStatus.PENDING,
      maxScore: 100,
      priority: Priority.LOW,
    },
  ];
  for (const a of assignmentDefs) {
    const assignment = await prisma.assignment.create({
      data: {
        title: a.title,
        subjectId: subjects[a.subject].id,
        classId: grade10A.id,
        teacherId: a.teacher,
        dueDate: new Date(a.dueDate),
        maxScore: a.maxScore,
        priority: a.priority,
      },
    });
    // Alex's own submission status/score
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment.id,
        studentId: alex.id,
        status: a.status,
        score: a.score,
        submittedAt: a.status !== AssignmentStatus.PENDING ? new Date() : null,
      },
    });
    // Everyone else in the roster starts PENDING, same as a freshly published assignment
    for (const profile of Object.values(roster)) {
      await prisma.assignmentSubmission.create({
        data: { assignmentId: assignment.id, studentId: profile.id, status: AssignmentStatus.PENDING },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Badges (matches MOCK_BADGES exactly)
  // ---------------------------------------------------------------------
  await prisma.achievementBadge.createMany({
    data: [
      {
        studentId: alex.id,
        title: 'STEM Genius',
        description: 'Maintained 95%+ average in Science & Coding for 3 consecutive terms.',
        iconName: 'Zap',
        category: BadgeCategory.ACADEMIC,
        dateEarned: new Date('2026-06-15'),
      },
      {
        studentId: alex.id,
        title: 'Perfect Attendance',
        description: '100% attendance recorded over 60 consecutive school days.',
        iconName: 'Award',
        category: BadgeCategory.ATTENDANCE,
        dateEarned: new Date('2026-07-01'),
      },
      {
        studentId: alex.id,
        title: 'Mindfulness Champion',
        description: 'Completed 14 consecutive daily wellness check-ins.',
        iconName: 'Heart',
        category: BadgeCategory.WELLNESS,
        dateEarned: new Date('2026-07-20'),
      },
      {
        studentId: alex.id,
        title: 'Safety Pioneer',
        description: 'Verified bus check-in logger badge for digital security.',
        iconName: 'ShieldCheck',
        category: BadgeCategory.SAFETY,
        dateEarned: new Date('2026-05-10'),
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Mood entries (matches MOCK_MOOD_ENTRIES exactly)
  // ---------------------------------------------------------------------
  const moodDefs = [
    { date: '2026-07-29', score: 4, tags: ['Energized', 'Focused', 'Prepared'], note: 'Felt great during Physics lab!' },
    { date: '2026-07-28', score: 3, tags: ['Neutral', 'Tired'], note: 'Late night finishing History assignment.' },
    { date: '2026-07-27', score: 5, tags: ['Happy', 'Motivated', 'Proud'], note: 'Got top score in CS exam!' },
    { date: '2026-07-26', score: 4, tags: ['Relaxed', 'Family'], note: 'Weekend prep went smooth.' },
    { date: '2026-07-25', score: 2, tags: ['Anxious', 'Exam Stress'], note: 'Worried about History test result.' },
    { date: '2026-07-24', score: 4, tags: ['Calm', 'Balanced'], note: null },
    { date: '2026-07-23', score: 5, tags: ['Optimistic', 'High Energy'], note: null },
  ];
  await prisma.moodEntry.createMany({
    data: moodDefs.map((m) => ({ studentId: alex.id, ...m })),
  });

  // ---------------------------------------------------------------------
  // Risk alerts (matches MOCK_RISK_ALERTS exactly)
  // ---------------------------------------------------------------------
  await prisma.strugglingStudentAlert.createMany({
    data: [
      {
        studentId: roster['Liam Hemsworth'].id,
        riskType: RiskType.ACADEMIC,
        severity: Severity.HIGH,
        reason: "Score dropped 22% in Physics homework; missed 2 consecutive labs.",
        aiRecommendation:
          "Recommend scheduling 1-on-1 review session for Newton's Laws & assignment deadline extension.",
        dateFlagged: new Date('2026-07-28'),
      },
      {
        studentId: roster['Chloe Bennett'].id,
        riskType: RiskType.WELLNESS,
        severity: Severity.HIGH,
        reason: 'Logged score 1 (Very Sad) for 3 consecutive days; high exam stress indicated.',
        aiRecommendation: 'Counselor flag raised automatically. Recommend gentle check-in by Ms. Harper.',
        dateFlagged: new Date('2026-07-29'),
      },
      {
        studentId: roster['Ethan Wright'].id,
        riskType: RiskType.ATTENDANCE,
        severity: Severity.MEDIUM,
        reason: 'Unexcused absence on Monday & Friday mornings over past 2 weeks.',
        aiRecommendation: 'Send automated attendance verification request to parent via EduPulse app.',
        dateFlagged: new Date('2026-07-27'),
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Digital Gate Passes (matches MOCK_GATE_PASSES exactly)
  // ---------------------------------------------------------------------
  await prisma.digitalGatePass.create({
    data: {
      studentId: alex.id,
      requestedByUserId: parentUser.id,
      reason: 'Scheduled Orthodontist Appointment',
      date: '2026-07-30',
      timeOut: '01:30 PM',
      status: GatePassStatus.APPROVED,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-EDUPULSE-2026-778912',
      pickupPerson: 'Sarah Vance (Mother)',
    },
  });
  await prisma.digitalGatePass.create({
    data: {
      studentId: maya.id,
      requestedByUserId: parentUser.id,
      reason: 'Family Emergency Leave',
      date: '2026-07-22',
      timeOut: '11:00 AM',
      status: GatePassStatus.USED,
      pickupPerson: 'David Vance (Father)',
    },
  });

  // ---------------------------------------------------------------------
  // Emergency alerts (matches MOCK_EMERGENCY_ALERTS exactly)
  // ---------------------------------------------------------------------
  await prisma.emergencyAlert.create({
    data: {
      type: EmergencyType.WEATHER,
      title: 'Heavy Rain Warning & Early Bus Dispatch',
      message:
        'Due to severe torrential rainfall, afternoon buses will depart at 02:30 PM today. Parents picking up children directly please report to Gate B.',
      issuedByUserId: adminUser.id,
      status: EmergencyStatus.ACTIVE,
      severity: Severity.WARNING,
      createdAt: new Date('2026-07-29T11:45:00'),
    },
  });
  await prisma.emergencyAlert.create({
    data: {
      type: EmergencyType.MEDICAL,
      title: 'Routine Health Checkup Drill Complete',
      message: 'Grade 9-12 annual eye & dental screenings concluded smoothly.',
      issuedByUserId: adminUser.id,
      status: EmergencyStatus.RESOLVED,
      severity: Severity.INFO,
      createdAt: new Date('2026-07-25T16:00:00'),
    },
  });

  // ---------------------------------------------------------------------
  // Circular announcements (matches MOCK_CIRCULARS exactly)
  // ---------------------------------------------------------------------
  const circularDefs = [
    {
      title: 'Annual Science & AI Innovation Fair 2026',
      content:
        'Registration is now open for students from Grades 8 to 12. Top projects win full robotics kits and mentorship from university labs.',
      category: AnnouncementCategory.EVENT,
      author: teacherUser.id,
      targetRoles: [Role.STUDENT, Role.PARENT, Role.TEACHER],
      attachmentsCount: 2,
      date: '2026-07-28',
    },
    {
      title: 'Important: Mid-Term Examination Schedule Released',
      content:
        'The mid-term examination timetable for Term II has been published. Parents can review the subject breakdown in the Parent Portal.',
      category: AnnouncementCategory.ACADEMIC,
      author: adminUser.id,
      targetRoles: [Role.STUDENT, Role.PARENT, Role.TEACHER],
      attachmentsCount: 1,
      date: '2026-07-26',
    },
    {
      title: 'Bus Route #14 Timetable Micro-Adjustment',
      content:
        'Please note morning pick-up times for Stops #2 and #3 will be advanced by 4 minutes starting next Monday due to road expansion works.',
      category: AnnouncementCategory.TRANSPORT,
      author: adminUser.id,
      targetRoles: [Role.PARENT, Role.STUDENT],
      attachmentsCount: 0,
      date: '2026-07-24',
    },
    {
      title: 'Weekly Mindfulness & Wellness Workshop',
      content:
        'Join our certified adolescent mental health counselor Ms. Harper every Thursday at 3:30 PM in the Library Media Center.',
      category: AnnouncementCategory.WELLNESS,
      author: adminUser.id,
      targetRoles: [Role.STUDENT, Role.PARENT, Role.TEACHER],
      attachmentsCount: 1,
      date: '2026-07-20',
    },
  ];
  for (const c of circularDefs) {
    await prisma.circularAnnouncement.create({
      data: {
        title: c.title,
        content: c.content,
        category: c.category,
        authorUserId: c.author,
        targetRoles: c.targetRoles,
        attachmentsCount: c.attachmentsCount,
        schoolId: school.id,
        createdAt: new Date(c.date),
      },
    });
  }

  // ---------------------------------------------------------------------
  // Notifications for Alex (matches MOCK_NOTIFICATIONS exactly)
  // ---------------------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: alexUser.id,
        title: 'Bus Approaching Stop',
        message: 'Bus-14 is 5 minutes away from Maple Street Circle (Vance Stop).',
        type: NotificationType.TRANSPORT,
        read: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        userId: alexUser.id,
        title: 'New Physics Assignment Graded',
        message: 'Alex Vance scored 96/100 on Quantum Wave Functions Lab.',
        type: NotificationType.ACADEMIC,
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: alexUser.id,
        title: 'Weather Warning Notification',
        message: 'Heavy rain alert issued. Early bus departure scheduled for 02:30 PM.',
        type: NotificationType.ALERT,
        read: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        userId: alexUser.id,
        title: 'Gate Pass Approved',
        message: 'Digital Gate Pass #GP-EDUPULSE-2026 for July 30 approved by Admin.',
        type: NotificationType.WELLNESS,
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Chat: Teacher <-> Parent conversation (matches MOCK_CHAT_MESSAGES exactly)
  // ---------------------------------------------------------------------
  const conversation = await prisma.conversation.create({
    data: {
      participants: { create: [{ userId: teacherUser.id }, { userId: parentUser.id }] },
    },
  });
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: teacherUser.id,
      text:
        'Hello Mrs. Vance, I wanted to compliment Alex on his outstanding physics lab submission this week. His analytical approach to wave functions was top-notch!',
      createdAt: new Date('2026-07-28T16:15:00'),
    },
  });
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: parentUser.id,
      text:
        'Thank you so much Dr. Thorne! He spent quite a bit of time working on it. Is there any reading material you recommend for the upcoming mid-terms?',
      createdAt: new Date('2026-07-28T17:00:00'),
    },
  });
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: teacherUser.id,
      text:
        'Yes! Chapter 6 in the Advanced STEM e-book covers wave mechanics and thermodynamics. I have also shared study prompts with the AI assistant.',
      createdAt: new Date('2026-07-29T09:30:00'),
    },
  });

  // ---------------------------------------------------------------------
  // Fee invoices
  // ---------------------------------------------------------------------
  await prisma.feeInvoice.create({
    data: {
      studentId: alex.id,
      term: 'Term II',
      description: 'Term II Tuition & Transport',
      amount: 450,
      dueDate: new Date('2026-08-10'),
      status: FeeStatus.PAID,
    },
  });
  await prisma.feeInvoice.create({
    data: {
      studentId: maya.id,
      term: 'Term II',
      description: 'Term II Tuition & Transport',
      amount: 450,
      dueDate: new Date('2026-08-10'),
      status: FeeStatus.PENDING,
    },
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Demo accounts (all share the same password):');
  console.log(`  Password: ${SEED_PASSWORD}\n`);
  console.log('  Student  -> alex.vance@edupulse.edu');
  console.log('  Parent   -> sarah.vance@gmail.com');
  console.log('  Teacher  -> m.thorne@edupulse.edu');
  console.log('  Admin    -> principal@edupulse.edu\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
