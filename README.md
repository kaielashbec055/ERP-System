# 🎓 EduPulse.AI — Smart School ERP & Student Ecosystem

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/kaielashbec055/ERP-System)

**EduPulse.AI** is a next-generation, AI-powered School Enterprise Resource Planning (ERP) and student management ecosystem. It seamlessly unifies academic tracking, live bus GPS safety, instant digital gate passes, AI-driven student mental wellness monitoring, and multi-role dashboards into a single, cohesive institution network.

---

## 🌟 Key Features & Core Modules

### 👥 1. Multi-Role Dashboard Systems
- **Student Portal**: Academic progress tracking, assignment submissions, daily mood check-ins, achievement badges, and upcoming schedules.
- **Parent Portal**: Real-time attendance monitoring, live bus GPS location, digital gate pass approvals, fee payment status, and teacher communication.
- **Educator (Teacher) Dashboard**: At-risk student identification alerts, subject grade analytics, class performance distribution, and assignment management.
- **Admin Command Center**: Institution-wide metrics, emergency SOS alert monitoring, transport system status, and system configuration.

### 🚌 2. Real-Time Transport & Bus Safety
- Live GPS tracking of school buses along predefined routes.
- Real-time speed limit monitoring and route progress updates.
- Estimated Time of Arrival (ETA) calculation per stop.
- Passenger count and capacity monitoring.

### 🛡️ 3. Digital Gate Pass & Safety
- QR-code-based digital gate pass generation for student check-outs.
- Parent request and instant approval workflow.
- Security guard validation interface for campus entrance/exit logs.
- One-click Emergency SOS alert system with real-time incident broadcast.

### 🧠 4. Student Wellness & Mental Health
- Daily mood check-in logger with emotional trend analytics.
- Interactive guided breathing exercises for stress reduction.
- AI-based early detection of academic burnout or emotional distress.
- Automated counselor alert system for struggling students.

### 🤖 5. EduPulse AI Assistant
- Floating interactive AI assistant available across all dashboards.
- Context-aware answers for homework help, schedules, fee details, and school policies.

### 📢 6. Communication & Announcements Hub
- Direct messaging between parents, teachers, and administrators.
- Priority school-wide notice board with categorized updates (Academic, Sports, Emergency).

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism |
| **Animations** | [Framer Motion v12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts & Analytics** | [Recharts](https://recharts.org/) |
| **Linter** | [Oxlint](https://oxc.rs/) |
| **CI/CD Deployment** | GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages |

---

## 📁 Repository Architecture

```
ERP-System/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD GitHub Pages deployment workflow
├── public/                       # Static public assets & icons
├── src/
│   ├── assets/                   # Images and vectors
│   ├── components/
│   │   ├── ai/                   # Floating AI Assistant component
│   │   ├── dashboards/           # Student, Parent, Teacher & Admin dashboards
│   │   ├── layout/               # Navbar, Sidebar, Role Switcher
│   │   ├── modules/
│   │   │   ├── communication/    # Announcements & Chat module
│   │   │   ├── landing/          # Landing page & Auth modal
│   │   │   ├── safety/           # Bus Tracker, Gate Pass & SOS Modal
│   │   │   └── wellness/         # Guided Breathing & Wellness Dashboard
│   ├── context/                  # App state & Chat context providers
│   ├── mockData/                 # Mock datasets for demonstration
│   ├── types/                    # TypeScript interfaces & types
│   ├── App.tsx                   # Main App container & router
│   ├── main.tsx                  # Application entrypoint
│   └── index.css                 # Global CSS & Tailwind utilities
├── index.html                    # HTML template
├── package.json                  # Scripts & dependencies
├── tailwind.config.js            # Tailwind styling setup
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build configuration (base: '/ERP-System/')
```

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Node.js** (v18.0 or higher) and **npm** installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kaielashbec055/ERP-System.git
   cd ERP-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Available Scripts

- `npm run dev`: Launch local development server with HMR.
- `npm run build`: Compile TypeScript and build production bundle into `/dist`.
- `npm run preview`: Locally preview the production build output.
- `npm run lint`: Run Oxlint code check.

---

## 🌐 Live Deployment

This project is configured with automatic **GitHub Actions CI/CD** deployment to **GitHub Pages**.

- **Workflow Path**: `.github/workflows/deploy.yml`
- **Trigger**: Every push to the `main` branch automatically builds and publishes the production site.
- **Live URL**: `https://kaielashbec055.github.io/ERP-System/`

To enable GitHub Pages manually:
1. Navigate to **Settings** -> **Pages** in the repository.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kaielashbec055/ERP-System/issues).

---

## 📄 License

This project is licensed under the MIT License.
