import React, { useState } from 'react';
import { 
  Award, Star, FileText, CheckCircle2, SlidersHorizontal, Edit2
} from 'lucide-react';
import { mockReviews as initialReviews } from '../mockData/mockReviews';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function PerformanceReviews({ showToast }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Form modal states
  const [selectedReview, setSelectedReview] = useState(null);
  const [starPunctuality, setStarPunctuality] = useState(5);
  const [starAchievement, setStarAchievement] = useState(5);
  const [starCollaboration, setStarCollaboration] = useState(5);
  const [starCommunication, setStarCommunication] = useState(5);
  const [reviewComments, setReviewComments] = useState("");

  const filteredReviews = React.useMemo(() => {
    if (filterStatus === "All") return reviews;
    return reviews.filter(r => r.status === filterStatus);
  }, [reviews, filterStatus]);

  const handleOpenForm = (review) => {
    setSelectedReview(review);
    if (review.rating) {
      setStarPunctuality(review.rating.punctuality);
      setStarAchievement(review.rating.targetAchievement);
      setStarCollaboration(review.rating.teamCollaboration);
      setStarCommunication(review.rating.communication);
      setReviewComments(review.comments);
    } else {
      setStarPunctuality(5);
      setStarAchievement(5);
      setStarCollaboration(5);
      setStarCommunication(5);
      setReviewComments("");
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewComments.trim()) {
      showToast("Please provide manager appraisal comments.", "error");
      return;
    }

    setReviews(prev => prev.map(r => 
      r.id === selectedReview.id 
        ? {
            ...r,
            status: "Completed",
            rating: {
              punctuality: starPunctuality,
              targetAchievement: starAchievement,
              teamCollaboration: starCollaboration,
              communication: starCommunication
            },
            comments: reviewComments
          }
        : r
    ));

    showToast(`Appraisal completed and saved for ${selectedReview.name}.`, "success");
    setSelectedReview(null);
  };

  const renderStarsSelector = (label, currentVal, setVal, readOnly = false) => {
    return (
      <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-b-0 text-xs">
        <span className="text-slate-400 font-semibold">{label}:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => setVal(star)}
              className={`p-0.5 rounded focus:outline-none transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-slate-100'}`}
            >
              <Star className={`w-4 h-4 ${star <= currentVal ? 'fill-amber-400 text-amber-450' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const columns = [
    { header: "Emp ID", accessor: "employeeId" },
    { header: "Employee Name", accessor: "name", render: (val) => <span className="font-bold text-slate-805">{val}</span> },
    { header: "Department", accessor: "department" },
    { 
      header: "Average Rating", 
      accessor: "rating",
      render: (val) => {
        if (!val) return <span className="text-slate-400 italic text-[11px]">Not Rated</span>;
        const avg = ((val.punctuality + val.targetAchievement + val.teamCollaboration + val.communication) / 4).toFixed(1);
        return (
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-slate-800">{avg} / 5.0</span>
          </div>
        );
      }
    },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        <button
          onClick={() => handleOpenForm(row)}
          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
            row.status === 'Completed' 
              ? 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100' 
              : 'bg-brand-orange border-brand-orange text-white hover:bg-brand-orange-hover'
          }`}
        >
          {row.status === 'Completed' ? (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>Review Details</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Appraise</span>
            </>
          )}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top dashboard control headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Performance Reviews</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Evaluate employee performance parameters and submit star ratings.</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Filter Review Status:</span>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        <div className="text-[10px] text-slate-400 font-bold">
          Found {filteredReviews.length} records matching parameters
        </div>
      </div>

      {/* Roster database table */}
      <CustomDataTable 
        columns={columns}
        data={filteredReviews}
        searchKeys={["employeeId", "name", "department", "status"]}
        searchPlaceholder="Search performance reviews..."
      />

      {/* Form Wizard Modal */}
      {selectedReview && (
        <CustomModal
          isOpen={selectedReview !== null}
          onClose={() => setSelectedReview(null)}
          title={selectedReview.status === 'Completed' ? `Performance Appraisal: ${selectedReview.name}` : `Appraise Employee: ${selectedReview.name}`}
          confirmText={selectedReview.status === 'Completed' ? undefined : "Submit Appraisal Rating"}
          onConfirm={selectedReview.status === 'Completed' ? undefined : handleReviewSubmit}
        >
          <div className="space-y-5">
            
            {/* Meta info header */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
              <div>
                <span>Employee ID / Name</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedReview.name} ({selectedReview.employeeId})</p>
              </div>
              <div>
                <span>Department / Role</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedReview.department}</p>
              </div>
            </div>

            {/* Stars rating grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="block text-[10px] font-bold tracking-wider text-slate-450 uppercase mb-2">KPI Stars Ratings Evaluation</span>
              {renderStarsSelector("Punctuality & Presence", starPunctuality, setStarPunctuality, selectedReview.status === 'Completed')}
              {renderStarsSelector("Target & Goal Achievements", starAchievement, setStarAchievement, selectedReview.status === 'Completed')}
              {renderStarsSelector("Team Collaboration & Assist", starCollaboration, setStarCollaboration, selectedReview.status === 'Completed')}
              {renderStarsSelector("Communication & Reports", starCommunication, setStarCommunication, selectedReview.status === 'Completed')}
            </div>

            {/* Appraisal Comments */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Manager Appraisal Comments *</label>
              {selectedReview.status === 'Completed' ? (
                <p className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-650 font-semibold leading-relaxed">
                  {selectedReview.comments}
                </p>
              ) : (
                <textarea
                  rows="3"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Provide manager appraisal notes detailing highlights and growth gaps..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
                />
              )}
            </div>

          </div>
        </CustomModal>
      )}

    </div>
  );
}
