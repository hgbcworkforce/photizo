import { jsPDF } from 'jspdf';

type RegistrationReceiptInput = {
  name?: string;
  email?: string;
  registrationId?: string;
  breakoutSession?: string;
  reference?: string;
};

type MerchandiseReceiptInput = {
  name?: string;
  email?: string;
  item?: string;
  quantity?: string;
  size?: string;
  color?: string;
  totalPrice?: string;
  reference?: string;
};

const drawHeader = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFillColor(245, 67, 12);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Photizo\'26', 14, 12);
  doc.setFontSize(10);
  doc.text('hgbcinfluencers.org', 14, 18);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(title, 14, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(subtitle, 14, 47);
};

const drawKeyValueRows = (doc: jsPDF, title: string, rows: Array<[string, string]>, startY: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(245, 67, 12);
  doc.text(title, 14, startY);

  let y = startY + 8;
  rows.forEach(([label, value]) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 3, 196, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label, 14, y);

    doc.setTextColor(15, 23, 42);
    doc.text(value, 90, y);
    y += 9;
  });

  return y + 2;
};

const drawFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(245, 67, 12);
  doc.rect(0, pageHeight - 26, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('photizo.hgbcinfluencers.org', 14, pageHeight - 14);
  doc.setFontSize(8);
  doc.text('Your information is used only for event communication and planning.', 14, pageHeight - 8);
};

export const downloadRegistrationReceiptPdf = (input: RegistrationReceiptInput) => {
  const doc = new jsPDF();

  drawHeader(
    doc,
    'Registration Confirmation',
    'Your registration and payment were successful.'
  );

  const rows: Array<[string, string]> = [
    ['Full Name', input.name || 'Valued Attendee'],
    ['Email', input.email || 'Not provided'],
    ['Registration ID', input.registrationId || 'Will be shared via email'],
    ['Breakout Session', input.breakoutSession || 'As selected during registration'],
    ['Payment Reference', input.reference || 'N/A'],
  ];

  let y = drawKeyValueRows(doc, 'YOUR REGISTRATION DETAILS', rows, 62);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 67, 12);
  doc.setFontSize(11);
  doc.text('WHAT\'S NEXT', 14, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text('1. Save the date and watch your inbox for event details.', 14, y + 16);
  doc.text('2. Arrive at least 15 minutes early on event day.', 14, y + 23);
  doc.text('3. Follow @hgbcglobal for updates.', 14, y + 30);

  drawFooter(doc);
  const refPart = input.reference ? `-${input.reference}` : '';
  doc.save(`photizo-registration-receipt${refPart}.pdf`);
};

export const downloadMerchandiseReceiptPdf = (input: MerchandiseReceiptInput) => {
  const doc = new jsPDF();

  drawHeader(
    doc,
    'Merchandise Order Confirmation',
    'Your merchandise payment was successful.'
  );

  const rows: Array<[string, string]> = [
    ['Full Name', input.name || 'Valued Customer'],
    ['Email', input.email || 'Not provided'],
    ['Item Ordered', input.item || 'Conference Merchandise'],
    ['Quantity', input.quantity || '1'],
    ['Size', input.size || 'N/A'],
    ['Color', input.color || 'N/A'],
    ['Total Price', input.totalPrice || 'As paid'],
    ['Payment Reference', input.reference || 'N/A'],
  ];

  drawKeyValueRows(doc, 'YOUR ORDER DETAILS', rows, 62);
  drawFooter(doc);

  const refPart = input.reference ? `-${input.reference}` : '';
  doc.save(`photizo-merchandise-receipt${refPart}.pdf`);
};
