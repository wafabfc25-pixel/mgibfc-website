// ============================================================
// MGI BFC - Service d'envoi d'emails
// ============================================================

import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

// Configuration SMTP (variables d'environnement)
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_USER=contact@mgibfc.com
// SMTP_PASS=your_password
// NOTIFY_EMAIL=votre@email.com

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export interface EmailData {
  type: 'contact' | 'candidature' | 'service';
  nom: string;
  email: string;
  telephone?: string;
  message: string;
  serviceDemande?: string;
  cvUrl?: string;
}

export async function sendNotificationEmail(data: EmailData): Promise<boolean> {
  const subjectMap = {
    contact: '📬 Nouveau message de contact',
    candidature: '📄 Nouvelle candidature reçue',
    service: '📋 Nouvelle demande de service',
  };
  
  const typeLabel = {
    contact: 'Formulaire de contact',
    candidature: 'Candidature / Recrutement',
    service: 'Demande de service',
  };
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
        h2 { color: #2052A3; border-bottom: 2px solid #00929F; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        td { padding: 10px; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
        td:first-child { width: 140px; font-weight: bold; background: #f8f9fa; }
        .footer { font-size: 12px; color: #666; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
      </style>
    </head>
    <body>
      <h2>${typeLabel[data.type]}</h2>
      <table>
        <tr><td>Nom complet</td><td>${escapeHtml(data.nom)}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        ${data.telephone ? `<tr><td>Téléphone</td><td>${escapeHtml(data.telephone)}</td></tr>` : ''}
        ${data.serviceDemande ? `<tr><td>Service demandé</td><td>${escapeHtml(data.serviceDemande)}</td></tr>` : ''}
        ${data.cvUrl ? `<tr><td>CV</td><td><a href="${escapeHtml(data.cvUrl)}">Télécharger le CV</a></td></tr>` : ''}
        <tr><td>Message</td><td>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr>
      </table>
      <div class="footer">
        <p>📅 Message envoyé depuis le site MGI BFC le ${new Date().toLocaleString('fr-FR')}</p>
        <p>📍 IP: ${data.type === 'contact' ? 'Enregistrée côté serveur' : 'N/A'}</p>
      </div>
    </body>
    </html>
  `;
  
  try {
    const transporterInstance = getTransporter();
    await transporterInstance.sendMail({
      from: `"Site MGI BFC" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: data.email,
      subject: subjectMap[data.type],
      html: htmlContent,
      text: `${typeLabel[data.type]}\n\nNom: ${data.nom}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

// Helper pour échapper le HTML
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}