import SMSSetting from '../models/SMSSetting.js';
import CommunicationSetting from '../models/CommunicationSetting.js';
import { decrypt } from './crypto.js';

export default async function sendSMS({ to, message }) {
  console.log(`[SMS Service] Initiating SMS to: ${to}`);

  try {
    // 1. Check global preferences
    const globalPref = await CommunicationSetting.findOne();
    if (globalPref && !globalPref.enable_sms) {
      console.warn(`[SMS Service] SMS messages are globally disabled in communication preferences.`);
      return { success: false, error: 'SMS globally disabled' };
    }

    // 2. Fetch SMS provider settings from DB
    const sms = await SMSSetting.findOne({ is_enabled: true });

    if (!sms || !sms.is_enabled || sms.api_key.includes('dummy')) {
      // Fallback to env Twilio credentials
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber || accountSid.includes('dummy')) {
        console.warn(`[SMS Service] [DEV FALLBACK] No Twilio credentials in DB or ENV. Logging SMS content:`);
        console.log(`================ SMS LOG ================`);
        console.log(`To:      ${to}`);
        console.log(`Message: ${message}`);
        console.log(`=========================================`);
        return { success: true, mock: true };
      }

      const { default: twilio } = await import('twilio');
      const client = twilio(accountSid, authToken);
      const response = await client.messages.create({
        body: message,
        to: to,
        from: fromNumber
      });
      console.log(`[SMS Service] SMS sent successfully via ENV Twilio: ${response.sid}`);
      return { success: true, sid: response.sid };
    }

    // 3. Use database settings
    const decryptedKey = decrypt(sms.api_key);
    const decryptedSecret = decrypt(sms.api_secret_token);

    if (sms.provider_name.toLowerCase() === 'twilio') {
      const { default: twilio } = await import('twilio');
      const client = twilio(decryptedKey, decryptedSecret);
      const response = await client.messages.create({
        body: message,
        to: to,
        from: sms.sender_id || '+14155238886'
      });
      console.log(`[SMS Service] SMS sent successfully via DB Twilio: ${response.sid}`);
      return { success: true, sid: response.sid };
    }

    // Implement other provider interfaces here (e.g. Gupshup, Plivo, etc. by making axios calls to sms.api_url)
    console.log(`[SMS Service] Mock non-Twilio provider '${sms.provider_name}' API dispatch to: ${sms.api_url}`);
    return { success: true, mock: true };
  } catch (error) {
    console.error(`[SMS Service] Failed to send SMS: ${error.message}`);
    // Log content as fallback
    console.log(`================ SMS FALLBACK LOG ================`);
    console.log(`To:      ${to}`);
    console.log(`Message: ${message}`);
    console.log(`==================================================`);
    return { success: false, error: error.message };
  }
}
