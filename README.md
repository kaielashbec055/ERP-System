# 🎓 EduSync AI — Smart School ERP & Connected Ecosystem

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> **Tagline**: *Every Child. Every Moment. Connected.*

---

## 🚨 The Problem

Traditional educational ERP systems suffer from several critical shortcomings:
1. **Disconnected Personas & Siloed Communication**: Parents, students, teachers, and admins use separate fragmented tools or offline paper systems, creating communication delays and lack of transparency.
2. **Student Disengagement & Academic Burnout**: Conventional learning platforms rely on static assignments and passive grading, failing to motivate young learners or detect early signs of stress and struggling.
3. **Safety & Transport Anxiety**: Parents lack real-time visibility into their child's school bus location, trip status, or gate check-out validation.
4. **Lack of Instant Doubt Resolution**: Students often get stuck during homework or quiz attempts with no immediate help available until the next school day.

---

## 💡 The Proposed Solution: EduSync AI

**EduSync AI** is a unified, full-stack, AI-driven School Enterprise Resource Planning (ERP) platform and student ecosystem designed to connect every stakeholder in real time. 

### Key Highlights & Innovations:
- **Soft Lavender 3D Claymorphic UI**: Premium, responsive user experience optimized for desktop/tablet viewports.
- **Gamified Quest Engine & XP Levels**: Level 5 Little Learner progression, streak flames, wrong attempt alerts (*"Learn and come!"*), and instant AI doubt clearing.
- **24/7 Universal AI Study Buddy**: Embedded AI assistant tailored for every role (Student, Parent, Teacher, Admin).
- **Live Bus Telemetry GPS Tracking**: Real-time vehicle location, speed monitoring, ETA updates, and route timeline.
- **Digital Gate Pass & Security**: QR-code validation for student checkout with instant parent push notification dispatch.
- **Mental Wellness & Early Risk Detection**: Daily mood logger with emotion trends, guided breathing exercises, and AI early warning risk flags for educators.

---

## 🛠️ Complete Tech Stack

### Frontend (Web Client)
- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Custom 3D Claymorphism tokens (`.clay-card`, `.glow-purple`)
- **Animations**: Framer Motion v12
- **Icons & Data Viz**: Lucide React, Recharts
- **Linter & Tools**: Oxlint, GitHub Actions CI/CD

### Backend (REST API Server)
- **Runtime & Language**: Node.js, TypeScript, Express.js
- **Database & ORM**: PostgreSQL / SQLite, Prisma ORM (Schema & Migrations)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Real-Time Communication**: WebSockets (Socket.IO) for instant messaging and notification broadcasts
- **File Storage**: Multer for avatar and assignment upload handling

---

## 👥 Multi-Role Feature Breakdown

### 🎓 1. Student Portal (`Aarav Sharma — Class 5-A, Level 5`)
- **XP Level Progress Bar**: "Level 5 Little Learner" (450 / 900 XP) and 7-Day Streak counter.
- **Today's Schedule**: Timetable cards for Math, Science, English, Art & Craft, and History with room details.
- **Gamified Quests & Quizzes**: Gamified learning modules with wrong attempt tracking and one-click *"🤖 Ask AI Agent to Clear Doubt"*.
- **Bus Telemetry Tracker**: Real-time bus status (School Bus KA 09 AB 1234 — Bus On The Way, 10 min ETA, 2.5 km distance, 28 km/h speed).
- **Daily Mood Check-in**: Emoji sentiment logger (Happy 😊, Okay 😐, Sad 😞) with streak tracking.

### 👨‍👩‍👧 2. Parent Portal (`Priya Sharma`)
- **Multi-Child Switcher**: Real-time child selection interface.
- **Daily Child Timeline**: Reached School (08:15 AM), Math Homework Submitted (10:30 AM), Science Quiz (01:15 PM), Bus Boarded (03:30 PM), Reached Home (04:05 PM).
- **Learning Progress Insights**: *"Great Progress! 📈"* analytics breakdown highlighting strengths (Math, Reading) and areas needing support.
- **Tuition Fee Portal**: Digital fee invoice tracking ($450 Term II Tuition) with one-click payment checkout.

