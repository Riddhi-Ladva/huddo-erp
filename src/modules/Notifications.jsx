import React, { useState } from 'react';
import { Bell, Send, Mail, MessageSquare, PhoneCall, Plus, Edit3, Trash2, Eye, Code } from 'lucide-react';
import { initialNotifications, communicationTemplates, STANDARD_ROLES } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function Notifications({ showToast }) {
  const [activeTab, setActiveTab] = useState('center'); // center | templates
  const [notifications, setNotifications] = useState(initialNotifications);
  const [templates, setTemplates] = useState(communicationTemplates);

  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Compose state
  const [composeData, setComposeData] = useState({
    title: '',
    message: '',
    type: 'Announcement',
    audience: 'All',
    channels: { email: true, sms: false, whatsapp: true, inapp: true }
  });

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!composeData.title || !composeData.message) {
      showToast("Please enter title and message text.", "error");
      return;
    }

    const selectedChannels = Object.entries(composeData.channels)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name.toUpperCase());

    const newN = {
      id: `N${notifications.length + 1}`,
      title: composeData.title,
      message: composeData.message,
      type: composeData.type,
      audience: composeData.audience,
      channels: selectedChannels,
      date: new Date().toISOString().split('T')[0]
    };

    setNotifications([newN, ...notifications]);
    setIsComposeOpen(false);
    setComposeData({
      title: '',
      message: '',
      type: 'Announcement',
      audience: 'All',
      channels: { email: true, sms: false, whatsapp: true, inapp: true }
    });
    showToast(`Broadcast "${newN.title}" dispatched across target channels.`, "success");
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    ));
    setIsEditTemplateOpen(false);
    setEditingTemplate(null);
    showToast(`Communication template "${editingTemplate.name}" updated.`, "success");
  };

  const columns = [
    { header: "Dispatched Date", accessor: "date" },
    { header: "Title Header", accessor: "title", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Message Body", accessor: "message", render: (val) => <span className="text-xs text-slate-500 font-semibold">{val}</span> },
    { header: "Type", accessor: "type", render: (val) => <span className="px-2 py-0.5 bg-orange-50 text-brand-orange border border-orange-100 rounded text-[9px] font-bold uppercase">{val}</span> },
    { header: "Target Audience", accessor: "audience" },
    { header: "Broadcast Channels", accessor: "channels", render: (val) => (
      <div className="flex gap-1.5 text-[10px] font-bold text-slate-500">
        {val.map(ch => <span key={ch} className="bg-slate-100 px-1.5 py-0.5 rounded uppercase">{ch}</span>)}
      </div>
    )}
  ];

  const templateColumns = [
    { header: "Event Trigger ID", accessor: "event", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Template Label", accessor: "name" },
    { header: "Channels Mapping", accessor: "channel" },
    { header: "Message Format", accessor: "text", render: (val) => <code className="text-[11px] bg-slate-50 p-1 rounded border border-slate-100 font-mono text-slate-600 block max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">{val}</code> },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <button 
        onClick={() => { setEditingTemplate(row); setIsEditTemplateOpen(true); }}
        className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit Template</span>
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Communication Console</h1>
          <p className="text-sm text-slate-500">Compose global announcements, target role-based cohorts, and customize transactional email/whatsapp templates.</p>
        </div>
        {activeTab === 'center' && (
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Broadcast</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('center')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'center' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Notification Center ({notifications.length})
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'templates' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Communication Templates ({templates.length})
        </button>
      </div>

      {/* Contents */}
      {activeTab === 'center' ? (
        <DataTable 
          columns={columns} 
          data={notifications} 
          searchKeys={["title", "message", "type"]}
          searchPlaceholder="Search sent broadcasts history..."
        />
      ) : (
        <DataTable 
          columns={templateColumns} 
          data={templates} 
          searchKeys={["event", "name", "text"]}
          searchPlaceholder="Search system templates..."
        />
      )}

      {/* Compose Notification Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose System Broadcast"
        onConfirm={handleComposeSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Broadcast Title *</label>
            <input 
              type="text" 
              placeholder="e.g., Target Period Extension Alert" 
              value={composeData.title}
              onChange={(e) => setComposeData({ ...composeData, title: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alert Category</label>
              <select 
                value={composeData.type}
                onChange={(e) => setComposeData({ ...composeData, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="Announcement">Announcement</option>
                <option value="Order">Order Alert</option>
                <option value="Target">Target Alert</option>
                <option value="Commission">Commission Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Audience Cohort</label>
              <select 
                value={composeData.audience}
                onChange={(e) => setComposeData({ ...composeData, audience: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="All">All Roles</option>
                {STANDARD_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dispersal Channels</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Object.keys(composeData.channels).map(ch => (
                <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={composeData.channels[ch]} 
                    onChange={() => setComposeData({
                      ...composeData,
                      channels: { ...composeData.channels, [ch]: !composeData.channels[ch] }
                    })}
                    className="w-4 h-4 rounded text-brand-orange border-slate-300"
                  />
                  <span className="uppercase">{ch}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Content Format *</label>
            <textarea 
              rows="3" 
              placeholder="Type your message text here..." 
              value={composeData.message}
              onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Edit Template Modal */}
      {isEditTemplateOpen && editingTemplate && (
        <Modal
          isOpen={isEditTemplateOpen}
          onClose={() => { setIsEditTemplateOpen(false); setEditingTemplate(null); }}
          title={`Edit Template: ${editingTemplate.event}`}
          onConfirm={handleSaveTemplate}
        >
          <form className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1"><Code className="w-3.5 h-3.5 text-brand-orange" /> Placeholder Variables:</span>
              <p>Place variables inside format braces to map dynamic database triggers: `{'{name}'}` (Shop Owner), `{'{order_id}'}`, `{'{amount}'}`, `{'{percent}'}`</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Format Text</label>
              <textarea 
                rows="4" 
                value={editingTemplate.text}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, text: e.target.value })}
                className="w-full text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
