import nodemailer from 'nodemailer';
import { OrderFormData } from '@/types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load settings from file or environment
function getSettings() {
  try {
    const settingsPath = join(process.cwd(), 'data', 'settings.json');
    
    if (existsSync(settingsPath)) {
      const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
      return settings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  // Fallback to environment variables
  return {
    orderEmail: process.env.ORDER_EMAIL || 'jeltevveen@gmail.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.strato.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '465'),
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  };
}

// Create email transporter
function createTransporter() {
  const settings = getSettings();
  
  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: true,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });
}

// Format order data for email
function formatOrderEmail(orderData: OrderFormData): string {
  const { name, address, city, contactMethod, contactValue, products, dropoffLocation, comments } = orderData;
  
  let emailBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #007AFF; border-bottom: 2px solid #007AFF; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 25px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; display: inline-block; width: 150px; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #007AFF; color: white; }
    .total { font-weight: bold; background-color: #f5f5f5; }
  </style>
</head>
<body>
  <h1>🎯 Nieuwe Bestelling - 3D Prints Baarn</h1>
  
  <h2>Klantgegevens</h2>
  <div class="info-row"><span class="label">Naam:</span> ${name}</div>
  <div class="info-row"><span class="label">Adres:</span> ${address}</div>
  <div class="info-row"><span class="label">Woonplaats:</span> ${city}</div>
  <div class="info-row"><span class="label">Contact via:</span> ${contactMethod === 'email' ? 'E-mail' : 'Telefoon'}</div>
  <div class="info-row"><span class="label">${contactMethod === 'email' ? 'E-mailadres' : 'Telefoonnummer'}:</span> ${contactValue}</div>
  
  <h2>Bestelde Producten</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Aantal</th>
        <th>Prijs Type</th>
      </tr>
    </thead>
    <tbody>
      ${products.map(p => `
        <tr>
          <td>${p.productName}</td>
          <td>${p.quantity}</td>
          <td>${p.priceType === 'child' ? 'Kinderprijs' : 'Volwassen prijs'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>Bezorggegevens</h2>
  <div class="info-row"><span class="label">Aflevering:</span> ${dropoffLocation}</div>
  
  ${comments ? `
  <h2>Opmerkingen</h2>
  <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007AFF;">
    ${comments.replace(/\n/g, '<br>')}
  </p>
  ` : ''}
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
  <p style="color: #666; font-size: 0.9em;">
    Deze e-mail is automatisch gegenereerd door het bestelsysteem van 3D Prints Baarn.
  </p>
</body>
</html>
`;

  return emailBody;
}

// Send order email
export async function sendOrderEmail(orderData: OrderFormData): Promise<boolean> {
  try {
    const settings = getSettings();
    const transporter = createTransporter();
    
    const mailOptions = {
      from: settings.smtpUser,
      to: settings.orderEmail,
      subject: `🎯 Nieuwe Bestelling van ${orderData.name}`,
      html: formatOrderEmail(orderData),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send contact form email
export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  try {
    const settings = getSettings();
    const transporter = createTransporter();
    
    const mailOptions = {
      from: settings.smtpUser,
      to: settings.orderEmail,
      subject: `💬 Nieuw Contactbericht van ${data.name}`,
      html: `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #007AFF; }
    .info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007AFF; }
  </style>
</head>
<body>
  <h1>💬 Nieuw Contactbericht</h1>
  <p><strong>Van:</strong> ${data.name}</p>
  <p><strong>E-mail:</strong> ${data.email}</p>
  <h2>Bericht:</h2>
  <div class="info">
    ${data.message.replace(/\n/g, '<br>')}
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}