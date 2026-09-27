# ⚡ Photizo Conference Backend API

Node.js + Express + TypeScript API backend for **Photizo Conference** by Higher Ground Baptist Church, featuring Supabase PostgreSQL database integration, Paystack gateway payment processing, and Resend transactional email delivery.

---

## 🏗️ Architecture & Stack

- **Runtime**: Node.js & TypeScript (`tsx` for dev, `tsc` for production build)
- **Framework**: Express 4 with security middleware (`helmet`, `cors`, `morgan`, `express-rate-limit`)
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS) & Sequential Pass Number Generator
- **Payments**: Paystack Gateway API (Card, Bank Transfer, USSD, OPay, Webhooks HMAC-SHA512 verification)
- **Emails**: Resend API with responsive HTML templates for Registrations & Merchandise Orders

---

## 📁 Directory Structure

```
photizo/server/
├── database.sql                  # Supabase schema, RLS policies, sequences & admin seed
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── src/
    ├── app.ts                    # Express app configuration & middleware
    ├── server.ts                 # Server entry point & graceful shutdown
    ├── config/
    │   ├── env.ts                # Zod runtime environment variable validation
    │   ├── supabase.ts           # Supabase Admin Service Role client
    │   └── resend.ts             # Resend email client instance
    ├── types/
    │   └── index.ts              # Global TypeScript interfaces
    ├── services/
    │   ├── attendee.service.ts   # Registration & attendee operations + sequential ID
    │   ├── merchandise.service.ts# Merchandise order operations
    │   ├── payment.service.ts    # Payment audit trail log
    │   ├── paystack.service.ts   # Paystack checkout init & verification
    │   └── email.service.ts      # Resend email dispatcher
    ├── controllers/
    │   ├── registration.controller.ts
    │   ├── merchandise.controller.ts
    │   ├── payment.controller.ts
    │   ├── webhook.controller.ts
    │   ├── admin.controller.ts
    │   └── auth.controller.ts
    ├── routes/
    │   ├── registration.routes.ts
    │   ├── merchandise.routes.ts
    │   ├── payment.routes.ts
    │   ├── webhook.routes.ts
    │   ├── admin.routes.ts
    │   ├── auth.routes.ts
    │   └── index.ts
    ├── middlewares/
    │   ├── auth.middleware.ts    # Supabase JWT & admin privilege verification
    │   ├── validate.middleware.ts# Zod payload validator
    │   └── error.middleware.ts   # Global error handling middleware
    └── templates/
        ├── registrationEmail.ts  # HTML email template for attendees
        └── merchandiseEmail.ts   # HTML email template for merchandise orders
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd d:\OVERSIGHT\Hgbc\photizo\server
npm install
```

### 2. Database Setup
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Copy the content of [`database.sql`](./database.sql) and execute it.
3. This creates:
   - `registrations` table with sequential registration number generator (`0001`, `0002`, ...).
   - `merchandise_orders` table.
   - `payments` table.
   - `admin_users` table and initial superadmin profile.

### 3. Environment Variables
Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=Photizo Conference <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5173
CONFERENCE_NAME=Photizo Conference 2026
CONFERENCE_DATES=May 21 - 23, 2026
CONFERENCE_VENUE=Higher Ground Baptist Church, Ogbomoso, Nigeria.
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints

### 🎫 Registration
- `POST /api/registration/initiate` - Initiates registration and creates Paystack checkout session.
- `GET /api/registration/status/:reference` - Gets registration status by reference.

### 🛍️ Merchandise
- `POST /api/merchandise/initiate` - Initiates merchandise pre-order checkout.
- `GET /api/merchandise/status/:reference` - Gets merchandise order status.

### 💳 Payments & Webhooks
- `POST /api/payments/initialize` - Initializes transaction.
- `GET /api/payments/verify/:reference` - Verifies payment with Paystack, updates DB, sends confirmation email.
- `POST /api/webhooks/paystack` - Paystack HMAC-SHA512 webhook handler.

### 🔐 Authentication & Admin
- `POST /api/auth/login` - Admin login.
- `POST /api/auth/logout` - Admin logout.
- `GET /api/admin/metrics` - Dashboard metrics & stats.
- `GET /api/admin/attendees` - Paginated attendee list with search and filters.
- `GET /api/admin/attendees/export/csv` - Export attendees to CSV.
- `PUT /api/admin/attendees/:id` - Update attendee.
- `DELETE /api/admin/attendees/:id` - Delete attendee.
- `POST /api/admin/attendees/:id/resend-email` - Re-send pass confirmation email.
- `GET /api/admin/merchandise/orders` - Merchandise orders list.
- `GET /api/admin/merchandise/orders/export/csv` - Export merchandise orders to CSV.
- `PUT /api/admin/merchandise/orders/:id` - Update merchandise order.
- `DELETE /api/admin/merchandise/orders/:id` - Delete merchandise order.
- `POST /api/admin/merchandise/orders/:id/resend-email` - Re-send merchandise order email.
- `GET /api/admin/payments` - Payment audit logs.
