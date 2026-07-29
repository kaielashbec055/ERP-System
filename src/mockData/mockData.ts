import {
  UserProfile,
  SubjectGrade,
  Assignment,
  AchievementBadge,
  MoodEntry,
  ChildInfo,
  StrugglingStudentAlert,
  BusTrackingInfo,
  DigitalGatePass,
  EmergencyAlert,
  CircularAnnouncement,
  NotificationItem,
  ChatMessage
} from '../types';

export const MOCK_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_std_01',
    name: 'Alex Vance',
    email: 'alex.vance@edupulse.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Student',
    gradeOrSubject: 'Grade 10 - Section A'
  },
  parent: {
    id: 'usr_prt_01',
    name: 'Sarah Vance',
    email: 'sarah.vance@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Parent',
    gradeOrSubject: 'Parent of Alex & Maya'
  },
  teacher: {
    id: 'usr_tch_01',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@edupulse.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    title: 'Senior STEM Educator',
    gradeOrSubject: 'Physics & Advanced Mathematics'
  },
  admin: {
    id: 'usr_adm_01',
    name: 'Dr. Eleanor Vance',
    email: 'principal@edupulse.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'School Principal & Director',
    gradeOrSubject: 'Central Administration'
  }
};

export const MOCK_STUDENT_SUBJECTS: SubjectGrade[] = [
  { subject: 'Advanced Physics', score: 94, grade: 'A', teacher: 'Dr. Marcus Thorne', trend: 'up', lastTestScore: 96 },
  { subject: 'Algebra & Calculus', score: 88, grade: 'A-', teacher: 'Mrs. Rebecca Sterling', trend: 'up', lastTestScore: 90 },
  { subject: 'Computer Science', score: 98, grade: 'A+', teacher: 'Mr. David Zhang', trend: 'stable', lastTestScore: 98 },
  { subject: 'World History', score: 82, grade: 'B+', teacher: 'Dr. Harrison Ford', trend: 'down', lastTestScore: 78 },
  { subject: 'Chemistry', score: 91, grade: 'A', teacher: 'Dr. Elena Rostova', trend: 'up', lastTestScore: 92 },
  { subject: 'English Literature', score: 87, grade: 'B+', teacher: 'Ms. Clara Bennett', trend: 'stable', lastTestScore: 86 }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01',
    title: 'Quantum Wave Functions Problem Set',
    subject: 'Advanced Physics',
    dueDate: '2026-07-31',
    status: 'pending',
    maxScore: 100,
    priority: 'high'
  },
  {
    id: 'asg_02',
    title: 'Sorting Algorithms Implementation',
    subject: 'Computer Science',
    dueDate: '2026-08-02',
    status: 'submitted',
    score: 98,
    maxScore: 100,
    priority: 'medium'
  },
  {
    id: 'asg_03',
    title: 'Industrial Revolution Analytical Essay',
    subject: 'World History',
    dueDate: '2026-08-04',
    status: 'pending',
    maxScore: 50,
    priority: 'medium'
  },
  {
    id: 'asg_04',
    title: 'Organic Chemistry Lab Report #4',
    subject: 'Chemistry',
    dueDate: '2026-08-05',
    status: 'pending',
    maxScore: 100,
    priority: 'low'
  }
];

export const MOCK_BADGES: AchievementBadge[] = [
  {
    id: 'bdg_01',
    title: 'STEM Genius',
    description: 'Maintained 95%+ average in Science & Coding for 3 consecutive terms.',
    iconName: 'Zap',
    dateEarned: '2026-06-15',
    category: 'academic'
  },
  {
    id: 'bdg_02',
    title: 'Perfect Attendance',
    description: '100% attendance recorded over 60 consecutive school days.',
    iconName: 'Award',
    dateEarned: '2026-07-01',
    category: 'attendance'
  },
  {
    id: 'bdg_03',
    title: 'Mindfulness Champion',
    description: 'Completed 14 consecutive daily wellness check-ins.',
    iconName: 'Heart',
    dateEarned: '2026-07-20',
    category: 'wellness'
  },
  {
    id: 'bdg_04',
    title: 'Safety Pioneer',
    description: 'Verified bus check-in logger badge for digital security.',
    iconName: 'ShieldCheck',
    dateEarned: '2026-05-10',
    category: 'safety'
  }
];

