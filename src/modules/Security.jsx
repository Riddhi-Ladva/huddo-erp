import React, { useState } from 'react';
import { Shield, ShieldAlert, Key, RefreshCw, XCircle, Database, HelpCircle } from 'lucide-react';
import { initialAuditLogs, activeSessions } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function Security({ showToast }) {
  const [activeTab, setActiveTab] = useState('audit'); // audit | sessions | otp | password | backup
  const [logs, setLogs] = useState(initialAuditLogs);
  const [sessions, setSessions] = useState(activeSessions);

  // OTP Configuration State
  const [otpEnabled, setOtpEnabled] = useState(true);
  const [otpExpiry, setOtpExpiry] = useState(5); // minutes

  // Password Policy State
  const [pwdPolicy, setPwdPolicy] = useState({
    minLength: 8,
    requireUpper: true,
    requireNumbers: true,
    requireSpecial: true,
    maxAttempts: 5
  });

  // Backup logs
  const [lastBackup, setLastBackup] = useState('2026-06-08 23:00:00');
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  const handleRevokeSession = (id, user) => {
    setSessions(sessions.filter(s => s.id !== id));
    showToast(`Revoked active login session credentials for ${user}`, "success");
  };

  const handleRunBackup = () => {
    setIsBackupRunning(true);
    setTimeout(() => {
      setLastBackup(new Date().toISOString().replace('T', ' ').split('.')[0]);
      setIsBackupRunning(false);
      showToast("Enterprise database snapshot backed up successfully to secure cloud bucket.", "success");
    }, 1500);
  };

  const handleSavePolicy = (e) => {
    e.preventDefault();
    showToast("Password validation rules policy updated.", "success");
  };

  const auditColumns = [
    { header: "Timestamp", accessor: "timestamp" },
    { header: "User / Account", accessor: "user", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Operational Action", accessor: "action", render: (val) => <span className="text-xs text-slate-600 font-semibold">{val}</span> },
    { header: "Module Access", accessor: "module", render: (val) => <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase">{val}</span> },
    { header: "IP Address", accessor: "ip" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
        {val}
      </span>
    )}
  ];

  const sessionColumns = [
    { header: "User / Account", accessor: "user", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Logged Device / Browser", accessor: "device" },
    { header: "Session IP Address", accessor: "ip" },
    { header: "Login Time", accessor: "loginTime" },
    { header: "Auto-Expiry Time", accessor: "expireTime" },
    { header: "Revoke Credentials", accessor: "id", sortable: false, render: (val, row) => (
      <button 
        onClick={() => handleRevokeSession(val, row.user)}
        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-bold transition-colors"
      >
        Terminate Session
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Security & Governance</h1>
          <p className="text-sm text-slate-500">Configure login parameters, audit authentication logs, revoke user sessions, and maintain backups.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'audit' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Security Audit Trail
        </button>
        <button 
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'sessions' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Active Sessions ({sessions.length})
        </button>
        <button 
          onClick={() => setActiveTab('otp')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'otp' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          OTP Settings
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'password' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Password Policy
        </button>
        <button 
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'backup' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Backup & Disaster Recovery
        </button>
      </div>

      {/* Contents */}
      {activeTab === 'audit' && (
        <DataTable 
          columns={auditColumns} 
          data={logs} 
          searchKeys={["user", "action", "module"]}
          searchPlaceholder="Search system security logs..."
        />
      )}

      {activeTab === 'sessions' && (
        <DataTable 
          columns={sessionColumns} 
          data={sessions} 
          searchKeys={["user", "device"]}
          searchPlaceholder="Search active session tokens..."
        />
      )}

      {activeTab === 'otp' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Multi-Factor OTP Settings</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Enforce SMS/WhatsApp OTP verifications on login screens.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-brand-orange" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Enforce OTP verification globally</span>
                  <p className="text-[10px] text-slate-400">Forces all manager logins to prompt a secure 6-digit OTP code.</p>
                </div>
              </div>
              <button 
                onClick={() => setOtpEnabled(!otpEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${otpEnabled ? 'bg-brand-orange' : 'bg-slate-300'}`}
              >
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${otpEnabled ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OTP Timeout Window Expiry (Minutes)</label>
              <input 
                type="number" 
                value={otpExpiry} 
                onChange={(e) => setOtpExpiry(e.target.value)} 
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none" 
              />
            </div>

            <button 
              onClick={() => showToast("OTP security parameters saved.", "success")}
              className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-sm"
            >
              Save Configurations
            </button>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleSavePolicy} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Credential Expiry & Password Policies</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Define complexity configurations for admin profiles and managers logins.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Minimum Character Length</label>
              <input 
                type="number" 
                value={pwdPolicy.minLength}
                onChange={(e) => setPwdPolicy({ ...pwdPolicy, minLength: Number(e.target.value) })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max Login Lockout Attempts</label>
              <input 
                type="number" 
                value={pwdPolicy.maxAttempts}
                onChange={(e) => setPwdPolicy({ ...pwdPolicy, maxAttempts: Number(e.target.value) })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pwdPolicy.requireUpper} 
                onChange={() => setPwdPolicy({ ...pwdPolicy, requireUpper: !pwdPolicy.requireUpper })}
                className="w-4 h-4 rounded text-brand-orange border-slate-300"
              />
              <span>Require minimum 1 uppercase character</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pwdPolicy.requireNumbers} 
                onChange={() => setPwdPolicy({ ...pwdPolicy, requireNumbers: !pwdPolicy.requireNumbers })}
                className="w-4 h-4 rounded text-brand-orange border-slate-300"
              />
              <span>Require minimum 1 numeric digit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pwdPolicy.requireSpecial} 
                onChange={() => setPwdPolicy({ ...pwdPolicy, requireSpecial: !pwdPolicy.requireSpecial })}
                className="w-4 h-4 rounded text-brand-orange border-slate-300"
              />
              <span>Require minimum 1 special character (@, #, $, etc.)</span>
            </label>
          </div>

          <button 
            type="submit"
            className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-sm"
          >
            Apply Policy Settings
          </button>
        </form>
      )}

      {activeTab === 'backup' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Simulated Disaster Recovery Backups</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Take snapshot snapshots of active retailers databases, products matrix configurations, and financial billing ledgers.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Last System Backup</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5 font-display">{lastBackup}</p>
              </div>
              
              <button 
                onClick={handleRunBackup}
                disabled={isBackupRunning}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                <Database className={`w-4 h-4 ${isBackupRunning ? 'animate-spin' : ''}`} />
                <span>{isBackupRunning ? 'Backing Up...' : 'Backup Database Now'}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2 text-xs text-slate-600">
              <span className="font-bold text-slate-700 flex items-center gap-1"><HelpCircle className="w-4 h-4 text-slate-400" /> Restoration Policy</span>
              <p>In the event of physical host failures, restoration procedures propagate standard recovery images instantly from secure buckets. Contact corporate support desks to schedule recoveries.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
