import nodemailer from 'nodemailer';
import { OrderFormData } from '@/types';

// Create email transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.strato.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Format order data for email
// Format order data for email
function formatOrderEmail(orderData: OrderFormData): string {
  const { name, address, postalCode, city, contactMethod, contactValue, products, dropoffLocation, comments } = orderData;
  
  // Calculate total
  const total = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
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
    .total-row { font-weight: bold; background-color: #f0f8ff; font-size: 1.1em; }
    .text-right { text-align: right; }
  </style>
</head>
<body>
  <h1>🎯 Nieuwe Bestelling - 3D Print Baarn</h1>
  
  <h2>Klantgegevens</h2>
  <div class="info-row"><span class="label">Naam:</span> ${name}</div>
  <div class="info-row"><span class="label">Adres:</span> ${address}</div>
  <div class="info-row"><span class="label">Postcode:</span> ${postalCode}</div>
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
        <th class="text-right">Prijs per stuk</th>
        <th class="text-right">Totaal</th>
      </tr>
    </thead>
    <tbody>
      ${products.map(p => `
        <tr>
          <td>${p.productName}</td>
          <td>${p.quantity}</td>
          <td>${p.priceType === 'child' ? 'Kinderprijs' : 'Volwassen prijs'}</td>
          <td class="text-right">€${p.price.toFixed(2)}</td>
          <td class="text-right">€${(p.price * p.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="4" class="text-right">Totaalbedrag:</td>
        <td class="text-right">€${total.toFixed(2)}</td>
      </tr>
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
    Deze e-mail is automatisch gegenereerd door het bestelsysteem van 3D Print Baarn.
  </p>
</body>
</html>
`;

  return emailBody;
}

// Send order email
export async function sendOrderEmail(orderData: OrderFormData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    const orderEmail = process.env.ORDER_EMAIL || 'jelte@3dprintbaarn.nl';
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: orderEmail,
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
  ip?: string;
  userAgent?: string;
  submittedAt?: string;
  blocked?: boolean;
}): Promise<boolean> {
  try {
    const transporter = createTransporter();
    const orderEmail = process.env.ORDER_EMAIL || 'jelte@3dprintbaarn.nl';

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: orderEmail,
      subject: `${data.blocked ? '⚠️ GEFLAGD IP — ' : ''}💬 Nieuw Contactbericht van ${data.name}`,
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
  ${data.blocked ? `
  <div style="background-color: #fde8e8; border: 2px solid #e02424; border-radius: 8px; padding: 12px 15px; margin-bottom: 15px; color: #9b1c1c;">
    <strong>⚠️ Dit bericht komt van een IP-adres op de blocklist.</strong><br>
    De afzender heeft een waarschuwing op de site gezien.
  </div>
  ` : ''}
  <p><strong>Van:</strong> ${data.name}</p>
  <p><strong>E-mail:</strong> ${data.email}</p>
  <h2>Bericht:</h2>
  <div class="info">
    ${data.message.replace(/\n/g, '<br>')}
  </div>
  <h2>Technische gegevens</h2>
  <div class="info" style="border-left-color: #999; font-size: 0.9em; color: #555;">
    <p><strong>IP-adres:</strong> ${data.ip || 'onbekend'}</p>
    <p><strong>Tijdstip:</strong> ${data.submittedAt || 'onbekend'}</p>
    <p><strong>Apparaat/browser:</strong> ${data.userAgent || 'onbekend'}</p>
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