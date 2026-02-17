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
      <div className="bg-white dark:bg-[#1A1A1A] rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#FF4422] animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">
              Generating PDF Report
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait...
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#FF4422] h-full transition-all duration-300 ease-out"
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

export function PlayerReflection() {
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

  return (
    <Card className="mb-[24px] bg-white dark:bg-[#1A1A1A] border-none shadow-none">
      <CardContent className="p-2">
        {/* Header */}
        <div className="mb-6 border-b-2 border-black dark:border-white pb-2">
          <h2 className="text-xl font-black uppercase text-black dark:text-white">
            PLAYER REFLECTION
          </h2>
          <div className="flex gap-4 mb-1 mt-2">
            <div className="flex-1 flex items-center gap-3">
              <label
                htmlFor="playerName"
                className="text-xs font-black uppercase text-black dark:text-white whitespace-nowrap"
              >
                NAME:
              </label>
              <input
                id="playerName"
                type="text"
                value={formData.playerName}
                onChange={handleTextChange}
                className="w-full bg-white text-black px-3 py-[4px] text-sm font-bold uppercase border-none focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="playerAge"
                className="text-xs font-black uppercase text-black dark:text-white whitespace-nowrap"
              >
                AGE:
              </label>
              <input
                id="playerAge"
                type="text"
                value={formData.playerAge}
                onChange={handleTextChange}
                className="w-20 bg-white text-black px-3 py-[4px] text-sm font-bold uppercase border-none focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>
        </div>

        {/* What did you do well? */}
        <div className="mb-8">
          <h3 className="text-sm font-black uppercase mb-3 text-black dark:text-white">
            WHAT DID YOU DO WELL:
          </h3>
          <div className="grid grid-cols-3 gap-x-1 gap-y-2">
            {WELL_DONE_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 border-2 flex items-center justify-center transition-all bg-white border-white ${
                    formData.wellDoneTags.includes(tag)
                      ? "bg-white"
                      : "bg-white"
                  }`}
                >
                  {formData.wellDoneTags.includes(tag) && (
                    <span className="text-black font-bold text-[12px]">✓</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.wellDoneTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                <span className="text-[10px] font-bold uppercase text-white leading-tight whitespace-nowrap">
                  {tag}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-4 mb-8">
          <div>
            <label
              htmlFor="achievedGoal"
              className="block text-sm font-black uppercase mb-1 text-black dark:text-white"
            >
              DID YOU ACHIEVE YOUR GOAL?
            </label>
            <input
              id="achievedGoal"
              type="text"
              value={formData.achievedGoal}
              onChange={handleTextChange}
              className="w-full bg-white text-black border-none px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white h-8"
            />
          </div>
          <div>
            <label
              htmlFor="whatLearned"
              className="block text-sm font-black uppercase mb-1 text-black dark:text-white"
            >
              WHAT DID YOU LEARN?
            </label>
            <input
              id="whatLearned"
              type="text"
              value={formData.whatLearned}
              onChange={handleTextChange}
              className="w-full bg-white text-black border-none px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white h-8"
            />
          </div>
          <div>
            <label
              htmlFor="whatWouldChange"
              className="block text-sm font-black uppercase mb-1 text-black dark:text-white"
            >
              WHAT WOULD YOU CHANGE?
            </label>
            <input
              id="whatWouldChange"
              type="text"
              value={formData.whatWouldChange}
              onChange={handleTextChange}
              className="w-full bg-white text-black border-none px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white h-8"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h3 className="text-sm font-black uppercase mb-4 text-black dark:text-white">
            REFLECT ON YOUR GAME PERFORMANCE: 1-10
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {PERFORMANCE_METRICS.map((metric) => (
              <div key={metric} className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.detailedPerformance[metric] || ""}
                  onChange={(e) => handleMetricChange(metric, e.target.value)}
                  className="w-12 h-6 bg-white text-black text-center font-bold text-xs border-none focus:outline-none focus:ring-1 focus:ring-white"
                />
                <span className="text-[10px] font-bold uppercase text-white">
                  {metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BottomBar() {
  const { sessionId } = useActiveSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const generatePDFBlob = async () => {
    setProgress(0);

    // Hide bottom bar
    const bottomBar = document.getElementById("bottom-bar-container");
    const originalDisplay = bottomBar?.style.display;
    if (bottomBar) bottomBar.style.display = "none";

    // Find the main content - it will try multiple selectors
    const element =
      document.querySelector("main") ||
      document.querySelector(".dashboard") ||
      document.querySelector('[class*="dashboard"]') ||
      document.body.children[0];

    if (!element) {
      if (bottomBar) bottomBar.style.display = originalDisplay;
      throw new Error("Content not found");
    }

    try {
      setProgress(20);

      // Capture with settings optimized for readability
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#000000",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        x: 0,
        y: 0,
      });

      setProgress(60);

      // Show bottom bar again
      if (bottomBar) bottomBar.style.display = originalDisplay;

      // Convert to image
      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Scale to fit page width
      const ratio = pageWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // Add pages as needed
      let position = 0;
      let page = 0;

      while (position < scaledHeight) {
        if (page > 0) {
          pdf.addPage();
        }

        // Add image portion
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          -position,
          pageWidth,
          scaledHeight,
          undefined,
          "FAST",
        );

        position += pageHeight;
        page++;

        setProgress(60 + page * 5);

        // Safety limit
        if (page > 50) break;
      }

      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 200));

      return pdf.output("blob");
    } catch (error) {
      if (bottomBar) bottomBar.style.display = originalDisplay;
      console.error("PDF Error:", error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generatePDFBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `player-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
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
      setIsGenerating(true);

      try {
        const pdfBlob = await generatePDFBlob();

        const fileName = `player-report-${new Date().toISOString().split("T")[0]}.pdf`;
        console.log("File name:", fileName);

        const pdfFile = new File([pdfBlob], fileName, {
          type: "application/pdf",
          lastModified: new Date().getTime(),
        });

        // Check if files can be shared
        console.log("Checking if can share files...");
        if (navigator.canShare) {
          const canShareFiles = navigator.canShare({ files: [pdfFile] });
          console.log("Can share files:", canShareFiles);
        }

        const shareData = {
          files: [pdfFile],
          title: shareTitle,
          text: shareText,
        };

        console.log("Attempting to share with:", shareData);

        await navigator.share(shareData);

        console.log("Share successful!");
      } catch (error) {
        console.error("Share error occurred:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        if (error.name !== "AbortError") {
          console.error("Non-abort error sharing:", error);
        } else {
          console.log("User cancelled the share");
        }
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    } else {
      console.warn("navigator.share not available on this device/browser");
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isGenerating && <LoadingOverlay progress={progress} />}

      <div
        id="bottom-bar-container"
        className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95 backdrop-blur-lg z-[100]"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-gray-300 hover:border-gray-300 transition-all"
            onClick={handleReset}
            disabled={isGenerating}
          >
            <RotateCcw className="size-4" />
            <span className="text-[10px]">Reset</span>
          </Button>
          {navigator.share && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-gray-300 hover:border-gray-300 transition-all"
              onClick={handleNativeShare}
              disabled={isGenerating}
            >
              <Share2 className="size-4" />
              <span className="text-[10px]">Share</span>
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
            className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-gray-300 hover:border-gray-300 transition-all"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            <Download className="size-4" />
            <span className="text-[10px]">{isGenerating ? "..." : "PDF"}</span>
          </Button>
          <Button
            variant="primary"
            className="flex-col gap-1 py-3 h-auto shadow-lg shadow-[#FF4422]/40 bg-[#FF4422] hover:bg-[#FF6B35] border-none text-white transition-all"
            onClick={handleSave}
            disabled={isGenerating}
          >
            <Save className="size-4" />
            <span className="text-[10px]">Save</span>
          </Button>
        </div>
      </div>
    </>
  );
}
