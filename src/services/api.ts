// ============================================================================
// EduPulse ERP — API Client & Integration Layer
// Connects React/Vite Frontend to Node.js/Express/Prisma Backend
// Base URL: http://localhost:5000/api/v1
// ============================================================================

import {
  UserProfile,
  UserRole,
  SubjectGrade,
  Assignment,
  AchievementBadge,
  ChildInfo,
  StrugglingStudentAlert,
  BusTrackingInfo,
  DigitalGatePass,
  EmergencyAlert,
  CircularAnnouncement,
  NotificationItem,
  ChatMessage,
  MoodEntry
} from '../types';

import {
  MOCK_USERS,
  MOCK_STUDENT_SUBJECTS,
  MOCK_ASSIGNMENTS,
  MOCK_BADGES,
  MOCK_CHILDREN,
  MOCK_RISK_ALERTS,
  MOCK_BUS_TRACKER,
  MOCK_GATE_PASSES,
  MOCK_EMERGENCY_ALERTS,
  MOCK_CIRCULARS,
  MOCK_NOTIFICATIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_MOOD_ENTRIES
} from '../mockData/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export function getAccessToken(): string | null {
  return localStorage.getItem('edupulse_access_token');
}

export function setAccessToken(token: string) {
  localStorage.setItem('edupulse_access_token', token);
}

export function setRefreshToken(token: string) {
  localStorage.setItem('edupulse_refresh_token', token);
}

export function clearTokens() {
  localStorage.removeItem('edupulse_access_token');
  localStorage.removeItem('edupulse_refresh_token');
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {})
  };

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    const body: ApiResponse<T> = await res.json();
    if (!body.success) {
      throw new Error(body.message || 'API request failed');
    }
    return body.data as T;
  } catch (err: any) {
    console.warn(`[API] Server offline or fetch failed for ${path}. Using fallback handler:`, err?.message);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 1. AUTH API
// ---------------------------------------------------------------------------

export async function loginApi(email: string, password?: string): Promise<{ user: UserProfile; accessToken: string }> {
  try {
    const data = await apiFetch<{ user: UserProfile; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || 'Password123!' })
    });
    setAccessToken(data.tokens.accessToken);
    setRefreshToken(data.tokens.refreshToken);
    return { user: data.user, accessToken: data.tokens.accessToken };
  } catch {
    // Local Dev Fallback if backend server is not running
    const roleKey: UserRole = email.includes('alex') ? 'student' :
                            email.includes('sarah') ? 'parent' :
                            email.includes('thorne') ? 'teacher' : 'admin';
    const fallbackUser = MOCK_USERS[roleKey];
    setAccessToken('mock_access_token_' + roleKey);
    return { user: fallbackUser, accessToken: 'mock_access_token_' + roleKey };
  }
}

export async function getMeApi(): Promise<UserProfile> {
  try {
    return await apiFetch<UserProfile>('/auth/me');
  } catch {
    return MOCK_USERS['student'];
  }
}

// ---------------------------------------------------------------------------
// 2. STUDENT API
// ---------------------------------------------------------------------------

export async function getStudentSubjectsApi(): Promise<SubjectGrade[]> {
  try {
    return await apiFetch<SubjectGrade[]>('/students/me/subjects');
  } catch {
    return MOCK_STUDENT_SUBJECTS;
  }
}

export async function getStudentAssignmentsApi(): Promise<Assignment[]> {
  try {
    return await apiFetch<Assignment[]>('/students/me/assignments');
  } catch {
    return MOCK_ASSIGNMENTS;
  }
}

export async function submitAssignmentApi(id: string): Promise<any> {
  try {
    return await apiFetch(`/students/me/assignments/${id}/submit`, { method: 'POST' });
  } catch {
    return { success: true };
  }
}

export async function getStudentBadgesApi(): Promise<AchievementBadge[]> {
  try {
    return await apiFetch<AchievementBadge[]>('/students/me/badges');
  } catch {
    return MOCK_BADGES;
  }
}

