# Photizo 2026: EMERGE Web Platform

The official web platform and conference management system for **Photizo 2026: EMERGE** (Leadership & Transformation Conference), hosted by Higher Ground Baptist Church (HGBC), Ogbomoso, Nigeria.

---

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Swiper, jsPDF
- **Backend API:** Node.js, Express, TypeScript
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Payment Gateway:** Paystack (Inline checkout, transaction verification, and secure HMAC webhooks)
- **Email Delivery:** Resend API (Transactional registration & merchandise order notifications)

---

## Core Features

- **Public Conference Portal:**
  - Dynamic event landing page with countdown timer and interactive sections.
  - Featured speakers directory and 3-day conference schedule.
  - Conference merchandise store with item variations (color, size, quantity).
- **Participant Registration:**
  - Multiple attendance modes: **Physical (On-Site)** and **Virtual (Online)**.
  - Breakout session track selection (*Art, Business, Education, Family, Media, Politics, Religion*).
  - Client-side ticket badge generation with jsPDF.
- **Payment & Transaction Engine:**
  - Seamless Paystack payment checkout for registrations and merchandise.
  - Secure HMAC-SHA512 webhook handling and server-side verification callbacks.
  - Automated confirmation email dispatch with admission details and order receipts.
- **Admin Management Dashboard:**
  - Real-time KPI monitor: Total Registrations, Registration Revenue (₦), Merchandise Orders, and Merchandise Revenue (₦).
  - Visual distribution analytics powered by Recharts (Attendance Mode, Breakout Sessions, Merchandise variants).
  - Full CRUD operations on participant registrations and merchandise orders.
  - Search, multi-criteria filtering, and CSV report exports.
  - One-click confirmation email resend tools.

---

## Project Structure

```text
photizo/
├── public/                  # Static assets (logos, banners, speaker images)
├── src/                     # React 19 / Vite client application
│   ├── assets/              # Static styling assets
│   ├── components/          # Reusable UI components & dashboard tabs
│   │   ├── dashboard/       # Admin dashboard tabs (Registrations, Merchandise)
│   │   ├── AboutSection.tsx
│   │   ├── AdminGuard.tsx   # Protected route authorization wrapper
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScheduleItem.tsx
│   │   └── SpeakerModal.tsx
│   ├── data/                # Static datasets (speakers, schedule, merchandise)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Supabase client initialization
│   ├── pages/               # Application routes & views
│   │   ├── admin/           # Admin authentication pages (SignIn, Register, AuthStatus)
│   │   ├── Admin.tsx        # Main admin dashboard
│   │   ├── Home.tsx         # Conference landing page
│   │   ├── Merchandise.tsx  # Swag shop catalog
│   │   ├── MerchandiseDetails.tsx # Product purchase & checkout
│   │   ├── Registration.tsx # Participant registration flow
│   │   ├── Schedule.tsx     # 3-day event schedule
│   │   └── Speakers.tsx     # Speaker directory
│   ├── services/            # API client service layer (Axios)
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Auth utilities and helpers
│   ├── App.tsx              # React router configuration
│   └── REUSEABLES.ts        # Centralized UI text & constants
├── server/                  # Node.js / Express backend service
│   ├── src/
│   │   ├── config/          # Environment & Supabase client config
│   │   ├── controllers/     # Route controllers (Admin, Registration, Merchandise, Payments)
│   │   ├── middlewares/     # Supabase auth and webhook validation middlewares
│   │   ├── routes/          # Express API route declarations
│   │   ├── services/        # Business logic, Supabase Admin & Resend email templates
│   │   ├── templates/       # HTML email templates
│   │   └── server.ts        # Express application entrypoint
│   └── database.sql         # PostgreSQL schema, sequences, and RLS policies
└── package.json
```

---

## Environment Variables

### Frontend (`.env.local`)
```env
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PUBLIC_API_URL=http://localhost:5000/api
VITE_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Photizo Conference <onboarding@resend.dev>
```

---

## Getting Started

### 1. Clone Repository & Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Database Migration

Run the SQL script located at `server/database.sql` in your **Supabase Project > SQL Editor** to create all tables, indexes, registration sequence, and RLS policies.

### 3. Start Development Servers

```bash
# Terminal 1: Run Backend API (from server directory)
cd server
npm run dev

# Terminal 2: Run Frontend app (from root directory)
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Admin Dashboard:** [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

---

## Deployment

- **Frontend:** Deploy to [cPanel](https://cpanel.net) (automated via `.github/workflows/cpanel_deploy.yml`) or [Vercel](https://vercel.com).
- **Backend:** Deploy to [Render](https://render.com) or [Railway](https://railway.app) (set root directory to `server`, build command `npm install && npm run build`, start command `npm start`).
- **Paystack Webhook Configuration:** Set your Paystack Webhook URL to `https://<your-backend-domain>/api/webhooks/paystack`.

---

## License

All rights reserved © 2026 Photizo Conference. Powered by Higher Ground Baptist Church (HGBC).
