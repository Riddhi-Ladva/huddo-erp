import React, { useState } from 'react';
import { Users, User, Plus, Award, Layout, Briefcase, FileText, ChevronRight, X } from 'lucide-react';
import { initialTeams } from '../mockData';
import { Modal } from '../components/Common';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Teams({ showToast }) {
  const [teams, setTeams] = useState(initialTeams);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState(null);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [dept, setDept] = useState('Sales');
  const [leader, setLeader] = useState('Sanjay Joshi');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [responsibilities, setResponsibilities] = useState('');

  // Sample Member pool for team creation multi-select
  const membersPool = ["Amit Kumar", "Karan Johar", "Sunita Rao", "Kiran Gowda", "Arjun Dev", "Rahul Shinde"];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !responsibilities) {
      showToast("Please enter team name and responsibilities.", "error");
      return;
    }
    const newTeam = {
      id: `T${teams.length + 1}`,
      name: teamName,
      department: dept,
      leader: leader,
      memberCount: selectedMembers.length || 3,
      performance: 85,
      responsibilities: responsibilities
    };

    setTeams([...teams, newTeam]);
    setIsCreateOpen(false);
    setTeamName('');
    setResponsibilities('');
    setSelectedMembers([]);
    showToast(`Team "${newTeam.name}" created successfully.`, "success");
  };

  const handleToggleMember = (name) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter(m => m !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  // Mock Performance Data for Detail Chart
  const mockTeamPerformanceData = [
    { month: 'Jan', target: 1200000, achieved: 1050000 },
    { month: 'Feb', target: 1200000, achieved: 1280000 },
    { month: 'Mar', target: 1500000, achieved: 1450000 },
    { month: 'Apr', target: 1500000, achieved: 1600000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Team Management</h1>
          <p className="text-sm text-slate-500">Form and audit cross-departmental operations teams, track joint performance scores, and inspect targets.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Operations Team</span>
        </button>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map(team => (
          <div 
            key={team.id}
            onClick={() => setViewingTeam(team)}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-brand-orange cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-orange-50 text-brand-orange text-[10px] font-bold border border-orange-200 rounded-full">{team.department}</span>
                <span className="text-xs font-bold text-emerald-600">KPI: {team.performance}%</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display mb-1">{team.name}</h3>
              <p className="text-xs text-slate-400 font-semibold mb-4 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Leader: {team.leader}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{team.responsibilities}</p>
            </div>
            
            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {team.memberCount} Members</span>
              <span className="text-brand-orange font-bold hover:underline flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Operations Team"
        onConfirm={handleCreateSubmit}
      >
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Name</label>
            <input 
              type="text" 
              placeholder="e.g., Gujarat Gladiators"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department Type</label>
              <select 
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Marketing">Marketing</option>
                <option value="Inventory">Inventory</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Promoter">Promoter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Leader</label>
              <select 
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="Sanjay Joshi">Sanjay Joshi</option>
                <option value="Nikhil Gowda">Nikhil Gowda</option>
                <option value="Vikram Malhotra">Vikram Malhotra</option>
                <option value="Sunil Mehta">Sunil Mehta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Add Members</label>
            <div className="flex flex-wrap gap-2 border border-slate-200 rounded-lg p-2 bg-slate-50/50 max-h-32 overflow-y-auto">
              {membersPool.map(m => {
                const isSelected = selectedMembers.includes(m);
                return (
                  <button 
                    key={m}
                    type="button"
                    onClick={() => handleToggleMember(m)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                      isSelected 
                        ? 'bg-orange-50 border-brand-orange text-brand-orange font-semibold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Responsibilities & Target Goals</label>
            <textarea 
              rows="3" 
              placeholder="e.g., Focus on retail expansion targets across western region zones..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Team Details Slide drawer */}
      {viewingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="px-2 py-0.5 bg-orange-50 text-brand-orange text-[9px] font-bold border border-orange-200 rounded-full">{viewingTeam.department}</span>
                <h3 className="text-lg font-bold text-slate-900 font-display mt-1">{viewingTeam.name}</h3>
                <p className="text-xs text-slate-500">Leader: {viewingTeam.leader}</p>
              </div>
              <button 
                onClick={() => setViewingTeam(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content info */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Core KPIs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Performance Score</span>
                  <p className="text-lg font-bold text-brand-orange font-display mt-1">{viewingTeam.performance}%</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</span>
                  <p className="text-lg font-bold text-slate-800 font-display mt-1">{viewingTeam.memberCount}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Targets</span>
                  <p className="text-lg font-bold text-emerald-600 font-display mt-1">₹15 L</p>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Key Accountabilities</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{viewingTeam.responsibilities}</p>
              </div>

              {/* Performance Chart */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Quarter Target Achievement Comparison</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTeamPerformanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" fontSize={10} stroke="#94a3b8" />
                      <YAxis fontSize={10} stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="achieved" stroke="#f97316" fillOpacity={1} fill="url(#colorAchieved)" name="Achieved (₹)" strokeWidth={2} />
                      <Area type="monotone" dataKey="target" stroke="#cbd5e1" fill="none" name="Target (₹)" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Member lists */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Team Members pool Roster</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Role</th>
                        <th className="px-4 py-2.5 text-right font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-slate-800">{viewingTeam.leader}</td>
                        <td className="px-4 py-2.5 text-slate-400">Team Leader</td>
                        <td className="px-4 py-2.5 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">Active</span></td>
                      </tr>
                      {membersPool.slice(0, viewingTeam.memberCount - 1).map((m, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{m}</td>
                          <td className="px-4 py-2.5 text-slate-400">Executive Rep</td>
                          <td className="px-4 py-2.5 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
