import AuditLog from '../models/AuditLog.js';

export const logAuditEvent = async (userId, action, module, recordId = null, oldValue = null, newValue = null, req = null) => {
  try {
    let ip_address = '';
    let user_agent = '';
    if (req) {
      ip_address = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || '';
      user_agent = req.headers['user-agent'] || '';
    }
    
    const log = new AuditLog({
      user: userId,
      action,
      module,
      record_id: recordId,
      old_value: oldValue,
      new_value: newValue,
      ip_address,
      user_agent,
      performed_at: new Date()
    });
    
    await log.save();
  } catch (err) {
    console.error('[Audit Logger] Failed to record audit log:', err);
  }
};
