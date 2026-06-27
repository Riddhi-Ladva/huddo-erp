import SMTPSetting from '../models/SMTPSetting.js';
import SMSSetting from '../models/SMSSetting.js';
import WhatsAppSetting from '../models/WhatsAppSetting.js';
import CommunicationSetting from '../models/CommunicationSetting.js';
import NotificationTemplate from '../models/NotificationTemplate.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { logAuditEvent } from '../utils/auditLogger.js';
import nodemailer from 'nodemailer';

// Helper to mask secrets
const maskValue = (val) => (val ? '••••••••' : '');

// 1. GET /api/v1/communication-settings
export const getCommunicationSettings = async (req, res, next) => {
  try {
    let smtp = await SMTPSetting.findOne();
    let sms = await SMSSetting.findOne();
    let whatsapp = await WhatsAppSetting.findOne();
    let globalPref = await CommunicationSetting.findOne();

    // Create default records if they don't exist
    if (!globalPref) {
      globalPref = new CommunicationSetting();
      await globalPref.save();
    }
    if (!smtp) {
      smtp = new SMTPSetting({
        sender_name: 'Huddo Shoes',
        sender_email: 'noreply@huddoerp.in',
        smtp_host: 'smtp.mailtrap.io',
        smtp_port: 2525,
        smtp_username: 'dummy_username',
        smtp_password: encrypt('dummy_password'),
        encryption: 'TLS',
        is_enabled: true
      });
      await smtp.save();
    }
    if (!sms) {
      sms = new SMSSetting({
        provider_name: 'Twilio',
        api_url: 'https://api.twilio.com',
        api_key: encrypt('dummy_key'),
        api_secret_token: encrypt('dummy_token'),
        sender_id: 'HUDDOS',
        is_enabled: true
      });
      await sms.save();
    }
    if (!whatsapp) {
      whatsapp = new WhatsAppSetting({
        provider: 'Twilio',
        phone_number_id: '123456789',
        business_phone_number: '+14155238886',
        access_token: encrypt('dummy_token'),
        api_version: 'v19.0',
        webhook_url: 'http://localhost:5000/api/v1/whatsapp/webhook',
        is_enabled: true
      });
      await whatsapp.save();
    }

    // Mask sensitive fields in output
    const smtpJSON = smtp.toJSON();
    smtpJSON.smtp_password = maskValue(smtp.smtp_password);

    const smsJSON = sms.toJSON();
    smsJSON.api_key = maskValue(sms.api_key);
    smsJSON.api_secret_token = maskValue(sms.api_secret_token);

    const whatsappJSON = whatsapp.toJSON();
    whatsappJSON.access_token = maskValue(whatsapp.access_token);

    res.status(200).json({
      success: true,
      data: {
        smtp: smtpJSON,
        sms: smsJSON,
        whatsapp: whatsappJSON,
        global: globalPref
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. POST /api/v1/communication-settings/smtp
export const updateSMTPSettings = async (req, res, next) => {
  try {
    const { sender_name, sender_email, smtp_host, smtp_port, smtp_username, smtp_password, encryption, reply_to, is_enabled } = req.body;
    
    let smtp = await SMTPSetting.findOne();
    const isNew = !smtp;
    
    const oldValue = smtp ? smtp.toJSON() : null;

    if (isNew) {
      smtp = new SMTPSetting({
        sender_name,
        sender_email,
        smtp_host,
        smtp_port,
        smtp_username,
        smtp_password: encrypt(smtp_password || ''),
        encryption,
        reply_to,
        is_enabled: is_enabled !== undefined ? is_enabled : true
      });
    } else {
      smtp.sender_name = sender_name;
      smtp.sender_email = sender_email;
      smtp.smtp_host = smtp_host;
      smtp.smtp_port = smtp_port;
      smtp.smtp_username = smtp_username;
      smtp.encryption = encryption;
      smtp.reply_to = reply_to;
      smtp.is_enabled = is_enabled !== undefined ? is_enabled : smtp.is_enabled;

      // Update password only if a new non-masked password was entered
      if (smtp_password && smtp_password !== '••••••••') {
        smtp.smtp_password = encrypt(smtp_password);
      }
    }

    await smtp.save();
    
    // Log audit event
    await logAuditEvent(
      req.user?._id,
      isNew ? 'create-smtp-config' : 'update-smtp-config',
      'communication-settings',
      smtp._id,
      oldValue,
      smtp.toJSON(),
      req
    );

    res.status(200).json({
      success: true,
      message: 'SMTP settings saved successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST /api/v1/communication-settings/sms
export const updateSMSSettings = async (req, res, next) => {
  try {
    const { provider_name, api_url, api_key, api_secret_token, sender_id, country_code, is_enabled } = req.body;

    let sms = await SMSSetting.findOne();
    const isNew = !sms;
    const oldValue = sms ? sms.toJSON() : null;

    if (isNew) {
      sms = new SMSSetting({
        provider_name,
        api_url,
        api_key: encrypt(api_key || ''),
        api_secret_token: encrypt(api_secret_token || ''),
        sender_id,
        country_code,
        is_enabled: is_enabled !== undefined ? is_enabled : true
      });
    } else {
      sms.provider_name = provider_name;
      sms.api_url = api_url;
      sms.sender_id = sender_id;
      sms.country_code = country_code;
      sms.is_enabled = is_enabled !== undefined ? is_enabled : sms.is_enabled;

      if (api_key && api_key !== '••••••••') {
        sms.api_key = encrypt(api_key);
      }
      if (api_secret_token && api_secret_token !== '••••••••') {
        sms.api_secret_token = encrypt(api_secret_token);
      }
    }

    await sms.save();

    await logAuditEvent(
      req.user?._id,
      isNew ? 'create-sms-config' : 'update-sms-config',
      'communication-settings',
      sms._id,
      oldValue,
      sms.toJSON(),
      req
    );

    res.status(200).json({
      success: true,
      message: 'SMS provider settings saved successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 4. POST /api/v1/communication-settings/whatsapp
export const updateWhatsAppSettings = async (req, res, next) => {
  try {
    const { provider, phone_number_id, business_phone_number, access_token, api_version, webhook_url, is_enabled } = req.body;

    let wa = await WhatsAppSetting.findOne();
    const isNew = !wa;
    const oldValue = wa ? wa.toJSON() : null;

    if (isNew) {
      wa = new WhatsAppSetting({
        provider,
        phone_number_id,
        business_phone_number,
        access_token: encrypt(access_token || ''),
        api_version,
        webhook_url,
        is_enabled: is_enabled !== undefined ? is_enabled : true
      });
    } else {
      wa.provider = provider;
      wa.phone_number_id = phone_number_id;
      wa.business_phone_number = business_phone_number;
      wa.api_version = api_version;
      wa.webhook_url = webhook_url;
      wa.is_enabled = is_enabled !== undefined ? is_enabled : wa.is_enabled;

      if (access_token && access_token !== '••••••••') {
        wa.access_token = encrypt(access_token);
      }
    }

    await wa.save();

    await logAuditEvent(
      req.user?._id,
      isNew ? 'create-whatsapp-config' : 'update-whatsapp-config',
      'communication-settings',
      wa._id,
      oldValue,
      wa.toJSON(),
      req
    );

    res.status(200).json({
      success: true,
      message: 'WhatsApp Business API settings saved successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// 5. POST /api/v1/communication-settings/global
export const updateGlobalPreferences = async (req, res, next) => {
  try {
    const { enable_emails, enable_sms, enable_whatsapp, enable_otp, enable_marketing, enable_transactional } = req.body;

    let pref = await CommunicationSetting.findOne();
    const isNew = !pref;
    const oldValue = pref ? pref.toJSON() : null;

    if (isNew) {
      pref = new CommunicationSetting({
        enable_emails,
        enable_sms,
        enable_whatsapp,
        enable_otp,
        enable_marketing,
        enable_transactional
      });
    } else {
      pref.enable_emails = enable_emails !== undefined ? enable_emails : pref.enable_emails;
      pref.enable_sms = enable_sms !== undefined ? enable_sms : pref.enable_sms;
      pref.enable_whatsapp = enable_whatsapp !== undefined ? enable_whatsapp : pref.enable_whatsapp;
      pref.enable_otp = enable_otp !== undefined ? enable_otp : pref.enable_otp;
      pref.enable_marketing = enable_marketing !== undefined ? enable_marketing : pref.enable_marketing;
      pref.enable_transactional = enable_transactional !== undefined ? enable_transactional : pref.enable_transactional;
    }

    await pref.save();

    await logAuditEvent(
      req.user?._id,
      isNew ? 'create-global-preferences' : 'update-global-preferences',
      'communication-settings',
      pref._id,
      oldValue,
      pref.toJSON(),
      req
    );

    res.status(200).json({
      success: true,
      message: 'Global preferences updated successfully.',
      data: pref
    });
  } catch (error) {
    next(error);
  }
};

// 6. POST /api/v1/communication-settings/reveal
export const revealCredential = async (req, res, next) => {
  try {
    const { type, field } = req.body;
    let decryptedValue = '';

    if (type === 'smtp') {
      const smtp = await SMTPSetting.findOne();
      if (smtp && field === 'smtp_password') {
        decryptedValue = decrypt(smtp.smtp_password);
      }
    } else if (type === 'sms') {
      const sms = await SMSSetting.findOne();
      if (sms) {
        if (field === 'api_key') decryptedValue = decrypt(sms.api_key);
        if (field === 'api_secret_token') decryptedValue = decrypt(sms.api_secret_token);
      }
    } else if (type === 'whatsapp') {
      const wa = await WhatsAppSetting.findOne();
      if (wa && field === 'access_token') {
        decryptedValue = decrypt(wa.access_token);
      }
    }

    // Log this highly sensitive reveal event to the audit trail
    await logAuditEvent(
      req.user?._id,
      'reveal-communication-credential',
      'communication-settings',
      null,
      null,
      { type, field },
      req
    );

    res.status(200).json({
      success: true,
      value: decryptedValue
    });
  } catch (error) {
    next(error);
  }
};

// 7. POST /api/v1/communication-settings/test-email
export const sendTestEmailController = async (req, res, next) => {
  try {
    const { recipient_email, sender_name, sender_email, smtp_host, smtp_port, smtp_username, smtp_password, encryption, reply_to } = req.body;

    if (!recipient_email) {
      return res.status(400).json({ success: false, message: 'Recipient email is required.' });
    }

    // Resolve password
    let password = smtp_password;
    if (password === '••••••••') {
      const saved = await SMTPSetting.findOne();
      password = saved ? decrypt(saved.smtp_password) : '';
    }

    // Handle dummy dev credentials fallback
    if (!smtp_host || smtp_host.includes('dummy') || smtp_username.includes('dummy')) {
      console.log(`[Test Email] Intercepted dummy credentials. Logging mock send to: ${recipient_email}`);
      
      const log = new CommunicationLog({
        type: 'Email',
        recipient: recipient_email,
        subject_template: 'SMTP configuration Test Email',
        status: 'Sent',
        provider_response: 'Mock Test successful (using dummy credentials fallback)',
        sent_by: req.user?._id
      });
      await log.save();

      return res.status(200).json({
        success: true,
        message: 'Mock Test email sent successfully (development mode dummy credentials).'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port) || 587,
      secure: encryption === 'SSL',
      auth: {
        user: smtp_username,
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${sender_name || 'Huddo ERP Test'}" <${sender_email || 'test@huddoerp.in'}>`,
      to: recipient_email,
      subject: 'Huddo Shoes ERP - SMTP Connection Test',
      text: `Hello,\n\nThis is a test email confirming that your SMTP server configuration on Huddo ERP is working correctly!\n\nSent at: ${new Date().toLocaleString()}`,
      html: `<h3>Huddo Shoes ERP - SMTP Connection Test</h3><p>This is a test email confirming that your SMTP server configuration on Huddo ERP is working correctly!</p><p>Sent at: <strong>${new Date().toLocaleString()}</strong></p>`
    };

    if (reply_to) {
      mailOptions.replyTo = reply_to;
    }

    await transporter.sendMail(mailOptions);

    const log = new CommunicationLog({
      type: 'Email',
      recipient: recipient_email,
      subject_template: 'SMTP configuration Test Email',
      status: 'Sent',
      provider_response: 'Email delivered successfully',
      sent_by: req.user?._id
    });
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully!'
    });
  } catch (error) {
    const log = new CommunicationLog({
      type: 'Email',
      recipient: req.body.recipient_email || 'unknown',
      subject_template: 'SMTP configuration Test Email',
      status: 'Failed',
      provider_response: error.message,
      sent_by: req.user?._id
    });
    await log.save();

    res.status(500).json({
      success: false,
      message: `Failed to send test email: ${error.message}`
    });
  }
};

// 8. POST /api/v1/communication-settings/test-sms
export const sendTestSMSController = async (req, res, next) => {
  try {
    const { recipient_mobile, provider_name, api_url, api_key, api_secret_token, sender_id } = req.body;

    if (!recipient_mobile) {
      return res.status(400).json({ success: false, message: 'Recipient mobile number is required.' });
    }

    // Resolve key and token
    let key = api_key;
    let secret = api_secret_token;
    if (key === '••••••••') {
      const saved = await SMSSetting.findOne();
      key = saved ? decrypt(saved.api_key) : '';
    }
    if (secret === '••••••••') {
      const saved = await SMSSetting.findOne();
      secret = saved ? decrypt(saved.api_secret_token) : '';
    }

    // If using Twilio as provider, try sending via client
    let sid = 'mock-sms-sid-' + Math.random().toString(36).substr(2, 9);
    let mock = true;

    if (provider_name.toLowerCase() === 'twilio' && key && secret && !key.includes('dummy') && !secret.includes('dummy')) {
      try {
        const { default: twilio } = await import('twilio');
        const client = twilio(key, secret);
        const response = await client.messages.create({
          body: `Huddo ERP SMS Connection Test. Sent at: ${new Date().toLocaleString()}`,
          to: recipient_mobile,
          from: sender_id || '+14155238886'
        });
        sid = response.sid;
        mock = false;
      } catch (err) {
        throw new Error(`Twilio Dispatch Error: ${err.message}`);
      }
    }

    const log = new CommunicationLog({
      type: 'SMS',
      recipient: recipient_mobile,
      subject_template: 'SMS Provider Test',
      status: 'Sent',
      provider_response: mock ? `Mock SMS sent successfully (development fallback)` : `Twilio SID: ${sid}`,
      sent_by: req.user?._id
    });
    await log.save();

    res.status(200).json({
      success: true,
      message: mock ? 'Test SMS simulated successfully (development mode fallback).' : 'Test SMS sent successfully!'
    });
  } catch (error) {
    const log = new CommunicationLog({
      type: 'SMS',
      recipient: req.body.recipient_mobile || 'unknown',
      subject_template: 'SMS Provider Test',
      status: 'Failed',
      provider_response: error.message,
      sent_by: req.user?._id
    });
    await log.save();

    res.status(500).json({
      success: false,
      message: `Failed to send test SMS: ${error.message}`
    });
  }
};

// 9. POST /api/v1/communication-settings/test-whatsapp
export const sendTestWhatsAppController = async (req, res, next) => {
  try {
    const { recipient_mobile, provider, phone_number_id, business_phone_number, access_token } = req.body;

    if (!recipient_mobile) {
      return res.status(400).json({ success: false, message: 'Recipient phone number is required.' });
    }

    let token = access_token;
    if (token === '••••••••') {
      const saved = await WhatsAppSetting.findOne();
      token = saved ? decrypt(saved.access_token) : '';
    }

    const formattedTo = recipient_mobile.startsWith('whatsapp:') ? recipient_mobile : `whatsapp:${recipient_mobile}`;
    let sid = 'mock-wa-sid-' + Math.random().toString(36).substr(2, 9);
    let mock = true;

    if (provider.toLowerCase() === 'twilio' && token && !token.includes('dummy')) {
      try {
        const { default: twilio } = await import('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID || 'dummy', token);
        const response = await client.messages.create({
          body: `Huddo ERP WhatsApp Connection Test. Sent at: ${new Date().toLocaleString()}`,
          to: formattedTo,
          from: business_phone_number || 'whatsapp:+14155238886'
        });
        sid = response.sid;
        mock = false;
      } catch (err) {
        throw new Error(`Twilio WhatsApp Dispatch Error: ${err.message}`);
      }
    }

    const log = new CommunicationLog({
      type: 'WhatsApp',
      recipient: formattedTo,
      subject_template: 'WhatsApp API Connection Test',
      status: 'Sent',
      provider_response: mock ? `Mock WhatsApp message simulated successfully` : `Twilio SID: ${sid}`,
      sent_by: req.user?._id
    });
    await log.save();

    res.status(200).json({
      success: true,
      message: mock ? 'Test WhatsApp message simulated successfully (development mode fallback).' : 'Test WhatsApp message sent successfully!'
    });
  } catch (error) {
    const log = new CommunicationLog({
      type: 'WhatsApp',
      recipient: req.body.recipient_mobile || 'unknown',
      subject_template: 'WhatsApp API Connection Test',
      status: 'Failed',
      provider_response: error.message,
      sent_by: req.user?._id
    });
    await log.save();

    res.status(500).json({
      success: false,
      message: `Failed to send test WhatsApp message: ${error.message}`
    });
  }
};

// 10. GET /api/v1/communication-settings/logs
export const getCommunicationLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', type = '', status = '' } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = { is_deleted: { $ne: true } };

    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { recipient: { $regex: search, $options: 'i' } },
        { subject_template: { $regex: search, $options: 'i' } },
        { provider_response: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await CommunicationLog.find(query)
      .populate('sent_by', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await CommunicationLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 11. POST /api/v1/communication-settings/logs/retry/:id
export const retryCommunicationLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await CommunicationLog.findById(id);

    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found.' });
    }

    // Try to trigger a dispatch
    let success = false;
    let response = '';

    if (log.type === 'Email') {
      const smtp = await SMTPSetting.findOne({ is_enabled: true });
      if (!smtp) throw new Error('No active SMTP provider configuration.');
      
      const decryptedPassword = decrypt(smtp.smtp_password);
      
      // Fallback for mock test settings
      if (smtp.smtp_host.includes('dummy') || smtp.smtp_username.includes('dummy')) {
        success = true;
        response = 'Mock Retry Successful';
      } else {
        const transporter = nodemailer.createTransport({
          host: smtp.smtp_host,
          port: smtp.smtp_port,
          secure: smtp.encryption === 'SSL',
          auth: { user: smtp.smtp_username, pass: decryptedPassword },
          tls: { rejectUnauthorized: false }
        });
        await transporter.sendMail({
          from: `"${smtp.sender_name}" <${smtp.sender_email}>`,
          to: log.recipient,
          subject: `[RETRY] ${log.subject_template}`,
          text: `This is a retried message.\n\nOriginal Subject: ${log.subject_template}`
        });
        success = true;
        response = 'Email retried and sent successfully.';
      }
    } else if (log.type === 'SMS') {
      const sms = await SMSSetting.findOne({ is_enabled: true });
      if (!sms) throw new Error('No active SMS provider configuration.');

      if (sms.provider_name.toLowerCase() === 'twilio' && !sms.api_key.includes('dummy')) {
        const key = decrypt(sms.api_key);
        const secret = decrypt(sms.api_secret_token);
        const { default: twilio } = await import('twilio');
        const client = twilio(key, secret);
        await client.messages.create({
          body: `[RETRY] Message: ${log.subject_template}`,
          to: log.recipient,
          from: sms.sender_id || '+14155238886'
        });
        success = true;
        response = 'SMS retried and sent successfully.';
      } else {
        success = true;
        response = 'Mock SMS Retry Successful';
      }
    } else if (log.type === 'WhatsApp') {
      const wa = await WhatsAppSetting.findOne({ is_enabled: true });
      if (!wa) throw new Error('No active WhatsApp configuration.');

      if (wa.provider.toLowerCase() === 'twilio' && !wa.access_token.includes('dummy')) {
        const token = decrypt(wa.access_token);
        const { default: twilio } = await import('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID || 'dummy', token);
        await client.messages.create({
          body: `[RETRY] Message: ${log.subject_template}`,
          to: log.recipient,
          from: wa.business_phone_number || 'whatsapp:+14155238886'
        });
        success = true;
        response = 'WhatsApp message retried and sent successfully.';
      } else {
        success = true;
        response = 'Mock WhatsApp Retry Successful';
      }
    }

    log.status = success ? 'Sent' : 'Failed';
    log.provider_response = response;
    log.timestamp = new Date();
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Message retried successfully!',
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retry message: ${error.message}`
    });
  }
};

// 12. GET /api/v1/communication-settings/templates
export const getNotificationTemplates = async (req, res, next) => {
  try {
    const templates = await NotificationTemplate.find({ is_deleted: { $ne: true } });
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

// 13. PUT /api/v1/communication-settings/templates/:id
export const updateNotificationTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, body } = req.body;

    const template = await NotificationTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Notification template not found.' });
    }

    const oldValue = template.toJSON();

    template.subject = subject !== undefined ? subject : template.subject;
    template.body = body !== undefined ? body : template.body;

    await template.save();

    await logAuditEvent(
      req.user?._id,
      'update-notification-template',
      'communication-settings',
      template._id,
      oldValue,
      template.toJSON(),
      req
    );

    res.status(200).json({
      success: true,
      message: 'Notification template updated successfully.',
      data: template
    });
  } catch (error) {
    next(error);
  }
};
