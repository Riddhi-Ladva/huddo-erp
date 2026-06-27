import nodemailer from 'nodemailer';
import SMTPSetting from '../models/SMTPSetting.js';
import CommunicationSetting from '../models/CommunicationSetting.js';
import { decrypt } from './crypto.js';

export default async function sendEmail({ to, subject, text, html }) {
  console.log(`[Email Service] Sending email to: ${to} | Subject: "${subject}"`);
  
  try {
    // 1. Check global preferences
    const globalPref = await CommunicationSetting.findOne();
    if (globalPref && !globalPref.enable_emails) {
      console.warn(`[Email Service] Outgoing emails are globally disabled in communication preferences.`);
      return { success: false, error: 'Emails globally disabled' };
    }

    // 2. Fetch database SMTP configuration
    const smtp = await SMTPSetting.findOne({ is_enabled: true });

    if (!smtp || smtp.smtp_host.includes('dummy') || smtp.smtp_username.includes('dummy')) {
      // Fallback if DB not configured yet or has dummy values, try loading env variables
      const host = process.env.SMTP_HOST;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      if (!host || !user || !pass || host.includes('dummy')) {
        console.warn(`[Email Service] [DEV FALLBACK] No SMTP credentials configured in DB or ENV. Logging email instead:`);
        console.log(`================ EMAIL LOG ================`);
        console.log(`To:      ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Text:    ${text}`);
        console.log(`===========================================`);
        return { success: true, mock: true };
      }

      // Use env variables
      const transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: { user, pass }
      });

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Huddo ERP'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@huddoerp.com'}>`,
        to,
        subject,
        text,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Email sent successfully via env SMTP: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }

    // 3. Use database settings
    const decryptedPassword = decrypt(smtp.smtp_password);

    const transporter = nodemailer.createTransport({
      host: smtp.smtp_host,
      port: smtp.smtp_port,
      secure: smtp.encryption === 'SSL',
      auth: {
        user: smtp.smtp_username,
        pass: decryptedPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${smtp.sender_name}" <${smtp.sender_email}>`,
      to,
      subject,
      text,
      html
    };

    if (smtp.reply_to) {
      mailOptions.replyTo = smtp.reply_to;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully via DB SMTP: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service] Failed to send email: ${error.message}`);
    throw error;
  }
}