### 👩‍🏫 3. Educator / Teacher Portal (`Mrs. Sharma — Grade 5-A`)
- **Class Attendance Logger**: Interactive register for 32 enrolled students (28 Present, 4 Absent) with auto-sync to parent notifications.
- **Class Analytics Matrix**: Overall score metrics (82% average score, +8% monthly improvement).
- **AI Early Warning System**: Automated risk detection flags (Academic, Wellness, Attendance) with direct parent messaging shortcuts.
- **Homework Publisher**: Assignment creation and distribution portal.

### 🏫 4. Admin Command Center (`Principal Dr. Vance`)
- **Institution Overview**: Total active students, staff attendance, fee revenue collection metrics.
- **Route & Fleet Manager**: Campus bus tracking telemetry control.
- **System Audit Logs & SOS Center**: Real-time campus security alert management.

---

## 📁 Repository Directory Structure

```
ERP-System/
├── backend/                       # Node.js + Express + Prisma API Backend
│   ├── prisma/                    # Database schema & migrations
│   ├── src/
│   │   ├── controllers/           # API request handlers
│   │   ├── middleware/            # Auth, validation, error handling
│   │   ├── routes/                # REST API endpoint definitions
│   │   ├── services/              # Business logic & database operations
│   │   └── index.ts               # Express server entry point
│   ├── API_INTEGRATION_GUIDE.md   # Integration documentation
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # Backend TypeScript config
├── src/                           # React 19 + TypeScript Frontend
│   ├── components/
│   │   ├── ai/                    # EduSync AI Study Buddy floating assistant
│   │   ├── dashboards/            # Student, Parent, Teacher & Admin views
│   │   ├── layout/                # Navbar, RoleSwitcherBar, Sidebar
│   │   └── modules/
│   │       ├── communication/     # Real-time chat & Announcements
│   │       ├── landing/           # Landing page & Auth Modal
│   │       ├── learning/          # Gamified quizzes & AI doubt resolver
│   │       ├── safety/            # Live Bus GPS & Digital Gate Pass
│   │       └── wellness/          # Mood logger & Guided Breathing
│   ├── context/                   # Global state (AppContext, ChatContext)
│   ├── mockData/                  # Mock data fallbacks for standalone preview
│   ├── services/                  # API Integration Client
│   ├── types/                     # TypeScript Interfaces
│   ├── App.tsx                    # Main App container
│   ├── index.css                  # Claymorphic CSS tokens & styling
│   └── main.tsx                   # Frontend entry point
├── public/                        # Static assets & icons
├── .github/workflows/deploy.yml   # GitHub Actions Pages deployment
├── index.html                     # HTML Template
├── package.json                   # Root frontend dependencies & scripts
├── README.md                      # Comprehensive project documentation
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.ts                 # Vite build configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Frontend Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/kaielashbec055/ERP-System.git
cd ERP-System

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

### 2. Backend Installation & Running

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Initialize Prisma Database
npx prisma db push

# 4. Start backend development server
npm run dev
```
Backend API will run on `http://localhost:5000`.

---

## 📡 API Endpoints Overview

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | `POST` | User login (Student, Parent, Teacher, Admin) |
| **Auth** | `/api/auth/me` | `GET` | Fetch authenticated user profile |
| **Students** | `/api/students/subjects` | `GET` | Get student subjects & grade performance |
| **Students** | `/api/students/assignments` | `GET` | Fetch pending assignments |
| **Parents** | `/api/parents/children` | `GET` | Fetch parent's registered children details |
| **Bus Safety**| `/api/bus/tracking` | `GET` | Get live bus GPS coordinates & telemetry |
| **Wellness** | `/api/wellness/mood` | `POST` | Submit daily student mood check-in |
| **AI Assist** | `/api/ai/query` | `POST` | Query EduSync AI Study Buddy |

---

## 🌐 Live Web Deployment

The frontend is configured for automatic **GitHub Actions CI/CD** deployment to **GitHub Pages**.

- **Live URL**: `https://kaielashbec055.github.io/ERP-System/`
- **Workflow Configuration**: `.github/workflows/deploy.yml`

---

## 📄 License

This project is licensed under the MIT License.
