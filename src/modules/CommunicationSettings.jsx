import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, ShieldCheck, ToggleLeft, ToggleRight, FileText, 
  Database, RefreshCw, Send, Eye, EyeOff, Search, ChevronLeft, ChevronRight, 
  Download, Play, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { Modal } from '../components/Common';

export default function CommunicationSettings({ showToast }) {
  const [activeTab, setActiveTab] = useState('email'); // email | sms | whatsapp | templates | logs | preferences
  const [loading, setLoading] = useState(false);

  // Configuration States
  const [smtpConfig, setSmtpConfig] = useState({
    sender_name: '',
    sender_email: '',
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    encryption: 'TLS',
    reply_to: '',
    is_enabled: true
  });

  const [smsConfig, setSmsConfig] = useState({
    provider_name: 'Twilio',
    api_url: '',
    api_key: '',
    api_secret_token: '',
    sender_id: '',
    country_code: '+91',
    is_enabled: true
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    provider: 'Twilio',
    phone_number_id: '',
    business_phone_number: '',
    access_token: '',
    api_version: 'v19.0',
    webhook_url: '',
    is_enabled: true
  });

  const [globalPrefs, setGlobalPrefs] = useState({
    enable_emails: true,
    enable_sms: true,
    enable_whatsapp: true,
    enable_otp: true,
    enable_marketing: true,
    enable_transactional: true
  });

  // Reveal password states
  const [showPassword, setShowPassword] = useState({
    smtp: false,
    sms_key: false,
    sms_secret: false,
    whatsapp: false
  });

  // Templates states
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  // Logs states
  const [logs, setLogs] = useState([]);
  const [logsPagination, setLogsPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [logsSearch, setLogsSearch] = useState('');
  const [logsFilterType, setLogsFilterType] = useState('');
  const [logsFilterStatus, setLogsFilterStatus] = useState('');
  const [retryingLogId, setRetryingLogId] = useState(null);

  // Test modal states
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testType, setTestType] = useState(''); // email | sms | whatsapp
  const [testRecipient, setTestRecipient] = useState('');

  // Fetch all configuration settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/communication-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSmtpConfig(data.data.smtp);
        setSmsConfig(data.data.sms);
        setWhatsappConfig(data.data.whatsapp);
        setGlobalPrefs(data.data.global);
      }
    } catch (err) {
      showToast('Failed to load communication settings: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs
  const fetchLogs = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search: logsSearch,
        type: logsFilterType,
        status: logsFilterStatus
      });
      const res = await fetch(`/api/communication-settings/logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setLogsPagination(data.pagination);
      }
    } catch (err) {
      showToast('Failed to load logs: ' + err.message, 'error');
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/communication-settings/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
        if (data.data.length > 0 && !selectedTemplate) {
          setSelectedTemplate(data.data[0]);
          setTemplateSubject(data.data[0].subject || '');
          setTemplateBody(data.data[0].body || '');
        }
      }
    } catch (err) {
      showToast('Failed to load notification templates: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs(1);
    } else if (activeTab === 'templates') {
      fetchTemplates();
    }
  }, [activeTab, logsSearch, logsFilterType, logsFilterStatus]);

  // Handle template selection change
  const selectTemplate = (temp) => {
    setSelectedTemplate(temp);
    setTemplateSubject(temp.subject || '');
    setTemplateBody(temp.body || '');
  };

  // Reveal Credential via API
  const handleReveal = async (type, field, stateKey) => {
    if (showPassword[stateKey]) {
      // Toggle off
      setShowPassword(prev => ({ ...prev, [stateKey]: false }));
      return;
    }

    try {
      const res = await fetch('/api/communication-settings/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify({ type, field })
      });
      const data = await res.json();
      if (data.success) {
        // Temporarily put decrypted value in local form config
        if (type === 'smtp') {
          setSmtpConfig(prev => ({ ...prev, [field]: data.value }));
        } else if (type === 'sms') {
          setSmsConfig(prev => ({ ...prev, [field]: data.value }));
        } else if (type === 'whatsapp') {
          setWhatsappConfig(prev => ({ ...prev, [field]: data.value }));
        }
        setShowPassword(prev => ({ ...prev, [stateKey]: true }));
      } else {
        showToast('Decryption failed', 'error');
      }
    } catch (err) {
      showToast('Failed to reveal credential: ' + err.message, 'error');
    }
  };

  // Save Config Handlers
  const handleSaveSMTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/communication-settings/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify(smtpConfig)
      });
      const data = await res.json();
      if (data.success) {
        showToast('SMTP settings saved successfully!', 'success');
        setShowPassword(prev => ({ ...prev, smtp: false }));
        fetchSettings();
      }
    } catch (err) {
      showToast('Failed to save SMTP: ' + err.message, 'error');
    }
  };

  const handleSaveSMS = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/communication-settings/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify(smsConfig)
      });
      const data = await res.json();
      if (data.success) {
        showToast('SMS provider settings saved successfully!', 'success');
        setShowPassword(prev => ({ ...prev, sms_key: false, sms_secret: false }));
        fetchSettings();
      }
    } catch (err) {
      showToast('Failed to save SMS: ' + err.message, 'error');
    }
  };

  const handleSaveWhatsApp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/communication-settings/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify(whatsappConfig)
      });
      const data = await res.json();
      if (data.success) {
        showToast('WhatsApp API settings saved successfully!', 'success');
        setShowPassword(prev => ({ ...prev, whatsapp: false }));
        fetchSettings();
      }
    } catch (err) {
      showToast('Failed to save WhatsApp: ' + err.message, 'error');
    }
  };

  const handleToggleGlobalPref = async (key, val) => {
    const updatedPrefs = { ...globalPrefs, [key]: val };
    setGlobalPrefs(updatedPrefs);
    try {
      const res = await fetch('/api/communication-settings/global', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify(updatedPrefs)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Global toggle updated successfully.`, 'success');
      }
    } catch (err) {
      showToast('Failed to save preferences: ' + err.message, 'error');
    }
  };

  // Test Dispatch Trigger
  const handleSendTest = async () => {
    if (!testRecipient) {
      showToast('Recipient address is required.', 'error');
      return;
    }
    
    setLoading(true);
    let endpoint = '';
    let bodyData = {};

    if (testType === 'email') {
      endpoint = '/api/communication-settings/test-email';
      bodyData = { ...smtpConfig, recipient_email: testRecipient };
    } else if (testType === 'sms') {
      endpoint = '/api/communication-settings/test-sms';
      bodyData = { ...smsConfig, recipient_mobile: testRecipient };
    } else if (testType === 'whatsapp') {
      endpoint = '/api/communication-settings/test-whatsapp';
      bodyData = { ...whatsappConfig, recipient_mobile: testRecipient };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Test message sent successfully!', 'success');
        setTestModalOpen(false);
        setTestRecipient('');
      } else {
        showToast(data.message || 'Failed to dispatch test message.', 'error');
      }
    } catch (err) {
      showToast('Error dispatching test message: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Template
  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      const res = await fetch(`/api/communication-settings/templates/${selectedTemplate._id || selectedTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        },
        body: JSON.stringify({
          subject: templateSubject,
          body: templateBody
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Notification template updated successfully!', 'success');
        fetchTemplates();
      }
    } catch (err) {
      showToast('Failed to save template: ' + err.message, 'error');
    }
  };

  // Retry failed log
  const handleRetryLog = async (logId) => {
    setRetryingLogId(logId);
    try {
      const res = await fetch(`/api/communication-settings/logs/retry/${logId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('huddo_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Log retry processed successfully!', 'success');
        fetchLogs(logsPagination.page);
      } else {
        showToast(data.message || 'Retry failed.', 'error');
      }
    } catch (err) {
      showToast('Error retrying message: ' + err.message, 'error');
    } finally {
      setRetryingLogId(null);
    }
  };

  // Helper to compile preview text in real-time
  const compilePreview = (text) => {
    if (!text) return '';
    const sampleVars = {
      user_name: 'John Doe',
      company_name: 'Huddo Shoes',
      order_id: 'ORD-9824',
      invoice_no: 'INV-1092',
      otp: '4819',
      amount: '₹4,999.00',
      date: new Date().toLocaleDateString(),
      product_name: 'Classic Leather Sneaker'
    };
    let compiled = text;
    for (const [key, value] of Object.entries(sampleVars)) {
      const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      compiled = compiled.replace(placeholder, value);
    }
    return compiled;
  };

  // Export CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast('No logs available to export.', 'error');
      return;
    }

    const headers = ['Date & Time', 'Type', 'Recipient', 'Template/Subject', 'Status', 'Provider Response'];
    const rows = logs.map(l => [
      new Date(l.timestamp).toLocaleString(),
      l.type,
      l.recipient,
      l.subject_template,
      l.status,
      l.provider_response?.replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `communication_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Communication Settings</h1>
          <p className="text-sm text-slate-500">Configure global dispatch preferences, SMTP configurations, SMS & WhatsApp gateways, and customize notification templates.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'email' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Mail className="w-4 h-4" /> Email SMTP
        </button>
        <button 
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sms' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> SMS Gateway
        </button>
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'whatsapp' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Business
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'templates' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" /> Notification Templates
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Database className="w-4 h-4" /> Logs & History
        </button>
        <button 
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'preferences' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Global Preferences
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
        {/* 1. EMAIL SMTP PANEL */}
        {activeTab === 'email' && (
          <form onSubmit={handleSaveSMTP} className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">SMTP Configuration</h2>
              <button 
                type="button"
                onClick={() => {
                  setTestType('email');
                  setTestModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send Test Email
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sender Name</label>
                <input 
                  type="text" 
                  value={smtpConfig.sender_name} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, sender_name: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. Huddo Shoes Support"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sender Email</label>
                <input 
                  type="email" 
                  value={smtpConfig.sender_email} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, sender_email: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. noreply@huddoerp.in"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Host</label>
                <input 
                  type="text" 
                  value={smtpConfig.smtp_host} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, smtp_host: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. smtp.mailtrap.io"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Port</label>
                <input 
                  type="number" 
                  value={smtpConfig.smtp_port} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, smtp_port: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. 587 or 2525"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Username</label>
                <input 
                  type="text" 
                  value={smtpConfig.smtp_username} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, smtp_username: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. user_identity"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Password</label>
                <div className="relative">
                  <input 
                    type={showPassword.smtp ? "text" : "password"} 
                    value={smtpConfig.smtp_password} 
                    onChange={e => setSmtpConfig({ ...smtpConfig, smtp_password: e.target.value })} 
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange font-mono" 
                    placeholder="Password/Key"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => handleReveal('smtp', 'smtp_password', 'smtp')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Encryption Protocol</label>
                <select 
                  value={smtpConfig.encryption} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="None">None</option>
                  <option value="SSL">SSL</option>
                  <option value="TLS">TLS (Recommended)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reply-To Email Address</label>
                <input 
                  type="email" 
                  value={smtpConfig.reply_to} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, reply_to: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. support@huddoerp.in"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={smtpConfig.is_enabled} 
                  onChange={e => setSmtpConfig({ ...smtpConfig, is_enabled: e.target.checked })} 
                  className="w-4.5 h-4.5 accent-brand-orange"
                />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enable Email Outbox Channel</span>
              </label>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer ml-auto"
              >
                Save Configuration
              </button>
            </div>
          </form>
        )}

        {/* 2. SMS GATEWAY PANEL */}
        {activeTab === 'sms' && (
          <form onSubmit={handleSaveSMS} className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">SMS Gateway Configuration</h2>
              <button 
                type="button"
                onClick={() => {
                  setTestType('sms');
                  setTestModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send Test SMS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMS Provider</label>
                <select 
                  value={smsConfig.provider_name} 
                  onChange={e => setSmsConfig({ ...smsConfig, provider_name: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="Gupshup">Gupshup</option>
                  <option value="Plivo">Plivo</option>
                  <option value="Infobip">Infobip</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API URL</label>
                <input 
                  type="text" 
                  value={smsConfig.api_url} 
                  onChange={e => setSmsConfig({ ...smsConfig, api_url: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. https://api.twilio.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Account SID / Username</label>
                <div className="relative">
                  <input 
                    type={showPassword.sms_key ? "text" : "password"} 
                    value={smsConfig.api_key} 
                    onChange={e => setSmsConfig({ ...smsConfig, api_key: e.target.value })} 
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange font-mono" 
                    placeholder="API Account ID"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => handleReveal('sms', 'api_key', 'sms_key')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.sms_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Auth Token / Secret</label>
                <div className="relative">
                  <input 
                    type={showPassword.sms_secret ? "text" : "password"} 
                    value={smsConfig.api_secret_token} 
                    onChange={e => setSmsConfig({ ...smsConfig, api_secret_token: e.target.value })} 
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange font-mono" 
                    placeholder="API Key / Token"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => handleReveal('sms', 'api_secret_token', 'sms_secret')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.sms_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sender ID / Phone Number</label>
                <input 
                  type="text" 
                  value={smsConfig.sender_id} 
                  onChange={e => setSmsConfig({ ...smsConfig, sender_id: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. +14155238886 or HUDDOS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Default Country Code</label>
                <input 
                  type="text" 
                  value={smsConfig.country_code} 
                  onChange={e => setSmsConfig({ ...smsConfig, country_code: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. +91"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={smsConfig.is_enabled} 
                  onChange={e => setSmsConfig({ ...smsConfig, is_enabled: e.target.checked })} 
                  className="w-4.5 h-4.5 accent-brand-orange"
                />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enable SMS Outbox Channel</span>
              </label>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer ml-auto"
              >
                Save SMS Settings
              </button>
            </div>
          </form>
        )}

        {/* 3. WHATSAPP BUSINESS GATEWAY */}
        {activeTab === 'whatsapp' && (
          <form onSubmit={handleSaveWhatsApp} className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">WhatsApp Gateway Configuration</h2>
              <button 
                type="button"
                onClick={() => {
                  setTestType('whatsapp');
                  setTestModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send Test WhatsApp Message
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">WhatsApp Provider</label>
                <select 
                  value={whatsappConfig.provider} 
                  onChange={e => setWhatsappConfig({ ...whatsappConfig, provider: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="Twilio">Twilio WhatsApp Sandbox / API</option>
                  <option value="Meta">Meta WhatsApp Cloud API</option>
                  <option value="Gupshup">Gupshup API</option>
                  <option value="Interakt">Interakt Gateway</option>
                  <option value="360Dialog">360Dialog Partner</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number ID</label>
                <input 
                  type="text" 
                  value={whatsappConfig.phone_number_id} 
                  onChange={e => setWhatsappConfig({ ...whatsappConfig, phone_number_id: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. 109283749817"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Business Phone Number</label>
                <input 
                  type="text" 
                  value={whatsappConfig.business_phone_number} 
                  onChange={e => setWhatsappConfig({ ...whatsappConfig, business_phone_number: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. +14155238886"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Version</label>
                <input 
                  type="text" 
                  value={whatsappConfig.api_version} 
                  onChange={e => setWhatsappConfig({ ...whatsappConfig, api_version: e.target.value })} 
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                  placeholder="e.g. v19.0"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Access Token / API Secret Key</label>
                <div className="relative">
                  <input 
                    type={showPassword.whatsapp ? "text" : "password"} 
                    value={whatsappConfig.access_token} 
                    onChange={e => setWhatsappConfig({ ...whatsappConfig, access_token: e.target.value })} 
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange font-mono" 
                    placeholder="WhatsApp API System Token"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => handleReveal('whatsapp', 'access_token', 'whatsapp')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword.whatsapp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Webhook URL (Read Only)</label>
                <input 
                  type="text" 
                  value={whatsappConfig.webhook_url} 
                  readOnly 
                  className="w-full px-3.5 py-2 border border-slate-100 bg-slate-50 text-slate-400 rounded-lg text-sm select-all cursor-default" 
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={whatsappConfig.is_enabled} 
                  onChange={e => setWhatsappConfig({ ...whatsappConfig, is_enabled: e.target.checked })} 
                  className="w-4.5 h-4.5 accent-brand-orange"
                />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enable WhatsApp Outbox Channel</span>
              </label>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer ml-auto"
              >
                Save WhatsApp Settings
              </button>
            </div>
          </form>
        )}

        {/* 4. NOTIFICATION TEMPLATES PANEL */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar list */}
            <div className="lg:col-span-1 border border-slate-150 rounded-xl overflow-hidden flex flex-col max-h-[500px]">
              <div className="bg-slate-50 border-b border-slate-150 px-4 py-3">
                <h3 className="text-sm font-bold text-slate-800">Notification Channels</h3>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                {templates.map(temp => (
                  <button
                    key={temp.id || temp._id}
                    onClick={() => selectTemplate(temp)}
                    className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedTemplate?.slug === temp.slug ? 'bg-brand-orange/10 text-brand-orange font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{temp.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      temp.type === 'email' ? 'bg-sky-100 text-sky-800' : temp.type === 'sms' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {temp.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Editor & Preview */}
            <div className="lg:col-span-2 space-y-6">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{selectedTemplate.name}</h3>
                      <p className="text-xs text-slate-400">Slug: <span className="font-mono text-slate-500">{selectedTemplate.slug}</span></p>
                    </div>
                    <button
                      onClick={handleSaveTemplate}
                      className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                    >
                      Save Template
                    </button>
                  </div>

                  {/* Form fields */}
                  {selectedTemplate.type === 'email' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Subject Line</label>
                      <input 
                        type="text" 
                        value={templateSubject} 
                        onChange={e => setTemplateSubject(e.target.value)} 
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                        placeholder="Subject Line"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Message Content Body</label>
                    <textarea 
                      rows={5}
                      value={templateBody} 
                      onChange={e => setTemplateBody(e.target.value)} 
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange font-mono" 
                      placeholder="Template Body (Markdown supported for email, plaintext for SMS/WhatsApp)"
                    />
                  </div>

                  {/* Variables Helper */}
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Supported Dynamic Variables</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTemplate.variables?.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setTemplateBody(prev => prev + ` {{${v}}}`);
                          }}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600 transition-colors cursor-pointer"
                          title="Click to insert variable into body"
                        >
                          {`{{${v}}}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realtime Live Preview Mockup */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Preview</label>
                    
                    {selectedTemplate.type === 'email' ? (
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
                        {/* Email Header */}
                        <div className="bg-white border-b border-slate-200 px-4 py-3 text-xs space-y-1 text-slate-500">
                          <p><span className="font-bold text-slate-700">Subject:</span> {compilePreview(templateSubject)}</p>
                          <p><span className="font-bold text-slate-700">From:</span> {smtpConfig.sender_name || 'Huddo Shoes'} &lt;{smtpConfig.sender_email || 'noreply@huddoerp.in'}&gt;</p>
                          <p><span className="font-bold text-slate-700">To:</span> John Doe &lt;john.doe@example.com&gt;</p>
                        </div>
                        {/* Email Body */}
                        <div className="bg-white m-4 p-6 rounded border border-slate-100 min-h-[150px] text-sm text-slate-700 font-sans whitespace-pre-line">
                          {compilePreview(templateBody)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center bg-slate-50 border border-slate-200 p-6 rounded-xl">
                        {/* Phone Chat Bubble Mockup */}
                        <div className="w-[300px] bg-slate-100 rounded-3xl border-8 border-slate-800 shadow-md overflow-hidden font-sans">
                          {/* Chat Screen header */}
                          <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 text-white">
                            <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-[10px] font-bold">H</div>
                            <div>
                              <p className="text-[10px] font-bold">Huddo Shoes</p>
                              <p className="text-[7px] text-slate-400">Online</p>
                            </div>
                          </div>
                          {/* Chat Messages Area */}
                          <div className="p-3 space-y-2 h-[220px] overflow-y-auto bg-slate-50/70 flex flex-col justify-end">
                            <div className="bg-emerald-100 text-slate-800 p-2.5 rounded-lg rounded-tr-none text-[10px] max-w-[85%] self-end shadow-sm whitespace-pre-line">
                              {selectedTemplate.type === 'whatsapp' && (
                                <p className="text-[8px] font-bold text-emerald-700 mb-0.5">WhatsApp Business Message</p>
                              )}
                              {compilePreview(templateBody)}
                              <span className="block text-[6px] text-slate-400 text-right mt-1">12:30 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-slate-400 gap-2">
                  <AlertCircle className="w-10 h-10" />
                  <p className="text-sm font-semibold">No Templates Loaded</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. COMMUNICATION LOGS PANEL */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={logsSearch} 
                  onChange={e => setLogsSearch(e.target.value)} 
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:border-brand-orange" 
                  placeholder="Search by recipient, template/subject, or response..."
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={logsFilterType} 
                  onChange={e => setLogsFilterType(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:border-brand-orange"
                >
                  <option value="">All Channels</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
                <select 
                  value={logsFilterStatus} 
                  onChange={e => setLogsFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:border-brand-orange"
                >
                  <option value="">All Statuses</option>
                  <option value="Sent">Sent</option>
                  <option value="Failed">Failed</option>
                </select>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Subject / Template</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Provider Response</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {logs.length > 0 ? (
                    logs.map(log => (
                      <tr key={log.id || log._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            log.type === 'Email' ? 'bg-sky-100 text-sky-800' : log.type === 'SMS' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{log.recipient}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{log.subject_template}</td>
                        <td className="px-4 py-3">
                          {log.status === 'Sent' ? (
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-600 font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[10px] max-w-[200px] truncate" title={log.provider_response}>
                          {log.provider_response}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {log.status === 'Failed' && (
                            <button
                              onClick={() => handleRetryLog(log.id || log._id)}
                              disabled={retryingLogId === (log.id || log._id)}
                              className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 disabled:bg-slate-100 disabled:text-slate-400 border border-brand-orange/20 disabled:border-transparent rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ml-auto"
                            >
                              <RefreshCw className={`w-3 h-3 ${retryingLogId === (log.id || log._id) ? 'animate-spin' : ''}`} /> Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400 font-medium">No logs matched the query parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {logsPagination.pages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-slate-500">
                  Showing page <span className="font-bold text-slate-700">{logsPagination.page}</span> of <span className="font-bold text-slate-700">{logsPagination.pages}</span> ({logsPagination.total} logs total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchLogs(logsPagination.page - 1)}
                    disabled={logsPagination.page === 1}
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fetchLogs(logsPagination.page + 1)}
                    disabled={logsPagination.page === logsPagination.pages}
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. GLOBAL PREFERENCES PANEL */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">Global Communication Switches</h2>
              <p className="text-xs text-slate-500">Enable or disable entire dispatch pathways immediately across all ERP modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Email System</h3>
                  <p className="text-[11px] text-slate-400">Controls welcome emails, invoice PDFs, commissions alerts, etc.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_emails', !globalPrefs.enable_emails)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_emails ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SMS Pathway</h3>
                  <p className="text-[11px] text-slate-400">Controls order confirmations, security OTP dispatches, etc.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_sms', !globalPrefs.enable_sms)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_sms ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">WhatsApp Gateway</h3>
                  <p className="text-[11px] text-slate-400">Controls Twilio WhatsApp Business API alerts and OTPs.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_whatsapp', !globalPrefs.enable_whatsapp)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_whatsapp ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">OTP Dispatches</h3>
                  <p className="text-[11px] text-slate-400">Enables or disables registration, login, and forgot password codes.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_otp', !globalPrefs.enable_otp)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_otp ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Marketing & Campaign Dispatches</h3>
                  <p className="text-[11px] text-slate-400">Permits or blocks promotional broadcasts and newsletters.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_marketing', !globalPrefs.enable_marketing)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_marketing ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Transactional Dispatches</h3>
                  <p className="text-[11px] text-slate-400">Controls automated receipts, payroll notifications, low stock alerts.</p>
                </div>
                <button
                  onClick={() => handleToggleGlobalPref('enable_transactional', !globalPrefs.enable_transactional)}
                  className="focus:outline-none cursor-pointer"
                >
                  {globalPrefs.enable_transactional ? (
                    <ToggleRight className="w-12 h-12 text-brand-orange" />
                  ) : (
                    <ToggleLeft className="w-12 h-12 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Recipient Modal */}
      {testModalOpen && (
        <Modal 
          title={`Send Test ${testType.toUpperCase()}`}
          onClose={() => {
            setTestModalOpen(false);
            setTestRecipient('');
          }}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Verify that your settings are correctly configured by sending a test dispatch. Make sure you save any edits before testing.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {testType === 'email' ? 'Recipient Email Address' : 'Recipient Mobile Number'}
              </label>
              <input 
                type={testType === 'email' ? 'email' : 'text'}
                value={testRecipient} 
                onChange={e => setTestRecipient(e.target.value)} 
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" 
                placeholder={testType === 'email' ? 'e.g. rohan@huddoerp.in' : 'e.g. +919876543210'}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setTestModalOpen(false);
                  setTestRecipient('');
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTest}
                disabled={loading}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/95 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Test
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