export const MOCK_MOOD_ENTRIES: MoodEntry[] = [
  { id: 'm_01', date: '2026-07-29', score: 4, tags: ['Energized', 'Focused', 'Prepared'], note: 'Felt great during Physics lab!' },
  { id: 'm_02', date: '2026-07-28', score: 3, tags: ['Neutral', 'Tired'], note: 'Late night finishing History assignment.' },
  { id: 'm_03', date: '2026-07-27', score: 5, tags: ['Happy', 'Motivated', 'Proud'], note: 'Got top score in CS exam!' },
  { id: 'm_04', date: '2026-07-26', score: 4, tags: ['Relaxed', 'Family'], note: 'Weekend prep went smooth.' },
  { id: 'm_05', date: '2026-07-25', score: 2, tags: ['Anxious', 'Exam Stress'], note: 'Worried about History test result.' },
  { id: 'm_06', date: '2026-07-24', score: 4, tags: ['Calm', 'Balanced'] },
  { id: 'm_07', date: '2026-07-23', score: 5, tags: ['Optimistic', 'High Energy'] }
];

export const MOCK_CHILDREN: ChildInfo[] = [
  {
    id: 'c_01',
    name: 'Alex Vance',
    grade: 'Grade 10',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gpa: 3.88,
    attendancePercent: 97.5,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'paid',
    pendingFeeAmount: 0
  },
  {
    id: 'c_02',
    name: 'Maya Vance',
    grade: 'Grade 6',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gpa: 3.92,
    attendancePercent: 99.0,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'pending',
    pendingFeeAmount: 450
  }
];

export const MOCK_RISK_ALERTS: StrugglingStudentAlert[] = [
  {
    id: 'r_01',
    studentId: 'std_102',
    studentName: 'Liam Hemsworth',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'academic',
    severity: 'high',
    reason: 'Score dropped 22% in Physics homework; missed 2 consecutive labs.',
    aiRecommendation: 'Recommend scheduling 1-on-1 review session for Newton\'s Laws & assignment deadline extension.',
    dateFlagged: '2026-07-28'
  },
  {
    id: 'r_02',
    studentId: 'std_105',
    studentName: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'wellness',
    severity: 'high',
    reason: 'Logged score 1 (Very Sad) for 3 consecutive days; high exam stress indicated.',
    aiRecommendation: 'Counselor flag raised automatically. Recommend gentle check-in by Ms. Harper.',
    dateFlagged: '2026-07-29'
  },
  {
    id: 'r_03',
    studentId: 'std_108',
    studentName: 'Ethan Wright',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'attendance',
    severity: 'medium',
    reason: 'Unexcused absence on Monday & Friday mornings over past 2 weeks.',
    aiRecommendation: 'Send automated attendance verification request to parent via EduPulse app.',
    dateFlagged: '2026-07-27'
  }
];

export const MOCK_BUS_TRACKER: BusTrackingInfo = {
  busId: 'bus_14',
  busNumber: 'BUS-14',
  driverName: 'Robert Jenkins',
  driverPhone: '+1 (555) 382-9910',
  routeNumber: 'Route 14',
  routeName: 'North Sector -> Central Campus',
  currentSpeed: 38,
  speedLimit: 45,
  status: 'on_time',
  etaMinutes: 8,
  passengerCount: 28,
  maxCapacity: 40,
  currentBusPos: { x: 340, y: 160 },
  stops: [
    { id: 'st_1', name: 'Oakridge Estate Gate 2', time: '07:30 AM', passed: true, coords: { x: 80, y: 80 } },
    { id: 'st_2', name: 'Pinecrest Apartments', time: '07:42 AM', passed: true, coords: { x: 210, y: 120 } },
    { id: 'st_3', name: 'Maple Street Circle (Vance Stop)', time: '07:54 AM', passed: false, coords: { x: 380, y: 180 } },
    { id: 'st_4', name: 'Westside Transit Hub', time: '08:05 AM', passed: false, coords: { x: 520, y: 240 } },
    { id: 'st_5', name: 'EduPulse Academy Main Gate', time: '08:15 AM', passed: false, coords: { x: 650, y: 300 } }
  ]
};

export const MOCK_GATE_PASSES: DigitalGatePass[] = [
  {
    id: 'gp_01',
    studentName: 'Alex Vance',
    studentId: 'usr_std_01',
    parentName: 'Sarah Vance',
    reason: 'Scheduled Orthodontist Appointment',
    date: '2026-07-30',
    timeOut: '01:30 PM',
    status: 'approved',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-EDUPULSE-2026-778912',
    pickupPerson: 'Sarah Vance (Mother)'
  },
  {
    id: 'gp_02',
    studentName: 'Maya Vance',
    studentId: 'c_02',
    parentName: 'Sarah Vance',
    reason: 'Family Emergency Leave',
    date: '2026-07-22',
    timeOut: '11:00 AM',
    status: 'used',
    pickupPerson: 'David Vance (Father)'
  }
];

