import { env } from '../config/env';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  registrationNumber: string;
  registrationType: string;
  attendanceMode?: string;
  breakoutSessionChoice?: string;
  amountPaid?: number;
  email: string;
  phone?: string;
}

export function generateRegistrationEmailTemplate(data: EmailTemplateProps): string {
  const displayRegNumber = data.registrationNumber || '0001';
  const passTypeLabel = data.registrationType.toLowerCase() === 'student' ? 'Student Pass' : 'Professional Pass';
  const attendanceModeLabel = data.attendanceMode || 'On-site';
  const formattedAmount = data.amountPaid
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(data.amountPaid)
    : data.registrationType.toLowerCase() === 'student'
    ? '₦1,000'
    : '₦2,000';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BISUM Conference 2025 Registration Confirmed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f172a;
      color: #334155;
      margin: 0;
      padding: 20px;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .badge-label {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(234, 88, 12, 0.15);
      border: 1px solid #ea580c;
      color: #fb923c;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 26px;
      font-weight: 800;
      margin: 0 0 10px 0;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }
    .content {
      padding: 32px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 24px;
    }
    .ticket-card {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
      text-align: center;
    }
    .ticket-title {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .ticket-number {
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 3px;
      background: #e2e8f0;
      padding: 10px 24px;
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 12px;
    }
    .ticket-hint {
      font-size: 12px;
      color: #64748b;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .details-table td {
      padding: 12px 14px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
    }
    .details-table td.label {
      color: #64748b;
      font-weight: 600;
      width: 40%;
    }
    .details-table td.value {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }
    .event-info-box {
      background: #fff7ed;
      border: 1px solid #ffedd5;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 28px;
    }
    .event-info-title {
      font-size: 13px;
      font-weight: 700;
      color: #9a3412;
      margin-bottom: 6px;
    }
    .event-info-text {
      font-size: 13px;
      color: #c2410c;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="badge-label">Official Pass Confirmation</div>
      <h1 class="title">${env.CONFERENCE_NAME}</h1>
      <p class="subtitle">${env.CONFERENCE_DATES} • ${env.CONFERENCE_VENUE}</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hello, ${data.firstName}! 🎉</div>
      <p class="paragraph">
        We are thrilled to inform you that your registration for <strong>${env.CONFERENCE_NAME}</strong> has been successfully confirmed. Your seat has been secured!
      </p>

      <!-- Ticket Card -->
      <div class="ticket-card">
        <div class="ticket-title">Your Registration ID / Pass Number</div>
        <div class="ticket-number">${displayRegNumber}</div>
        <div class="ticket-hint">Please save this Registration ID and present this email at the accreditation desk upon arrival.</div>
      </div>

      <!-- Registration Summary -->
      <table class="details-table">
        <tr>
          <td class="label">Registration ID</td>
          <td class="value" style="font-family: monospace; font-size: 15px; letter-spacing: 1px;">${displayRegNumber}</td>
        </tr>
        <tr>
          <td class="label">Attendee Name</td>
          <td class="value">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td class="label">Pass Category</td>
          <td class="value">${passTypeLabel}</td>
        </tr>
        <tr>
          <td class="label">Attendance Mode</td>
          <td class="value">${attendanceModeLabel}</td>
        </tr>
        ${
          data.breakoutSessionChoice
            ? `
        <tr>
          <td class="label">Breakout Session</td>
          <td class="value">${data.breakoutSessionChoice}</td>
        </tr>`
            : ''
        }
        <tr>
          <td class="label">Amount Paid</td>
          <td class="value">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Payment Status</td>
          <td class="value" style="color: #16a34a;">Verified & Confirmed</td>
        </tr>
      </table>

      <!-- Event Logistics -->
      <div class="event-info-box">
        <div class="event-info-title">📍 Venue & Date Reminders</div>
        <p class="event-info-text">
          <strong>Dates:</strong> ${env.CONFERENCE_DATES}<br>
          <strong>Venue:</strong> ${env.CONFERENCE_VENUE}
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${env.FRONTEND_URL}/schedule" class="cta-button">View Conference Schedule</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        Need assistance or have questions? Reply directly to this email or reach out to our team at support@bisum.org.
      </p>
      <p class="footer-text">
        © ${new Date().getFullYear()} ${env.CONFERENCE_NAME}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
