import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionActionBar } from "../ui/SectionActionBar";
import {
  MessageSquare,
  Home,
  Pointer,
  BarChart3,
  Settings,
  Save,
  RotateCcw,
  Share2,
  Download,
  Loader2,
} from "lucide-react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { db } from "../../lib/db";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ShareModal } from "./ShareModal";
import { useNavigate, useLocation } from "react-router-dom";

const WELL_DONE_TAGS = [
  "ATTACKING",
  "FINISHING",
  "DEFENDING",
  "TACKLING",
  "LONG BALLS",
  "TRAPPING",
  "TRANSITION",
  "FREE KICKS",
  "MARKING",
  "SPEED",
  "PENALTIES",
  "ENDURANCE",
  "CORNERS",
  "PASSING",
  "LEADERSHIP",
  "DECISIONS",
  "SUPPORT",
  "CREATE SPACE",
  "BALL CONTROL",
  "THROW-IN",
  "HEADING",
];

const PERFORMANCE_METRICS = [
  "ENDURANCE",
  "ENERGY",
  "DECISION MAKING",
  "CONFIDENCE",
  "MOTIVATION",
  "ENJOYMENT",
  "FOCUS",
  "PERFORMANCE",
  "FIRST TOUCH",
  "PASSING",
  "RECEIVING",
  "WILL",
  "FITNESS",
  "FUN",
  "WILL TO WIN",
  "TEAM PLAYER",
];