export const MOCK_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'emg_01',
    type: 'weather',
    title: 'Heavy Rain Warning & Early Bus Dispatch',
    message: 'Due to severe torrential rainfall, afternoon buses will depart at 02:30 PM today. Parents picking up children directly please report to Gate B.',
    issuedBy: 'Admin Office - Dr. Eleanor Vance',
    timestamp: '2026-07-29 11:45 AM',
    status: 'active',
    severity: 'warning'
  },
  {
    id: 'emg_02',
    type: 'medical',
    title: 'Routine Health Checkup Drill Complete',
    message: 'Grade 9-12 annual eye & dental screenings concluded smoothly.',
    issuedBy: 'School Medical Clinic',
    timestamp: '2026-07-25 04:00 PM',
    status: 'resolved',
    severity: 'info'
  }
];

export const MOCK_CIRCULARS: CircularAnnouncement[] = [
  {
    id: 'circ_01',
    title: 'Annual Science & AI Innovation Fair 2026',
    content: 'Registration is now open for students from Grades 8 to 12. Top projects win full robotics kits and mentorship from university labs.',
    category: 'Event',
    date: '2026-07-28',
    author: 'STEM Department',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 2
  },
  {
    id: 'circ_02',
    title: 'Important: Mid-Term Examination Schedule Released',
    content: 'The mid-term examination timetable for Term II has been published. Parents can review the subject breakdown in the Parent Portal.',
    category: 'Academic',
    date: '2026-07-26',
    author: 'Academic Council',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 1
  },
  {
    id: 'circ_03',
    title: 'Bus Route #14 Timetable Micro-Adjustment',
    content: 'Please note morning pick-up times for Stops #2 and #3 will be advanced by 4 minutes starting next Monday due to road expansion works.',
    category: 'Transport',
    date: '2026-07-24',
    author: 'Transport Manager',
    targetRoles: ['parent', 'student'],
    attachmentsCount: 0
  },
  {
    id: 'circ_04',
    title: 'Weekly Mindfulness & Wellness Workshop',
    content: 'Join our certified adolescent mental health counselor Ms. Harper every Thursday at 3:30 PM in the Library Media Center.',
    category: 'Wellness',
    date: '2026-07-20',
    author: 'Counseling Cell',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 1
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Bus Approaching Stop',
    message: 'Bus-14 is 5 minutes away from Maple Street Circle (Vance Stop).',
    timestamp: '10 mins ago',
    read: false,
    type: 'transport'
  },
  {
    id: 'notif_02',
    title: 'New Physics Assignment Graded',
    message: 'Alex Vance scored 96/100 on Quantum Wave Functions Lab.',
    timestamp: '2 hours ago',
    read: false,
    type: 'academic'
  },
  {
    id: 'notif_03',
    title: 'Weather Warning Notification',
    message: 'Heavy rain alert issued. Early bus departure scheduled for 02:30 PM.',
    timestamp: '3 hours ago',
    read: true,
    type: 'alert'
  },
  {
    id: 'notif_04',
    title: 'Gate Pass Approved',
    message: 'Digital Gate Pass #GP-EDUPULSE-2026 for July 30 approved by Admin.',
    timestamp: '1 day ago',
    read: true,
    type: 'wellness'
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    senderId: 'usr_tch_01',
    senderName: 'Dr. Marcus Thorne',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    text: 'Hello Mrs. Vance, I wanted to compliment Alex on his outstanding physics lab submission this week. His analytical approach to wave functions was top-notch!',
    timestamp: 'Yesterday 04:15 PM'
  },
  {
    id: 'msg_02',
    senderId: 'usr_prt_01',
    senderName: 'Sarah Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'parent',
    text: 'Thank you so much Dr. Thorne! He spent quite a bit of time working on it. Is there any reading material you recommend for the upcoming mid-terms?',
    timestamp: 'Yesterday 05:00 PM'
  },
  {
    id: 'msg_03',
    senderId: 'usr_tch_01',
    senderName: 'Dr. Marcus Thorne',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    text: 'Yes! Chapter 6 in the Advanced STEM e-book covers wave mechanics and thermodynamics. I have also shared study prompts with the AI assistant.',
    timestamp: 'Today 09:30 AM'
  }
];
