import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  MessageSquare,
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

  // Local state with localStorage initialization
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

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("playerReflection", JSON.stringify(formData));
  }, [formData]);

  // Sync from DB to Local state (only if DB has content and differs)
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

      // Only update local state if DB has meaningful data or if local state is empty
      // This prevents empty DB from overwriting unsaved local work on reload
      const hasLocalData =
        formData.wellDoneTags.length > 0 ||
        formData.playerName ||
        formData.playerAge ||
        formData.achievedGoal ||
        formData.whatLearned ||
        formData.whatWouldChange ||
        Object.keys(formData.detailedPerformance).length > 0;

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
  }, [reflection]); // Removed formData dependency to avoid circular loops, though comparison handles it

  // Handlers
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
    <Card className="mb-[24px] border-none shadow-none">
      <CardContent className="p-2">
        {(!isPdf || !pdfPart || pdfPart === 1) && (
          <>
            {/* Header */}
            <div className="mb-3 border-b-2 border-black dark:border-white pb-2">
              <h2 className="text-xl font-black uppercase text-football-text text-center">
                PLAYER REFLECTION
              </h2>
            </div>
            <div className="flex gap-4 mb-3 mt-2">
              <div className="flex-1 flex items-center gap-3">
                <label
                  htmlFor="playerName"
                  className="text-xs font-black uppercase text-football-text whitespace-nowrap"
                >
                  NAME:
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={formData.playerName}
                  onChange={handleTextChange}
                  className="w-full bg-[var(--bg-input)] text-[var(--text-input)] px-3 py-[4px] text-sm font-bold uppercase border-none focus:outline-none focus:ring-1 focus:ring-football-accent"
                />
              </div>
              {/* <div className="flex items-center gap-3">
                <label
                  htmlFor="playerAge"
                  className="text-xs font-black uppercase text-football-text whitespace-nowrap"
                >
                  AGE:
                </label>
                <input
                  id="playerAge"
                  type="text"
                  value={formData.playerAge}
                  onChange={handleTextChange}
                  className="w-20 bg-[var(--bg-input)] text-[var(--text-input)] px-3 py-[4px] text-sm font-bold uppercase border-none focus:outline-none focus:ring-1 focus:ring-football-accent"
                />
              </div> */}
            </div>

            {/* What did you do well? */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase mb-3 text-football-text">
                WHAT DID YOU DO WELL:
              </h3>
              <div className="grid grid-cols-3 gap-x-1 gap-y-2">
                {WELL_DONE_TAGS.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center shrink-0"
                      data-pdf-checkmark="true"
                      style={{
                        borderColor: formData.wellDoneTags.includes(tag)
                          ? "var(--checkbox-checked-bg)"
                          : "var(--text-primary)",
                        backgroundColor: formData.wellDoneTags.includes(tag)
                          ? "var(--checkbox-checked-bg)"
                          : "transparent",
                      }}
                    >
                      {formData.wellDoneTags.includes(tag) && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: "var(--checkbox-check-color)",
                          }}
                        />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.wellDoneTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                    />
                    <span className="text-[10px] font-bold uppercase text-football-text leading-tight whitespace-nowrap">
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-2 mb-4">
              <div>
                <label
                  htmlFor="achievedGoal"
                  className="block text-xs font-black uppercase mb-1 text-football-text"
                >
                  DID YOU ACHIEVE YOUR GOAL?
                </label>
                <input
                  id="achievedGoal"
                  type="text"
                  value={formData.achievedGoal}
                  onChange={handleTextChange}
                  className="w-full bg-[var(--bg-input)] text-[var(--text-input)] border-none px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-football-accent h-8"
                />
              </div>
              <div>
                <label
                  htmlFor="whatLearned"
                  className="block text-xs font-black uppercase mb-1 text-football-text"
                >
                  WHAT DID YOU LEARN?
                </label>
                <input
                  id="whatLearned"
                  type="text"
                  value={formData.whatLearned}
                  onChange={handleTextChange}
                  className="w-full bg-[var(--bg-input)] text-[var(--text-input)] border-none px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-football-accent h-8"
                />
              </div>
              <div>
                <label
                  htmlFor="whatWouldChange"
                  className="block text-xs font-black uppercase mb-1 text-football-text"
                >
                  WHAT WOULD YOU CHANGE?
                </label>
                <input
                  id="whatWouldChange"
                  type="text"
                  value={formData.whatWouldChange}
                  onChange={handleTextChange}
                  className="w-full bg-[var(--bg-input)] text-[var(--text-input)] border-none px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-football-accent h-8"
                />
              </div>
            </div>
          </>
        )}

        {/* Performance Metrics */}
        {(!isPdf || !pdfPart || pdfPart === 2 || pdfPart === 3) && (
          <div>
            {(!isPdf || !pdfPart || pdfPart === 2) && (
              <h3 className="text-sm font-black uppercase mb-4 text-football-text">
                REFLECT ON YOUR GAME PERFORMANCE: 1-10
              </h3>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {metricsToRender.map((metric) => {
                const value = Number(formData.detailedPerformance[metric] || 5);
                const percent = ((value - 1) / 9) * 100;
                return (
                  <div key={metric} className="flex items-center gap-2">
                    {/* Label - fixed width */}
                    <span className="text-[9px] font-bold uppercase text-football-text tracking-wider w-20 shrink-0 leading-tight">
                      {metric}
                    </span>
                    {/* Slider - grows to fill */}
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) =>
                        handleMetricChange(metric, e.target.value)
                      }
                      className="slider-thumb flex-1 h-2 rounded-full appearance-none cursor-pointer min-w-0"
                      style={{
                        background: `linear-gradient(to right,
                          var(--slider-filled) 0%,
                          var(--slider-filled) ${percent}%,
                          var(--slider-unfilled) ${percent}%,
                          var(--slider-unfilled) 100%)`,
                      }}
                    />
                    {/* Value - fixed width */}
                    <span className="text-[9px] font-bold text-[var(--text-primary)] w-3 text-right shrink-0">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
        className={`fixed bottom-0 left-0 right-0 p-4 ${isLightTheme ? "bg-[var(--bg-primary)]" : "bg-black/95"} backdrop-blur-lg z-[100]`}
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            size="sm"
            className={`flex-col gap-1 py-3 h-auto rounded-xl transition-all ${
              isLightTheme
                ? "bg-transparent text-white border-2 border-white hover:bg-white/10"
                : "bg-black text-white border border-white/20 hover:bg-white/10"
            }`}
            onClick={handleReset}
            disabled={isGenerating}
          >
            <RotateCcw className="size-4" />
            <span className="text-[10px] font-bold">Reset</span>
          </Button>
          {navigator.share && (
            <Button
              variant="secondary"
              size="sm"
              className={`flex-col gap-1 py-3 h-auto rounded-xl transition-all ${
                isLightTheme
                  ? "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  : "bg-black text-white border border-white/20 hover:bg-white/10"
              }`}
              onClick={handleNativeShare}
              disabled={isGenerating}
            >
              <Share2 className="size-4" />
              <span className="text-[10px] font-bold">Share</span>
            </Button>
          )}
          {/* <Button
                        variant="secondary"
                        size="sm"
                        className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-[#FF4422]/20 hover:border-[#FF4422]/40 transition-all"
                        onClick={handleShare}
                        disabled={isGenerating}
                    >
                        <Share2 className="size-4" />
                        <span className="text-[10px]">Share</span>
                    </Button> */}
          <Button
            variant="secondary"
            size="sm"
            className={`flex-col gap-1 py-3 h-auto rounded-xl transition-all ${
              isLightTheme
                ? "bg-transparent text-white border-2 border-white hover:bg-white/10"
                : "bg-black text-white border border-white/20 hover:bg-white/10"
            }`}
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            <Download className="size-4" />
            <span className="text-[10px] font-bold">
              {isGenerating ? "..." : "PDF"}
            </span>
          </Button>
          <Button
            variant="primary"
            className={`flex-col gap-1 py-3 h-auto rounded-xl transition-all ${
              isLightTheme
                ? "bg-[#111111] text-white border-2 border-white hover:bg-black/90 shadow-none"
                : "bg-[var(--color-accent)] text-white border-none shadow-lg shadow-[var(--color-accent)]/60 hover:bg-[var(--color-accent-hover)]"
            }`}
            onClick={handleSave}
            disabled={isGenerating}
          >
            <Save className="size-4" />
            <span className="text-[10px] font-bold">Save</span>
          </Button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[11px] tracking-[0.15em] text-white">
            <span className="font-black">FOOTBALLER</span>{" "}
            <span className="font-normal">ATHLETICS</span>
          </span>
        </div>
      </div>
    </>
  );
}
