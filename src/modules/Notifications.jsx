import React, { useState, useEffect } from 'react';
import { Bell, Send, Mail, MessageSquare, PhoneCall, Plus, Edit3, Trash2, Eye, Code } from 'lucide-react';
import { DataTable, Modal } from '../components/Common';

export default function Notifications({ showToast }) {
  const [activeTab, setActiveTab] = useState('center'); // center | templates
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [roles, setRoles] = useState([]);

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

  const loadNotificationsData = () => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setNotifications(resData.data.map(n => ({
            id: n._id,
            title: n.title,
            message: n.message,
            type: n.category || 'Announcement',
            audience: n.recipientRole || 'All',
            channels: n.channels || ['INAPP'],
            date: n.createdAt ? new Date(n.createdAt).toISOString().split('T')[0] : '2026-06-11'
          })));
        }
      })
      .catch(err => console.error("Error loading notifications:", err));

    fetch('/api/communication-settings/templates')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setTemplates(resData.data.map(t => ({
            id: t._id,
            event: t.event_trigger || t.name,
            name: t.name,
            channel: t.channels?.join('/') || 'Email/SMS',
            text: t.template_body || t.text
          })));
        }
      })
      .catch(err => console.warn("Templates endpoint restricted or down:", err));

    fetch('/api/roles')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setRoles(resData.data.map(r => r.name));
        }
      })
      .catch(err => console.error("Error loading roles:", err));
  };

  useEffect(() => {
    loadNotificationsData();
  }, []);

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!composeData.title || !composeData.message) {
      showToast("Please enter title and message text.", "error");
      return;
    }

    const selectedChannels = Object.entries(composeData.channels)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name.toUpperCase());

    const payload = {
      title: composeData.title,
      message: composeData.message,
      category: composeData.type,
      recipientRole: composeData.audience,
      channels: selectedChannels
    };

    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          showToast(`Broadcast "${composeData.title}" dispatched across target channels.`, "success");
          setIsComposeOpen(false);
          setComposeData({
            title: '',
            message: '',
            type: 'Announcement',
            audience: 'All',
            channels: { email: true, sms: false, whatsapp: true, inapp: true }
          });
          loadNotificationsData();
        } else {
          showToast(resData.message || "Failed to send notification.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to server.", "error");
      });
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    const payload = {
      name: editingTemplate.name,
      template_body: editingTemplate.text,
      channels: editingTemplate.channel.split('/')
    };

    fetch(`/api/communication-settings/templates/${editingTemplate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          showToast(`Communication template "${editingTemplate.name}" updated successfully.`, "success");
          setIsEditTemplateOpen(false);
          setEditingTemplate(null);
          loadNotificationsData();
        } else {
          showToast(resData.message || "Failed to update template.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to server.", "error");
      });
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
          <h1 className="text-2xl font-bold text-slate-900 font-display">Communication & Dispatch Center</h1>
          <p className="text-sm text-slate-500">Dispatch system announcements, broadcast WhatsApp/SMS payloads, and edit notification templates.</p>
        </div>
        
        <button 
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Broadcast</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => setActiveTab('center')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'center' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Broadcast Logs ({notifications.length})
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'templates' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Notification Templates ({templates.length})
        </button>
      </div>

      {/* Center Tab */}
      {activeTab === 'center' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <DataTable 
            columns={columns} 
            data={notifications} 
            searchKeys={["title", "message", "audience"]}
            searchPlaceholder="Search system broadcasts..."
          />
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {templates.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No templates available or permission denied. Templates are restricted to Founder roles.
            </div>
          ) : (
            <DataTable 
              columns={templateColumns} 
              data={templates} 
              searchKeys={["name", "event", "text"]}
              searchPlaceholder="Search message templates..."
            />
          )}
        </div>
      )}

      {/* Compose Broadcast Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose New Broadcast payload"
        onConfirm={handleComposeSubmit}
      >
        <form className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Broadcast Type</label>
              <select 
                value={composeData.type}
                onChange={(e) => setComposeData({...composeData, type: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="Announcement">Announcement</option>
                <option value="Order">Order Alert</option>
                <option value="Target">Target Alert</option>
                <option value="Commission">Commission Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Audience</label>
              <select 
                value={composeData.audience}
                onChange={(e) => setComposeData({...composeData, audience: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="All">All Audiences</option>
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payload Title Header</label>
            <input 
              type="text" 
              placeholder="e.g., Target Period Closing soon"
              value={composeData.title}
              onChange={(e) => setComposeData({...composeData, title: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Body text</label>
            <textarea 
              rows="4" 
              placeholder="Write message details..."
              value={composeData.message}
              onChange={(e) => setComposeData({...composeData, message: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Disseminate Channels</label>
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-600">
              <label className="flex items-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={composeData.channels.email}
                  onChange={() => setComposeData({
                    ...composeData,
                    channels: { ...composeData.channels, email: !composeData.channels.email }
                  })}
                  className="rounded text-brand-orange border-slate-300"
                />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={composeData.channels.sms}
                  onChange={() => setComposeData({
                    ...composeData,
                    channels: { ...composeData.channels, sms: !composeData.channels.sms }
                  })}
                  className="rounded text-brand-orange border-slate-300"
                />
                <span>SMS</span>
              </label>
              <label className="flex items-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={composeData.channels.whatsapp}
                  onChange={() => setComposeData({
                    ...composeData,
                    channels: { ...composeData.channels, whatsapp: !composeData.channels.whatsapp }
                  })}
                  className="rounded text-brand-orange border-slate-300"
                />
                <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={composeData.channels.inapp}
                  onChange={() => setComposeData({
                    ...composeData,
                    channels: { ...composeData.channels, inapp: !composeData.channels.inapp }
                  })}
                  className="rounded text-brand-orange border-slate-300"
                />
                <span>In-App</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={isEditTemplateOpen}
        onClose={() => setIsEditTemplateOpen(false)}
        title={`Edit Template: ${editingTemplate?.name}`}
        onConfirm={handleSaveTemplate}
      >
        {editingTemplate && (
          <form className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Label</label>
              <input 
                type="text" 
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Channels mapping</label>
              <input 
                type="text" 
                value={editingTemplate.channel}
                onChange={(e) => setEditingTemplate({...editingTemplate, channel: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Format</label>
              <textarea 
                rows="4" 
                value={editingTemplate.text}
                onChange={(e) => setEditingTemplate({...editingTemplate, text: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
