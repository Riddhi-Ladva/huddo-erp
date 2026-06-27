import WhatsAppSetting from '../models/WhatsAppSetting.js';
import CommunicationSetting from '../models/CommunicationSetting.js';
import { decrypt } from './crypto.js';

export default async function sendWhatsApp({ to, message }) {
  console.log(`[WhatsApp Service] Initiating WhatsApp to: ${to}`);

  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    // 1. Check global preferences
    const globalPref = await CommunicationSetting.findOne();
    if (globalPref && !globalPref.enable_whatsapp) {
      console.warn(`[WhatsApp Service] WhatsApp messages are globally disabled in communication preferences.`);
      return { success: false, error: 'WhatsApp globally disabled' };
    }

    // 2. Fetch WhatsApp provider settings from DB
    const wa = await WhatsAppSetting.findOne({ is_enabled: true });

    if (!wa || !wa.is_enabled || wa.access_token.includes('dummy')) {
      // Fallback to env Twilio credentials
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

      if (!accountSid || !authToken || accountSid.includes('dummy')) {
        console.warn(`[WhatsApp Service] [DEV FALLBACK] No Twilio credentials in DB or ENV. Logging WhatsApp:`);
        console.log(`================ WHATSAPP LOG ================`);
        console.log(`To:      ${formattedTo}`);
        console.log(`Message: ${message}`);
        console.log(`==============================================`);
        return { success: true, mock: true };
      }

      const { default: twilio } = await import('twilio');
      const client = twilio(accountSid, authToken);
      const response = await client.messages.create({
        body: message,
        to: formattedTo,
        from: fromWhatsAppNumber
      });
      console.log(`[WhatsApp Service] WhatsApp sent successfully via ENV Twilio: ${response.sid}`);
      return { success: true, sid: response.sid };
    }

    // 3. Use database settings
    const decryptedToken = decrypt(wa.access_token);

    if (wa.provider.toLowerCase() === 'twilio') {
      const { default: twilio } = await import('twilio');
      // For Twilio WhatsApp we use the account SID from ENV (or access_token if it contains it)
      const accountSid = process.env.TWILIO_ACCOUNT_SID || 'dummy_sid';
      const client = twilio(accountSid, decryptedToken);
      const response = await client.messages.create({
        body: message,
        to: formattedTo,
        from: wa.business_phone_number || 'whatsapp:+14155238886'
      });
      console.log(`[WhatsApp Service] WhatsApp sent successfully via DB Twilio: ${response.sid}`);
      return { success: true, sid: response.sid };
    }

    // Implement Meta Cloud API / Gupshup / Interakt integrations by sending Axios HTTP requests...
    console.log(`[WhatsApp Service] Mock non-Twilio WhatsApp provider '${wa.provider}' dispatch to business phone: ${wa.business_phone_number}`);
    return { success: true, mock: true };
  } catch (error) {
    console.error(`[WhatsApp Service] Failed to send WhatsApp: ${error.message}`);
    // Log content as fallback
    console.log(`================ WHATSAPP FALLBACK LOG ================`);
    console.log(`To:      ${formattedTo}`);
    console.log(`Message: ${message}`);
    console.log(`=======================================================`);
    return { success: false, error: error.message };
  }
}
