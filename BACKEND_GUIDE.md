# 🛠 Technical Handover: Photizo Registration & Merchandise

This document outlines the architectural requirements and API contract for the Node.js backend to support the Photizo frontend.

## 1. General Architecture
* **Pattern**: Persist First, Verify Later.
* **Logic**: All user data must be stored in the database with a `pending` status **before** initializing the Paystack transaction.
* **Payment Flow**: 
    1. Frontend sends data to Node.js.
    2. Node.js saves record as `pending`.
    3. Node.js calls Paystack Initialize API and returns `access_code`.
    4. Frontend opens Paystack Popup.
    5. Paystack Webhook updates status to `completed` upon success.

---

## 2. API Endpoints

### A. Conference Registration
**`POST /api/registrations`**
- **Payload**: 
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string",
    "attendanceMode": "string",
    "referralSource": "string",
    "breakoutSessionChoice": "string",
    "expectations": "string (optional)"
  }

- **Action**: Save to `Attendees` table.
- **Response**: `{ "success": true, "attendee": { "id": "uuid" } }`

**`POST /api/payments/initialize`**
- **Payload**: `{ "attendeeId": "uuid" }`
- **Amount**: **₦2,050** (Base ₦2,000 + 2.5% fee). Send to Paystack as `205000` kobo
- **Response**: `{ "accessCode": "string", "reference": "string", "amount": 2050 }`


### B. Merchandise Orders
**`POST /api/orders/merchandise`**
- **Payload**:
  ```json
  {
    "merchandiseId": "string",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "color": "string",
    "size": "string",
    "quantity": number,
    "totalAmount": number
  }

- **Action**: Save to `Orders` table with `pending` status. Initialize Paystack transaction.

- **Response**: `{ "success": true, "orderId": "uuid", "accessCode": "string" }`


## 3. Webhook Integration
**`POST /api/paystack-webhook`**

- **Source**: Paystack Servers.

- **Event**: `charge.success`.

- **Logic**:

  - Verify Paystack signature.

  - Match `reference` to either `Attendee` or `Order` record.

  - Update `paymentStatus` to `completed`.

  - Trigger automated confirmation email.


## 4. Automated confirmation email (Backend Only)
### A. Registration ID Generation
The backend must generate a sequential Registration ID for every successful attendee.
* **Format**: 4-digit padded string (e.g., `0001`, `0050`, `0100`).
* **Logic**: On successful payment verification, calculate `count + 1` from the database and pad with leading zeros.
* **Storage**: This ID must be stored in the `registration_id` field of the `Attendees` table.

### B. Automated Confirmation Email
Automated emails are **mandatory** upon successful payment.
* **Trigger**: The Paystack Webhook (`charge.success`).
* **Template**: Use the provided HTML template (Photizo'26 Registration Confirmation).
* **Dynamic Fields**: Replace `{{name}}` with the user's first name and `{{reg_id}}` with the generated 4-digit ID.
* **Tools**: Use Nodemailer with a reliable SMTP provider.

### C. Updated API Endpoints

### POST /api/paystack-webhook
1.  Verify the webhook signature.
2.  If `event === "charge.success"`:
    * Find the pending record using the reference.
    * **Generate the Reg ID** (e.g., `0052`).
    * Update status to `completed`.
    * **Send the Confirmation Email** immediately using the HTML template.


## 5. Environment Variables (Required)
  ```env
  # Database
  DATABASE_URL=your_connection_string

  # Paystack
  PAYSTACK_SECRET_KEY=sk_live_xxxx or sk_test_xxxx
  PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_from_dashboard

  # Email Config
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=465
  EMAIL_USER=your-conference-email@gmail.com
  EMAIL_PASS=your-app-password
  