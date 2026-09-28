import { env } from '../config/env';

interface MerchandiseEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pickupOption?: string;
}

export function generateMerchandiseEmailTemplate(data: MerchandiseEmailProps): string {
  const formattedTotal = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(data.totalAmount);

  const formattedUnitPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(data.unitPrice);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BISUM Conference Merchandise Order Confirmed</title>
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
      background: rgba(37, 99, 235, 0.2);
      border: 1px solid #3b82f6;
      color: #93c5fd;
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
    .order-card {
      background: #f8fafc;
      border: 2px dashed #93c5fd;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
      text-align: center;
    }
    .order-title {
      font-size: 12px;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .order-number {
      font-family: 'Courier New', Courier, monospace;
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 2px;
      background: #e2e8f0;
      padding: 8px 16px;
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 12px;
    }
    .order-hint {
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
    .pickup-box {
      background: #eff6ff;
      border: 1px solid #dbeafe;
      border-radius: 10px;
      padding: 18px;
      margin-bottom: 28px;
    }
    .pickup-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 6px;
    }
    .pickup-text {
      font-size: 13px;
      color: #1e3a8a;
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
      background-color: #2563eb;
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
      <div class="badge-label">Official Merchandise Order Receipt</div>
      <h1 class="title">${env.CONFERENCE_NAME}</h1>
      <p class="subtitle">Official Store Pre-Order</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Hello, ${data.customerName}! 🛍️</div>
      <p class="paragraph">
        Thank you for purchasing official <strong>${env.CONFERENCE_NAME}</strong> merchandise! Your payment has been received and your order is confirmed.
      </p>

      <!-- Order ID Card -->
      <div class="order-card">
        <div class="order-title">Your Order Pickup Code</div>
        <div class="order-number">${data.orderNumber}</div>
        <div class="order-hint">Please present this Order ID or email at the Official Merchandise Stand during the conference.</div>
      </div>

      <!-- Order Summary -->
      <table class="details-table">
        <tr>
          <td class="label">Item Ordered</td>
          <td class="value">${data.itemName}</td>
        </tr>
        <tr>
          <td class="label">Color</td>
          <td class="value">${data.color}</td>
        </tr>
        <tr>
          <td class="label">Size</td>
          <td class="value">${data.size}</td>
        </tr>
        <tr>
          <td class="label">Quantity</td>
          <td class="value">${data.quantity}</td>
        </tr>
        <tr>
          <td class="label">Unit Price</td>
          <td class="value">${formattedUnitPrice}</td>
        </tr>
        <tr>
          <td class="label">Total Paid</td>
          <td class="value" style="color: #2563eb; font-size: 15px;">${formattedTotal}</td>
        </tr>
        <tr>
          <td class="label">Payment Status</td>
          <td class="value" style="color: #16a34a;">Paid & Confirmed</td>
        </tr>
      </table>

      <!-- Pickup Instructions -->
      <div class="pickup-box">
        <div class="pickup-title">📦 Collection / Pickup Details</div>
        <p class="pickup-text">
          <strong>Location:</strong> Merchandise Desk, ${env.CONFERENCE_VENUE}<br>
          <strong>Collection Dates:</strong> ${env.CONFERENCE_DATES}<br>
          <strong>Recipient Name:</strong> ${data.customerName} (${data.customerPhone})
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${env.FRONTEND_URL}/merchandise" class="cta-button">View More Merchandise</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        Need assistance with your order? Reach out to our store team at merchandise@bisum.org.
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