// ---------------------------------------------------------------------------
// 3. PARENT API
// ---------------------------------------------------------------------------

export async function getParentChildrenApi(): Promise<ChildInfo[]> {
  try {
    return await apiFetch<ChildInfo[]>('/parents/me/children');
  } catch {
    return MOCK_CHILDREN;
  }
}

// ---------------------------------------------------------------------------
// 4. SAFETY & TRANSPORT API
// ---------------------------------------------------------------------------

export async function getBusTrackingInfoApi(busId?: string): Promise<BusTrackingInfo> {
  try {
    return await apiFetch<BusTrackingInfo>(`/safety/bus/${busId || 'BUS-14'}`);
  } catch {
    return MOCK_BUS_TRACKER;
  }
}

export async function getGatePassesApi(): Promise<DigitalGatePass[]> {
  try {
    return await apiFetch<DigitalGatePass[]>('/safety/gate-passes');
  } catch {
    return MOCK_GATE_PASSES;
  }
}

export async function createGatePassApi(payload: Partial<DigitalGatePass>): Promise<DigitalGatePass> {
  try {
    return await apiFetch<DigitalGatePass>('/safety/gate-passes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch {
    const newPass: DigitalGatePass = {
      id: `pass_${Date.now()}`,
      studentName: payload.studentName || 'Alex Vance',
      studentId: payload.studentId || 'usr_std_01',
      parentName: payload.parentName || 'Sarah Vance',
      reason: payload.reason || 'Medical Leave',
      date: payload.date || new Date().toISOString().split('T')[0],
      timeOut: payload.timeOut || '01:30 PM',
      status: 'approved',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GATEPASS-APPROVED-88219',
      pickupPerson: payload.pickupPerson || 'Sarah Vance (Parent)'
    };
    return newPass;
  }
}

export async function getEmergencyAlertsApi(): Promise<EmergencyAlert[]> {
  try {
    return await apiFetch<EmergencyAlert[]>('/safety/emergency-alerts');
  } catch {
    return MOCK_EMERGENCY_ALERTS;
  }
}

export async function createEmergencyAlertApi(payload: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
  try {
    return await apiFetch<EmergencyAlert>('/safety/emergency-alerts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch {
    const newAlert: EmergencyAlert = {
      id: `sos_${Date.now()}`,
      type: payload.type || 'medical',
      title: payload.title || 'URGENT SOS ALERT',
      message: payload.message || 'Campus emergency alert triggered.',
      issuedBy: payload.issuedBy || 'System Admin',
      timestamp: 'Just now',
      status: 'active',
      severity: payload.severity || 'critical'
    };
    return newAlert;
  }
}

// ---------------------------------------------------------------------------
// 5. WELLNESS API
// ---------------------------------------------------------------------------

export async function getMoodEntriesApi(): Promise<MoodEntry[]> {
  try {
    return await apiFetch<MoodEntry[]>('/wellness/mood');
  } catch {
    return MOCK_MOOD_ENTRIES;
  }
}

export async function createMoodEntryApi(payload: Partial<MoodEntry>): Promise<MoodEntry> {
  try {
    return await apiFetch<MoodEntry>('/wellness/mood', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch {
    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: payload.date || new Date().toISOString().split('T')[0],
      score: payload.score || 4,
      tags: payload.tags || ['Daily Check-in'],
      note: payload.note
    };
    return newEntry;
  }
}

export async function getRiskAlertsApi(): Promise<StrugglingStudentAlert[]> {
  try {
    return await apiFetch<StrugglingStudentAlert[]>('/wellness/risk-alerts');
  } catch {
    return MOCK_RISK_ALERTS;
  }
}

// ---------------------------------------------------------------------------
// 6. COMMUNICATION API
// ---------------------------------------------------------------------------

export async function getAnnouncementsApi(): Promise<CircularAnnouncement[]> {
  try {
    const res = await apiFetch<{ items: CircularAnnouncement[] }>('/communication/announcements');
    return res.items || [];
  } catch {
    return MOCK_CIRCULARS;
  }
}

export async function getNotificationsApi(): Promise<NotificationItem[]> {
  try {
    return await apiFetch<NotificationItem[]>('/communication/notifications');
  } catch {
    return MOCK_NOTIFICATIONS;
  }
}

export async function markNotificationReadApi(id: string): Promise<any> {
  try {
    return await apiFetch(`/communication/notifications/${id}/read`, { method: 'PATCH' });
  } catch {
    return { success: true };
  }
}

// ---------------------------------------------------------------------------
// 7. AI ASSISTANT API
// ---------------------------------------------------------------------------

export async function sendAiChatApi(prompt: string, userRole: UserRole): Promise<{ text: string; suggestedActions?: string[] }> {
  try {
    return await apiFetch<{ text: string; suggestedActions?: string[] }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, role: userRole })
    });
  } catch {
    const query = prompt.toLowerCase().trim();

    // 1. Photosynthesis & Biology
    if (query.includes('photosynthesis') || query.includes('plant') || query.includes('leaf') || query.includes('chlorophyll')) {
      return {
        text: `🌱 **Photosynthesis Explained Step-by-Step**:\n\nPhotosynthesis is the fundamental biological process where green plants convert solar energy into chemical food energy.\n\n1. **Inputs Needed**: Sunlight + Carbon Dioxide (CO₂) + Water (H₂O)\n2. **Chemical Formula**: 6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)\n3. **Where It Happens**: Inside the **Chloroplasts** using green chlorophyll pigment.\n4. **Why It Matters**: It supplies oxygen for human and animal respiration and forms the base of Earth's food chain!`,
        suggestedActions: ['Take Science Quiz', 'Cell Structure Notes', 'Contact Educator']
      };
    }

    // 2. Physics, Gravity & Motion
    if (query.includes('physics') || query.includes('newton') || query.includes('gravity') || query.includes('motion') || query.includes('force')) {
      return {
        text: `⚡ **Physics & Laws of Motion Detailed Explanation**:\n\n• **Gravity**: The universal attractive force between objects with mass. Acceleration due to gravity on Earth is **g = 9.8 m/s²**.\n• **Newton's First Law**: Objects stay in motion or rest unless acted on by net external force.\n• **Newton's Second Law**: **Force = Mass × Acceleration (F = m · a)**\n• **Newton's Third Law**: For every action, there is an equal and opposite reaction.\n\n📚 **Practice Tip**: Next Physics test is coming up in Period 2 (Room 305)!`,
        suggestedActions: ['Solve Motion Equations', 'View Class Timetable', 'Ask Dr. Thorne']
      };
    }

    // 3. Math & Equation Solving
    if (query.includes('math') || query.includes('solve') || query.includes('equation') || query.includes('+') || query.includes('-') || query.includes('*') || query.includes('/') || query.includes('fraction') || query.includes('algebra')) {
      // Try parsing numeric patterns if any equation was entered
      const eqMatch = prompt.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      let solutionStr = '';
      if (eqMatch) {
        const n1 = parseFloat(eqMatch[1]);
        const op = eqMatch[2];
        const n2 = parseFloat(eqMatch[3]);
        let res = 0;
        if (op === '+') res = n1 + n2;
        if (op === '-') res = n1 - n2;
        if (op === '*') res = n1 * n2;
        if (op === '/') res = n2 !== 0 ? n1 / n2 : 0;
        solutionStr = `\n\n🔢 **Instant Calculation**: ${n1} ${op} ${n2} = **${res}**`;
      }

      return {
        text: `📐 **Step-by-Step Math Solution & Explanation**:${solutionStr}\n\n1. **Identify Given Info**: Separate known constants from unknown variables.\n2. **Order of Operations (PEMDAS/BODMAS)**: Parentheses ➔ Exponents ➔ Multiplication/Division ➔ Addition/Subtraction.\n3. **Isolate Variable**: Apply inverse operations on both sides to solve for 'x'.\n\n🎯 **Active Quest**: Complete 3 Math Quizzes in the Learning Module for **+100 XP**!`,
        suggestedActions: ['Play Math Quest', 'Submit Assignment', 'Ask AI Buddy']
      };
    }

    // 4. Bus Tracking & Telemetry
    if (query.includes('bus') || query.includes('eta') || query.includes('location') || query.includes('route') || query.includes('driver')) {
      return {
        text: `🚌 **Live Bus Telemetry Status (School Bus KA 09 AB 1234)**:\n\n• **Status**: BUS ON THE WAY\n• **Current Location**: Maple Street Circle (Vance Stop)\n• **Distance**: 2.5 km from school\n• **ETA**: 10 minutes\n• **Speed**: 28 km/h (Safe Corridor)\n• **Driver**: Robert Jenkins (Call: +1-555-382-9910)`,
        suggestedActions: ['Open Live Bus Map', 'Call Driver Hotline', 'Check Gate Pass']
      };
    }

    // 5. Attendance & Student Records
    if (query.includes('attendance') || query.includes('present') || query.includes('absent') || query.includes('leave')) {
      return {
        text: `✅ **Attendance Telemetry Report (Class 5-A / Grade 10)**:\n\n• **Student**: Aarav Sharma (Class 5-A)\n• **Today's Status**: PRESENT (Gate Pass QR scanned at 08:15 AM)\n• **Cumulative Attendance**: 95% Present (60 of 62 School Days)\n• **Class Breakdown**: 32 Students Enrolled (28 Present, 4 Absent today).`,
        suggestedActions: ['Request Digital Gate Pass', 'View Attendance Log', 'Contact Parent']
      };
    }

    // 6. Schedule & Timetable
    if (query.includes('schedule') || query.includes('timetable') || query.includes('class') || query.includes('today')) {
      return {
        text: `📅 **Today's Class Schedule (28 May)**:\n\n1. 📐 **Math**: 09:00 AM - 10:00 AM (Room 201)\n2. 🧪 **Science**: 10:15 AM - 11:15 AM (Room 305)\n3. 📚 **English**: 11:30 AM - 12:30 PM (Room 102)\n4. 🎨 **Art & Craft**: 01:30 PM - 02:30 PM (Room 204)\n5. 🏛️ **History**: 03:00 PM - 04:00 PM (Room 101)`,
        suggestedActions: ['View Homework Tasks', 'Ask AI Study Buddy', 'Check Assignments']
      };
    }

    // 7. Fee & Payments
    if (query.includes('fee') || query.includes('pay') || query.includes('tuition') || query.includes('cost')) {
      return {
        text: `💳 **School Fee Portal Summary**:\n\n• **Term II Tuition & Transport**: $450.00 USD\n• **Due Date**: August 10, 2026\n• **Status**: Pending Payment\n• **Payer**: Priya Sharma (Parent)`,
        suggestedActions: ['Pay Term Fee ($450)', 'Download Receipt', 'Contact Accounts']
      };
    }

    // 8. General Dynamic Query Explanation Handler for ALL other topics
    const cleanTopic = prompt.replace(/explain|what is|how to|can you|tell me about|help me with/gi, '').trim();
    const topicCapitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

    return {
      text: `💡 **EduSync AI Explanation for "${topicCapitalized || prompt}"**:\n\nHere is a clear breakdown of **${topicCapitalized || prompt}**:\n\n1. **Core Concept**: ${topicCapitalized || prompt} is a key subject topic. It involves understanding underlying principles, step-by-step logic, and real-world application.\n2. **Key Takeaway**: Breaking down complex topics into smaller components makes them easier to master.\n3. **Study Strategy**: Review class notes, practice sample questions, or ask your educator (Mrs. Sharma / Dr. Thorne) for tailored guidance.\n\nNeed further clarification on this topic? Feel free to ask a follow-up question!`,
      suggestedActions: [`More on ${topicCapitalized || 'this topic'}`, 'Contact Educator', 'Take Practice Quiz']
    };
  }
}
