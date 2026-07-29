# Wiring the EduPulse frontend to this backend

The uploaded frontend (`ERP-System-main.zip`) currently has **zero network
calls** — everything comes from `src/mockData/mockData.ts` through
`AppContext`/`ChatContext`. This backend's response shapes are an exact
match for the frontend's TypeScript interfaces (`src/types/index.ts`), so
wiring them together is mechanical: replace each mock import with a fetch
call that returns the same shape. No component, route, prop, or field name
needs to change.

This guide gives you the mapping and a minimal API client to drop in.

## 1. Add a tiny API client

Create `src/lib/api.ts` in the frontend project:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

function getAccessToken() {
  return localStorage.getItem('edupulse_access_token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json();
  if (!body.success) throw new Error(body.message || 'Request failed');
  return body.data as T;
}
```

Every endpoint returns `{ success, message, data, errors }` — `apiFetch`
unwraps `data` for you and throws `message` on failure.

## 2. Auth — replace AuthModal's local role-switch with a real login

`AuthModal.tsx`'s `handleLogin` currently just calls `setRole(selectedRole)`
locally. Replace it with:

```ts
const { user, tokens } = await apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
localStorage.setItem('edupulse_access_token', tokens.accessToken);
localStorage.setItem('edupulse_refresh_token', tokens.refreshToken);
setRole(user.role);       // 'student' | 'parent' | 'teacher' | 'admin' — same union type
setIsLandingPage(false);
setIsAuthModalOpen(false);
```

`user` returned here is already the exact `UserProfile` shape — you can
store it in `AppContext` state instead of pulling from `MOCK_USERS`.

## 3. Mock import → API endpoint map

| Frontend import (from `mockData.ts`)       | Replace with                                                      | Notes |
|---------------------------------------------|----------------------------------------------------------------------|-------|
| `MOCK_USERS[role]`                          | `GET /auth/me`                                                        | Exact `UserProfile` shape |
| `MOCK_STUDENT_SUBJECTS`                     | `GET /students/me/subjects`                                            | Exact `SubjectGrade[]` shape |
| `MOCK_ASSIGNMENTS`                          | `GET /students/me/assignments`                                          | Exact `Assignment[]` shape |
| — (submit action in `StudentDashboard.tsx`) | `POST /students/me/assignments/:id/submit`                              | |
| `MOCK_BADGES`                               | `GET /students/me/badges`                                               | Exact `AchievementBadge[]` shape |
| `MOCK_CHILDREN`                             | `GET /parents/me/children`                                              | Exact `ChildInfo[]` shape |
| `MOCK_RISK_ALERTS`                          | `GET /wellness/risk-alerts`                                              | Exact `StrugglingStudentAlert[]` shape |
| `MOCK_BUS_TRACKER`                          | `GET /safety/bus/:busId` or `GET /safety/bus/for-child/:studentId`       | Exact `BusTrackingInfo` shape; also live via socket `bus:update` |
| `MOCK_GATE_PASSES`                          | `GET /safety/gate-passes`                                                | Exact `DigitalGatePass[]` shape |
| — (`addGatePass` in `AppContext.tsx`)       | `POST /safety/gate-passes`                                                | |
| `MOCK_EMERGENCY_ALERTS`                     | `GET /safety/emergency-alerts`                                            | Exact `EmergencyAlert[]` shape |
| — (`triggerEmergencyAlert` in `AppContext.tsx`) | `POST /safety/emergency-alerts`                                       | Also broadcasts live via socket `emergency:alert` |
| `MOCK_CIRCULARS`                            | `GET /communication/announcements`                                        | Exact `CircularAnnouncement[]` shape (now paginated: response is `{ items, meta }`) |
| `MOCK_NOTIFICATIONS`                        | `GET /communication/notifications`                                        | Exact `NotificationItem[]` shape |
| — (`markNotificationRead` in `AppContext.tsx`) | `PATCH /communication/notifications/:id/read`                          | |
| `MOCK_CHAT_MESSAGES`                        | `GET /communication/chat/conversations/:id/messages`                       | Exact `ChatMessage[]` shape; conversation id from `POST /communication/chat/conversations` |
| `MOCK_MOOD_ENTRIES` / `addMoodEntry`        | `GET /wellness/mood` / `POST /wellness/mood`                              | Exact `MoodEntry[]` shape |
| ChatContext's `generateAIResponse` (client-side rules) | `POST /ai/chat` with `{ prompt }`                              | Returns `{ text, suggestedActions }` — same fields the UI already renders |

## 4. Live features (Socket.IO)

Add once, e.g. in `AppContext.tsx`:

```ts
import { io } from 'socket.io-client';

useEffect(() => {
  const token = localStorage.getItem('edupulse_access_token');
  if (!token) return;
  const socket = io(import.meta.env.VITE_API_BASE_URL_ROOT, { auth: { token } });

  socket.on('notification:new', (n) => setNotifications((prev) => [n, ...prev]));
  socket.on('emergency:alert', (a) => setEmergencyAlerts((prev) => [a, ...prev]));

  return () => { socket.disconnect(); };
}, []);
```

For `BusTracker.tsx`, join the bus room and listen for updates:

```ts
socket.emit('bus:track', busId);
socket.on('bus:update', (dto) => setBusInfo(dto)); // dto matches BusTrackingInfo exactly
```

## 5. Things that intentionally required small additions

The frontend's mock layer has a few client-only conveniences with no
backend equivalent needed (they're pure UI state) — leave these as-is:
`activeTab`, `isLandingPage`, `authMode`, `isSosModalOpen`,
`isAuthModalOpen`, `selectedChild` (once `childrenList` comes from the API,
`selectedChild` still just tracks which one is selected client-side).

## 6. CORS

Set the frontend's dev/deployed origin in the backend's `.env`:

```
CLIENT_URL=http://localhost:5173
ADDITIONAL_CORS_ORIGINS=https://your-deployed-frontend.netlify.app
```
