# 🚀 Photizo 2026: EMERGE — Node.js API Backend

Secure, production-ready REST API backend for **Photizo 2026: EMERGE** built with **Express**, **TypeScript**, **Supabase** (PostgreSQL Database & Auth), **Paystack** (Payment Gateway & Webhook verification), and **Resend** (Transactional Email Notifications).

---

## 🛠 Features & Capabilities

- 🛡️ **Paystack Payment & Verification Engine**:
  - Initializes payment checkout with attendee & merchandise metadata.
  - Verifies incoming payments with HMAC-SHA512 cryptographic Webhook signature checking.
  - Server-side verification fallback for frontend redirection callbacks.
  - Idempotent processing (prevents double charges or duplicate confirmation emails).
- 📧 **Resend Email Automation**:
  - Sends high-conversion, responsive HTML confirmation passes with unique conference ID badges (`PHOTIZO-2026-XXXX`).
  - Supports manual resend triggers from the admin dashboard.
- 🛍️ **Merchandise Order Processing**:
  - Handles item ordering, customization (color/size), automated tax/charge computations, and fulfillment tracking.
- 🔐 **Supabase PostgreSQL & Admin Auth**:
  - Full CRUD operations on Attendees, Merchandise Orders, and Payment transactions.
  - Middleware-protected admin routes using Supabase JWT and RBAC checks (`admin_users` table).
  - Summary metrics and real-time dashboard analytics.
- 📦 **Render & Production Ready**:
  - Zero-downtime deployment with health check endpoint (`/api/health`).
  - Rate-limiting, CORS, Helmet security headers, and Morgan HTTP logging.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials from Supabase, Paystack, and Resend.

### 3. Run Database Schema Migration
Run the SQL queries in `database.sql` inside your **Supabase Project > SQL Editor**.

### 4. Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

---

## 📡 API Endpoints Reference

### 🎟 Public Registration, Merchandise & Payments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/registration/initiate` | Initiates attendee registration and returns Paystack checkout URL. |
| `GET` | `/api/registration/status/:reference` | Checks registration status by payment reference. |
| `POST` | `/api/merchandise/order` | Creates a merchandise order and returns Paystack checkout details. |
| `GET` | `/api/merchandise/order/:reference` | Checks merchandise order status by payment reference. |
| `GET` | `/api/payments/verify/:reference` | Verifies Paystack transaction, confirms seat, and triggers confirmation email. |
| `POST` | `/api/webhooks/paystack` | Secure HMAC-verified webhook endpoint for Paystack `charge.success` events. |
| `GET` | `/api/health` | Service health status. |

### 🔒 Admin Protected Endpoints (Requires `Authorization: Bearer <Supabase_JWT>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/metrics` | Summary stats (total revenue, paid passes, merchandise sales, breakout session breakdowns). |
| `GET` | `/api/admin/attendees` | Paginated attendee list with search (`?search=`), filtering (`?status=`, `?breakoutSession=`). |
| `GET` | `/api/admin/attendees/:id` | Single attendee record. |
| `PUT` | `/api/admin/attendees/:id` | Update attendee information. |
| `DELETE` | `/api/admin/attendees/:id` | Delete attendee record. |
| `POST` | `/api/admin/attendees/:id/resend-email` | Re-trigger Resend confirmation email to the attendee. |
| `GET` | `/api/admin/attendees/export/csv` | Download full attendees list as CSV. |
| `GET` | `/api/admin/merchandise` | Audit trail of all merchandise orders and fulfillment statuses. |
| `GET` | `/api/admin/payments` | Audit trail of all Paystack payment transactions. |

---

## 🌐 Deploying to Render

1. Push your changes to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Web Service**.
4. Select your `photizo` repository.
5. Set Web Service options:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
6. Add your Environment Variables in Render:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `FRONTEND_URL`
7. Click **Create Web Service**.

### 🔗 Configure Paystack Webhook
In your **Paystack Dashboard** > **Settings** > **API Keys & Webhooks**:
- Set **Live/Test Webhook URL** to: `https://<your-render-app>.onrender.com/api/webhooks/paystack`
