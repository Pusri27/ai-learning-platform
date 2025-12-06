# 🧠 AI Learning Platform

> **A Next-Gen Gamified E-Learning Platform for Mastering AI Engineering**

[Live Demo](https://ai-learning-platform-gamma.vercel.app/)

---

## 📖 About The Project

**AI Learning Platform** is a cutting-edge educational web application designed to make learning AI and Python programming addictive and effective. By combining a structured curriculum with **advanced gamification** mechanics (XP, Levels, Leaderboards) and an **integrated AI Tutor**, this platform solves the problem of student disengagement in online learning.

This project demonstrates complex **Full Stack Engineering** capabilities, showcasing real-time data handling, AI model integration, and secure role-based access control.

### ✨ Key Features

- **🎮 Deep Gamification System**: Engaging XP system, daily streaks, level progression, and unlockable achievements to maximize user retention.
- **🏆 Global Leaderboard**: Real-time competitive ranking system to foster healthy competition among learners.
- **💻 Interactive Code Playground**: Fully integrated Monaco Editor supporting Python/JS execution with instant feedback.
- **🤖 AI Personal Tutor**: 24/7 intelligent assistant powered by **Gemini AI** to explain complex concepts and debug code.
- **📝 Intelligent Quiz System**: Automated scoring with percentage-based grading and pass/fail thresholds.
- **🌙 Adaptive UI/UX**: Professional Dark Mode support ensuring a comfortable viewing experience in any environment.
- **🔒 Enterprise-Grade Security**: Robus authentication and Row Level Security (RLS) implementation using Supabase.
- **👥 Collaborative Learning**: Study groups and discussion forums for peer-to-peer knowledge exchange.

---

## 🛠️ Tech Stack

Built with a modern, scalable, and performance-focused technology stack:

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Framer Motion
- **Editor**: Monaco Editor (VS Code core)

### Backend & Infrastructure
- **BaaS**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Auth**: Supabase Auth (JWT)
- **AI**: Google Gemini Pro API
- **Deployment**: Vercel

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites
- Node.js (v18+)
- NPM or Yarn
- Supabase Account

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pusri27/ai-learning-platform.git
   cd ai-learning-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Database Setup**
   Run the SQL scripts located in `database/schema.sql` in your Supabase SQL Editor to initialize the tables and policies.

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 👤 Author

**Pusri Ananda Handal**
- GitHub: [@Pusri27](https://github.com/Pusri27)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
