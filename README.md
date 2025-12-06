# 🧠 AI Learning Platform

<div align="center">


**Platform E-Learning Interaktif untuk Menguasai AI Engineering & Python**

[Demo Live](#) · [Laporkan Bug](#) · [Request Feature](#)

</div>

## 📖 Tentang Project

**AI Learning Platform** adalah aplikasi web edukasi modern yang dirancang untuk membuat belajar pemrograman dan AI menjadi lebih menarik dan adiktif. Dibangun dengan teknologi web terbaru, platform ini menggabungkan kurikulum terstruktur dengan elemen **gamifikasi** (XP, Level, Leaderboard) dan **bantuan AI pintar**.

Project ini mendemonstrasikan kemampuan Full Stack Development yang kompleks, mulai dari manajemen state real-time, integrasi AI, hingga keamanan database tingkat lanjut.

### ✨ Fitur Utama

- **🎮 Gamification System**: Sistem XP, Leveling, Streak Harian, dan Achievements untuk memotivasi pengguna.
- **🏆 Global Leaderboard**: Kompetisi real-time antar pengguna berdasarkan perolehan XP mingguan.
- **💻 Interactive Code Playground**: Editor kode terintegrasi (Monaco Editor) yang mendukung Python/JS dengan output instan.
- **🤖 AI Personal Tutor**: Chatbot pintar (Gemini AI) yang siap membantu menjawab pertanyaan materi 24/7.
- **📝 Smart Quiz System**: Sistem kuis otomatis dengan penilaian berbasis persentase dan threshold kelulusan.
- **🌙 Dark Mode Support**: Tampilan antarmuka yang adaptif dan nyaman di mata (Fully Optimized).
- **🔒 Secure Authentication**: Registrasi, Login, dan manajemen sesi aman menggunakan Supabase Auth.
- **👥 Study Groups**: Ruang diskusi real-time untuk kolaborasi antar siswa.

---

## 🛠️ Tech Stack

Project ini dibangun menggunakan tools industri standar *Enterprise-level*:

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Framer Motion (Animations)
- **State Management**: React Hooks + URL State
- **Components**: Lucide React, Monaco Editor, React Markdown

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/) (PostgreSQL Database)
- **Auth**: Supabase Auth (JWT & RLS Security)
- **AI Integration**: Google Gemini Pro API
- **Deployment**: Vercel

---

## 🚀 Cara Menjalankan Project

Ikuti langkah ini untuk menjalankan project di lokal komputer Anda.

### Prasyarat
- Node.js (v18 ke atas)
- NPM atau Yarn
- Akun Supabase (Gratis)

### Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/Pusri27/ai-learning-platform.git
   cd ai-learning-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Buat file `.env.local` di root folder dan isi konfigurasi berikut:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Setup Database**
   Jalankan script SQL yang ada di folder `/database/schema.sql` pada SQL Editor Supabase Anda untuk membuat tabel dan relasi.

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

6. **Buka Browser**
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 📸 Screenshots

*(Tempatkan screenshot terbaik aplikasi Anda di sini. Disarankan: Dashboard Utama, Halaman Kuis, dan Code Playground)*

| Dashboard (Dark Mode) | Code Playground |
|:---------------------:|:---------------:|
| ![Dashboard](https://via.placeholder.com/400x300?text=Dashboard) | ![Playground](https://via.placeholder.com/400x300?text=Editor) |

---

## 👤 Author

**Nama Anda**
- Website: [portfolio-anda.com](#)
- LinkedIn: [linkedin.com/in/username-anda](#)
- GitHub: [@Pusri27](https://github.com/Pusri27)

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
