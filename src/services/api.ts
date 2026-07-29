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
    // Smart client-side fallback
    if (prompt.toLowerCase().includes('physics')) {
      return {
        text: "Dr. Thorne's Physics class covers Motion & Thermodynamics. Next test is scheduled for next Tuesday!",
        suggestedActions: ['View Physics Notes', 'Practice Physics Quiz']
      };
    }
    if (prompt.toLowerCase().includes('bus') || prompt.toLowerCase().includes('eta')) {
      return {
        text: 'BUS-14 is currently on Maple Street Circle. Speed: 38 km/h. ETA to Vance Stop is 8 minutes.',
        suggestedActions: ['View Bus Tracker Map', 'Call Driver Hotline']
      };
    }
    return {
      text: `As the ${userRole} AI guide, I'm here to help you manage academics, transport safety, and campus circulars. How can I assist you further?`,
      suggestedActions: ['Check Attendance', 'View Circulars', 'Contact Teacher']
    };
  }
}
