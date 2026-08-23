import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RotateCcw, Share2, FileText, Save, Check } from "lucide-react";

export function SectionActionBar({ onReset, onSave, sectionKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedToast, setSavedToast] = useState(false);

  const key = sectionKey || location.pathname.replace("/", "") || "dashboard";

  const handleSaveClick = () => {
    if (onSave) onSave();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handlePdfClick = () => {
    navigate(`/pdf-report?section=${key}`);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: "TOUCHES Footballer Athletics",
        text: `Check out my match stats and session report on TOUCHES!`,
        url: window.location.href,
      }).catch((e) => console.log("Share canceled", e));
    } else {
      navigate(`/pdf-report?section=${key}&action=share`);
    }
  };

  return (
    <div className="pt-2 pb-1 border-t border-white/10 space-y-1.5">
      {savedToast && (
        <div className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider text-center animate-bounce shadow-md flex items-center justify-center gap-1">
          <Check size={12} />
          <span>Session Saved!</span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-1.5">
        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="py-1.5 px-2 rounded-lg bg-[#141720] border border-white/15 text-white/80 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95"
        >
          <RotateCcw size={12} />
          <span>RESET</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShareClick}
          className="py-1.5 px-2 rounded-lg bg-[#141720] border border-white/15 text-white/80 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95"
        >
          <Share2 size={12} />
          <span>SHARE</span>
        </button>

        {/* PDF */}
        <button
          type="button"
          onClick={handlePdfClick}
          className="py-1.5 px-2 rounded-lg bg-[#141720] border border-white/15 text-white/80 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95"
        >
          <FileText size={12} />
          <span>PDF</span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={handleSaveClick}
          className="py-1.5 px-2 rounded-lg bg-[#FF4422] text-white shadow-md shadow-[#FF4422]/20 hover:bg-[#E03311] transition-all font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95"
        >
          <Save size={12} />
          <span>SAVE</span>
        </button>
      </div>
    </div>
  );
}
