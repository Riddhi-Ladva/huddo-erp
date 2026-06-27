import SMTPSetting from '../models/SMTPSetting.js';
import SMSSetting from '../models/SMSSetting.js';
import WhatsAppSetting from '../models/WhatsAppSetting.js';
import CommunicationSetting from '../models/CommunicationSetting.js';
import NotificationTemplate from '../models/NotificationTemplate.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { decrypt } from './crypto.js';
import nodemailer from 'nodemailer';

// Simple compiler for {{variable}} placeholders
export function compileTemplate(templateString, variables = {}) {
  if (!templateString) return '';
  let compiled = templateString;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    compiled = compiled.replace(placeholder, value !== undefined && value !== null ? String(value) : '');
  }
  return compiled;
}

export const triggerNotification = async (slug, variables = {}, recipientOverrides = {}) => {
  try {
    console.log(`[Notification Trigger] Event: ${slug} | Variables:`, variables);

    // 1. Get global settings
    const globalSettings = await CommunicationSetting.findOne() || {
      enable_emails: true,
      enable_sms: true,
      enable_whatsapp: true,
      enable_otp: true,
      enable_marketing: true,
      enable_transactional: true
    };

    // 2. Fetch templates for this slug
    const templates = await NotificationTemplate.find({ slug, is_deleted: { $ne: true } });
    if (!templates || templates.length === 0) {
      console.warn(`[Notification Trigger] No templates found for slug: ${slug}`);
      return;
    }

    for (const template of templates) {
      // Check channel enablement
      if (template.type === 'email' && !globalSettings.enable_emails) {
        console.log(`[Notification Trigger] Email dispatch blocked by global preferences.`);
        continue;
      }
      if (template.type === 'sms' && !globalSettings.enable_sms) {
        console.log(`[Notification Trigger] SMS dispatch blocked by global preferences.`);
        continue;
      }
      if (template.type === 'whatsapp' && !globalSettings.enable_whatsapp) {
        console.log(`[Notification Trigger] WhatsApp dispatch blocked by global preferences.`);
        continue;
      }

      // Check OTP override
      if (slug.includes('otp') && !globalSettings.enable_otp) {
        console.log(`[Notification Trigger] OTP dispatch blocked by global preferences.`);
        continue;
      }

      // Resolve recipient
      const recipient = recipientOverrides[template.type] || variables.recipient_email || variables.recipient_mobile || '';
      if (!recipient) {
        console.warn(`[Notification Trigger] No recipient address resolved for ${template.type} template: ${template.name}`);
        continue;
      }

      // Compile subject and body
      const compiledBody = compileTemplate(template.body, variables);
      const compiledSubject = template.subject ? compileTemplate(template.subject, variables) : '';

      let success = false;
      let response = '';

      if (template.type === 'email') {
        const smtp = await SMTPSetting.findOne({ is_enabled: true });
        if (!smtp || !smtp.is_enabled) {
          console.warn(`[Notification Trigger] No active SMTP configuration found.`);
          continue;
        }

        const password = decrypt(smtp.smtp_password);

        // Fallback for dummy dev credentials
        if (smtp.smtp_host.includes('dummy') || smtp.smtp_username.includes('dummy')) {
          console.log(`[Notification Trigger] [DEV FALLBACK] Mock email logged to: ${recipient}`);
          success = true;
          response = 'Mock successfully logged (dummy dev credentials)';
        } else {
          try {
            const transporter = nodemailer.createTransport({
              host: smtp.smtp_host,
              port: smtp.smtp_port,
              secure: smtp.encryption === 'SSL',
              auth: {
                user: smtp.smtp_username,
                pass: password
              },
              tls: {
                rejectUnauthorized: false
              }
            });

            const mailOptions = {
              from: `"${smtp.sender_name}" <${smtp.sender_email}>`,
              to: recipient,
              subject: compiledSubject,
              text: compiledBody,
              html: compiledBody.replace(/\n/g, '<br>')
            };

            if (smtp.reply_to) {
              mailOptions.replyTo = smtp.reply_to;
            }

            const info = await transporter.sendMail(mailOptions);
            success = true;
            response = `Message ID: ${info.messageId}`;
          } catch (err) {
            console.error(`[Notification Trigger] Email send error:`, err.message);
            success = false;
            response = err.message;
          }
        }
      } else if (template.type === 'sms') {
        const sms = await SMSSetting.findOne({ is_enabled: true });
        if (!sms || !sms.is_enabled) {
          console.warn(`[Notification Trigger] No active SMS configuration found.`);
          continue;
        }

        const key = decrypt(sms.api_key);
        const secret = decrypt(sms.api_secret_token);

        if (sms.provider_name.toLowerCase() === 'twilio' && key && secret && !key.includes('dummy')) {
          try {
            const { default: twilio } = await import('twilio');
            const client = twilio(key, secret);
            const res = await client.messages.create({
              body: compiledBody,
              to: recipient,
              from: sms.sender_id || '+14155238886'
            });
            success = true;
            response = `Twilio SID: ${res.sid}`;
          } catch (err) {
            console.error(`[Notification Trigger] Twilio SMS dispatch error:`, err.message);
            success = false;
            response = err.message;
          }
        } else {
          // fallback mock SMS logging
          console.log(`[Notification Trigger] [DEV FALLBACK] Mock SMS logged to: ${recipient}`);
          success = true;
          response = 'Mock successfully logged (dummy dev credentials)';
        }
      } else if (template.type === 'whatsapp') {
        const wa = await WhatsAppSetting.findOne({ is_enabled: true });
        if (!wa || !wa.is_enabled) {
          console.warn(`[Notification Trigger] No active WhatsApp configuration found.`);
          continue;
        }

        const token = decrypt(wa.access_token);
        const formattedTo = recipient.startsWith('whatsapp:') ? recipient : `whatsapp:${recipient}`;

        if (wa.provider.toLowerCase() === 'twilio' && token && !token.includes('dummy')) {
          try {
            const { default: twilio } = await import('twilio');
            const client = twilio(process.env.TWILIO_ACCOUNT_SID || 'dummy', token);
            const res = await client.messages.create({
              body: compiledBody,
              to: formattedTo,
              from: wa.business_phone_number || 'whatsapp:+14155238886'
            });
            success = true;
            response = `Twilio SID: ${res.sid}`;
          } catch (err) {
            console.error(`[Notification Trigger] Twilio WhatsApp dispatch error:`, err.message);
            success = false;
            response = err.message;
          }
        } else {
          // fallback mock WhatsApp logging
          console.log(`[Notification Trigger] [DEV FALLBACK] Mock WhatsApp logged to: ${formattedTo}`);
          success = true;
          response = 'Mock successfully logged (dummy dev credentials)';
        }
      }

      // Record dispatch log
      const log = new CommunicationLog({
        type: template.type.charAt(0).toUpperCase() + template.type.slice(1),
        recipient,
        subject_template: template.name,
        status: success ? 'Sent' : 'Failed',
        provider_response: response,
        sent_by: variables.sent_by || null
      });
      await log.save();
    }
  } catch (error) {
    console.error('[Notification Trigger] General failure:', error.message);
  }
};
