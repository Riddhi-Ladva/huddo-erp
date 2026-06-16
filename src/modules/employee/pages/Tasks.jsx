import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Clock, CheckCircle2, 
  AlertCircle, SlidersHorizontal, Play, Check
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function Tasks({ showToast }) {
  const [tasks, setTasks] = useState([
    { id: "TSK-001", title: "Compile Q2 Marketing Analytics Sheets", dueDate: "2026-06-18", priority: "High", status: "In Progress", notes: "Analyze click-through rates and ROI across Facebook ads campaign." },
    { id: "TSK-002", title: "Review Summer Catalog print mockups", dueDate: "2026-06-20", priority: "Medium", status: "Not Started", notes: "Verify color compliance with branding guideline docs." },
    { id: "TSK-003", title: "Schedule onboarding check-ins with new interns", dueDate: "2026-06-15", priority: "Low", status: "Completed", notes: "Introductory session completed on June 15." }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !dueDate) {
      showToast("Please fill all required task fields.", "error");
      return;
    }

    const newTask = {
      id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
      title: taskTitle,
      dueDate,
      priority,
      status: "Not Started",
      notes
    };

    setTasks([...tasks, newTask]);
    setIsAddOpen(false);
    setTaskTitle("");
    setDueDate("");
    setPriority("Medium");
    setNotes("");
    showToast(`Task ${newTask.id} successfully created.`, "success");
  };

  const handleUpdateStatus = (taskId, nextStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: nextStatus } : t
    ));
    showToast(`Task ${taskId} status changed to ${nextStatus}.`, "success");
  };

  const columns = [
    { header: "Task ID", accessor: "id" },
    { header: "Task Title", accessor: "title", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Due Date", accessor: "dueDate" },
    { header: "Priority", accessor: "priority", render: (val) => <StatusBadge status={val === 'High' ? 'Critical' : (val === 'Medium' ? 'Low Stock' : 'Draft')} /> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Action", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        <div className="flex gap-2">
          {row.status === 'Not Started' && (
            <button 
              onClick={() => handleUpdateStatus(val, "In Progress")}
              className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded border border-indigo-200 bg-indigo-50 text-indigo-750 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Start</span>
            </button>
          )}
          {row.status === 'In Progress' && (
            <button 
              onClick={() => handleUpdateStatus(val, "Completed")}
              className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Complete</span>
            </button>
          )}
          {row.status === 'Completed' && (
            <span className="text-[10px] text-slate-400 font-bold italic">Done</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">My Action Tasks</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track your pending milestones, duties, and progress cards.</p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task Item</span>
        </button>
      </div>

      {/* Roster list table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-slate-450" />
          Active tasks register
        </h3>

        <CustomDataTable 
          columns={columns}
          data={tasks}
          searchKeys={["id", "title", "status", "priority"]}
          searchPlaceholder="Search my tasks..."
        />
      </div>

      {/* Add Task Modal Form */}
      <CustomModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Task Item Form"
        confirmText="Create Task"
        onConfirm={handleCreateTask}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Task Title *</label>
            <input 
              type="text" 
              placeholder="e.g. Compile Analytics Sheets" 
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Due Date *</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description / Notes</label>
            <textarea 
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide comments or details for task completion..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