// Loading Overlay Component
function LoadingOverlay({ progress }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-football-card rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[var(--color-accent)] animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-black uppercase text-football-text mb-2">
              Generating PDF Report
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait...
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlayerReflection({ isPdf, pdfPart }) {
  const { sessionId, reflection, updateReflection } = useActiveSession();

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerReflection");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {
      wellDoneTags: [],
      playerName: "",
      playerAge: "",
      achievedGoal: "",
      whatLearned: "",
      whatWouldChange: "",
      detailedPerformance: {},
    };
  });

  useEffect(() => {
    localStorage.setItem("playerReflection", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (reflection) {
      const newData = {
        wellDoneTags: reflection.wellDoneTags || [],
        playerName: reflection.playerName || "",
        playerAge: reflection.playerAge || "",
        achievedGoal: reflection.achievedGoal || "",
        whatLearned: reflection.whatLearned || "",
        whatWouldChange: reflection.whatWouldChange || "",
        detailedPerformance: reflection.detailedPerformance || {},
      };

      const hasDbData =
        newData.wellDoneTags.length > 0 ||
        newData.playerName ||
        newData.playerAge ||
        newData.achievedGoal ||
        newData.whatLearned ||
        newData.whatWouldChange ||
        Object.keys(newData.detailedPerformance).length > 0;

      if (hasDbData && JSON.stringify(formData) !== JSON.stringify(newData)) {
        setFormData(newData);
      }
    }
  }, [reflection]);

  const handleTagToggle = async (tag) => {
    const currentTags = formData.wellDoneTags;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    setFormData((prev) => ({ ...prev, wellDoneTags: newTags }));
    await updateReflection({ wellDoneTags: newTags });
  };

  const handleTextChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    await updateReflection({ [id]: value });
  };

  const handleMetricChange = async (metric, value) => {
    const newMetrics = {
      ...formData.detailedPerformance,
      [metric]: parseInt(value),
    };
    setFormData((prev) => ({ ...prev, detailedPerformance: newMetrics }));
    await updateReflection({ detailedPerformance: newMetrics });
  };

  let metricsToRender = PERFORMANCE_METRICS;
  if (isPdf) {
    if (pdfPart === 2) metricsToRender = metricsToRender.slice(0, 8);
    else if (pdfPart === 3) metricsToRender = metricsToRender.slice(8);
  }

  return (
    <div className="space-y-4 pb-4 select-none">
      {(!isPdf || !pdfPart || pdfPart === 1) && (
        <>
          {/* Section Header */}
          <div className="flex items-center justify-between py-1">
            <h2 className="text-xl font-black uppercase text-[#FF4422] tracking-wider text-glow">
              PLAYER REFLECTION
            </h2>
            <span className="text-[10px] font-bold text-white/50 tracking-wider">
              POST-MATCH REVIEW
            </span>
          </div>

          {/* Player Info Inputs */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl border border-white/10 bg-[#12151D]">
            <div>
              <label htmlFor="playerName" className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
                PLAYER NAME
              </label>
              <input
                id="playerName"
                type="text"
                placeholder="Player name"
                value={formData.playerName}
                onChange={handleTextChange}
                className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
              />
            </div>

            <div>
              <label htmlFor="playerAge" className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
                AGE
              </label>
              <input
                id="playerAge"
                type="number"
                placeholder="Age"
                value={formData.playerAge}
                onChange={handleTextChange}
                className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
              />
            </div>
          </div>

          {/* WHAT DID YOU DO WELL? Tag Chips */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-1">
              WHAT DID YOU DO WELL?
            </h3>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-white/10 bg-[#12151D]">
              {WELL_DONE_TAGS.map((tag) => {
                const isSelected = formData.wellDoneTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "bg-[#FF4422] text-white border border-[#FF4422] shadow-md shadow-[#FF4422]/25 scale-[1.02]"
                        : "bg-black/30 text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Textareas */}
          <div className="space-y-3 pt-1">
            <div>
              <label htmlFor="achievedGoal" className="block text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
                DID YOU ACHIEVE YOUR GOAL?
              </label>
              <textarea
                id="achievedGoal"
                rows={2}
                placeholder="Describe your match goal and outcome..."
                value={formData.achievedGoal}
                onChange={handleTextChange}
                className="w-full bg-[#12151D] text-white px-3.5 py-2.5 text-xs font-medium rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422] resize-none"
              />
            </div>

            <div>
              <label htmlFor="whatLearned" className="block text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
                WHAT DID YOU LEARN?
              </label>
              <textarea
                id="whatLearned"
                rows={2}
                placeholder="Your key takeaway from today..."
                value={formData.whatLearned}
                onChange={handleTextChange}
                className="w-full bg-[#12151D] text-white px-3.5 py-2.5 text-xs font-medium rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422] resize-none"
              />
            </div>

            <div>
              <label htmlFor="whatWouldChange" className="block text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
                WHAT WOULD YOU CHANGE?
              </label>
              <textarea
                id="whatWouldChange"
                rows={2}
                placeholder="Be honest with yourself..."
                value={formData.whatWouldChange}
                onChange={handleTextChange}
                className="w-full bg-[#12151D] text-white px-3.5 py-2.5 text-xs font-medium rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422] resize-none"
              />
            </div>
          </div>
        </>
      )}

      {/* Performance Sliders */}
      {(!isPdf || !pdfPart || pdfPart === 2 || pdfPart === 3) && (
        <div className="space-y-2 pt-2">
          {(!isPdf || !pdfPart || pdfPart === 2) && (
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-1">
              GAME PERFORMANCE RATING (1–10)
            </h3>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl border border-white/10 bg-[#12151D]">
            {metricsToRender.map((metric) => {
              const value = Number(formData.detailedPerformance[metric] || 7);
              const percent = ((value - 1) / 9) * 100;

              return (
                <div key={metric} className="p-2 rounded-xl bg-black/25 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
                    <span className="text-white/80">{metric}</span>
                    <span className="text-[#FF4422] font-black">{value}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleMetricChange(metric, e.target.value)}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-[#FF4422]"
                    style={{
                      background: `linear-gradient(to right, #FF4422 0%, #FF4422 ${percent}%, rgba(255,255,255,0.15) ${percent}%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={() => {
          if (confirm("Reset Reflection data?")) {
            localStorage.removeItem("playerReflection");
            window.location.reload();
          }
        }}
        sectionKey="reflection"
      />

    </div>
  );
}

// Map route paths to human-readable page names
const ROUTE_PAGE_NAMES = {
  "/register": "Register",
  "/stats": "Player Stats",
  "/touch-counter": "Touch Counter",
  "/reflection": "Player Reflection",
  "/evaluation": "Player Evaluation",
  "/roster": "Roster",
  "/lineup": "Starting Lineup",
  "/note-to-coach": "Note to Coach",
};

export function BottomBar() {
  const { sessionId } = useActiveSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfChoiceModal, setPdfChoiceModal] = useState({
    open: false,
    action: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [isLightTheme, setIsLightTheme] = useState(
    document.documentElement.classList.contains("theme-light"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightTheme(
        document.documentElement.classList.contains("theme-light"),
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure you want to reset this session? This will delete all touches and reflections and start a fresh match.",
      )
    ) {
      try {
        // Clear session data in DB if session exists
        if (sessionId) {
          // Delete the session entirely so a fresh one is created on reload
          await db.sessions.delete(sessionId);

          // Delete related data
          await db.touches.where("sessionId").equals(sessionId).delete();
          await db.reflections.where("sessionId").equals(sessionId).delete();
        }

        // Clear localStorage (ALWAYS do this, even if no session ID)
        localStorage.removeItem("playerReflection");
        localStorage.removeItem("playerProfile");
        localStorage.removeItem("footballFormation");
        localStorage.removeItem("playerAttendance");
        localStorage.removeItem("playerEvaluation");
        localStorage.removeItem("playerEvaluationBy");
        localStorage.removeItem("noteToCoach");

        // Small delay to ensure DB ops are committed and UI has resolved
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error resetting session:", error);
        alert("Error resetting session: " + error.message);
      }
    }
  };

  const handleDownloadPDF = () => {
    setPdfChoiceModal({ open: true, action: "download" });
  };

  const handleSave = async () => {
    alert("Session saved successfully!");
  };

  const shareUrl = `${window.location.origin}/session/${sessionId}`;
  const shareTitle = "Check out my football performance report!";
  const shareText = `I just completed my football training session. Check out my performance metrics and reflections!`;

  // const handleNativeShare = async () => {
  //     if (navigator.share) {
  //         try {
  //             await navigator.share({
  //                 title: shareTitle,
  //                 text: shareText,
  //                 url: shareUrl,
  //             });
  //         } catch (error) {
  //             if (error.name !== 'AbortError') {
  //                 console.error('Error sharing:', error);
  //             }
  //         }
  //     }
  // };

  // const handleNativeShare = async () => {
  //     if (navigator.share) {
  //         setIsGenerating(true);
  //         try {
  //             // Generate PDF blob
  //             const pdfBlob = await generatePDFBlob();
  //             c

  //             // Create a File object from the blob
  //             const fileName = `player-report-${new Date().toISOString().split('T')[0]}.pdf`;
  //             const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  //             console.log("pdfFile", pdfFile);

  //             await navigator.share({
  //                 title: shareTitle,
  //                 text: shareText,
  //                 files: [pdfFile],
  //             });
  //         } catch (error) {
  //             if (error.name !== 'AbortError') {
  //                 console.error('Error sharing:', error);
  //             }
  //         } finally {
  //             setIsGenerating(false);
  //             setProgress(0);
  //         }
  //     }
  // };

  const handleNativeShare = async () => {
    if (navigator.share) {
      setPdfChoiceModal({ open: true, action: "share" });
    } else {
      console.warn("navigator.share not available on this device/browser");
      alert("Sharing is not supported on this device/browser.");
    }
  };

  const handlePdfChoice = (scope) => {
    const { action } = pdfChoiceModal;
    setPdfChoiceModal({ open: false, action: null });

    let url = "/pdf-report";
    const params = new URLSearchParams();

    if (scope === "current") {
      // Get the current route path (e.g. "/lineup")
      const currentPath = location.pathname;
      // Strip leading slash for the param value
      const sectionKey = currentPath.startsWith("/")
        ? currentPath.slice(1)
        : currentPath;
      if (sectionKey) params.set("section", sectionKey);
    }

    if (action === "share") params.set("action", "share");

    const qs = params.toString();
    navigate(qs ? `${url}?${qs}` : url);
  };

  const currentPageName = ROUTE_PAGE_NAMES[location.pathname] || "Current Page";

  return (
    <>
      {/* Loading Overlay */}
      {isGenerating && <LoadingOverlay progress={progress} />}

      {/* PDF Choice Modal */}
      {pdfChoiceModal.open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] rounded-xl p-6 max-w-xs w-full mx-4 shadow-2xl border border-white/10">
            <h3 className="text-lg font-black uppercase text-white text-center mb-1">
              {pdfChoiceModal.action === "share" ? "Share PDF" : "Download PDF"}
            </h3>
            <p className="text-xs text-gray-400 text-center mb-5">
              What would you like to export?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePdfChoice("current")}
                className="w-full bg-[var(--color-accent-modal)] hover:bg-[var(--color-accent-modal-hover)] text-white font-black uppercase py-3 rounded-lg tracking-wider transition-colors text-sm"
              >
                This Page Only ({currentPageName})
              </button>
              <button
                onClick={() => handlePdfChoice("all")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase py-3 rounded-lg tracking-wider transition-colors text-sm border border-white/20"
              >
                All Sections
              </button>
              <button
                onClick={() => setPdfChoiceModal({ open: false, action: null })}
                className="w-full text-gray-400 hover:text-white text-xs uppercase py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        id="bottom-bar-container"
        className="fixed bottom-0 left-0 right-0 py-2.5 px-3 bg-[#0C0E14]/95 backdrop-blur-xl border-t border-white/10 z-[100] shadow-2xl"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: "home", label: "Home", icon: Home, path: "/dashboard", isHome: true },
            { id: "counter", label: "Counter", icon: Pointer, path: "/touch-counter" },
            { id: "stats", label: "Stats", icon: BarChart3, path: "/stats" },
            { id: "coach", label: "Coach", icon: MessageSquare, path: "/note-to-coach" },
            { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.isHome
              ? location.pathname === "/dashboard" || location.pathname === "/"
              : location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1 transition-all duration-200 group"
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-[#FF4422]" : "text-white/50 group-hover:text-white/80"
                  }`}
                />
                <span
                  className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                    isActive ? "text-[#FF4422]" : "text-white/50"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
