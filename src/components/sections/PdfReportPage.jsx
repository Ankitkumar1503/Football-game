import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader2 } from "lucide-react";
import { PlayerProfile } from "./PlayerProfile";
import { LiveStats } from "./LiveStats";
import { PlayerEvaluation } from "./PlayerEvaluation";
import { PlayerReflection } from "./ReflectionAndFooter";
import { PlayerAttendanceGrade } from "./PlayerAttendanceGrade";
import { FootballFormation } from "./Footballformation";
import { NoteToCoach } from "./NoteToCoach";
import { PlayerStats } from "./PlayerStats";

/**
 * Replace every <input>, <textarea>, <select> with a styled <div>
 * so html2canvas can capture the typed values.
 * Uses flexbox centering so values align perfectly — just like a real input.
 */
function prepareInputsForCapture(container) {
  const replacements = [];

  container.querySelectorAll("input, textarea, select").forEach((el) => {
    if (
      ["checkbox", "radio", "range", "hidden", "file", "color"].includes(
        el.type,
      )
    )
      return;

    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    let displayValue = "";
    if (el.tagName === "SELECT") {
      displayValue = el.options[el.selectedIndex]?.text || el.value || "";
    } else {
      displayValue = el.value || "";
    }

    const div = document.createElement("div");

    // Copy layout & font styles — but NOT padding (we set it manually below)
    const stylesToCopy = [
      "width",
      "minWidth",
      "maxWidth",
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "fontSize",
      "fontWeight",
      "fontFamily",
      "fontStyle",
      "textTransform",
      "letterSpacing",
      "lineHeight",
      "textAlign",
      "color",
      "backgroundColor",
      "border",
      "borderTop",
      "borderRight",
      "borderBottom",
      "borderLeft",
      "borderRadius",
      "boxSizing",
      "position",
    ];

    stylesToCopy.forEach((prop) => {
      try {
        div.style[prop] = computed[prop];
      } catch (e) {
        /* ignore */
      }
    });

    // ── Set height explicitly from the real element's bounding rect ──
    div.style.height = `${rect.height}px`;
    div.style.minHeight = `${rect.height}px`;

    if (el.tagName === "TEXTAREA") {
      // Textarea: block layout, preserve whitespace, keep original padding
      div.style.display = "block";
      div.style.whiteSpace = "pre-wrap";
      div.style.overflow = "hidden";
      div.style.paddingTop = computed.paddingTop;
      div.style.paddingRight = computed.paddingRight;
      div.style.paddingBottom = computed.paddingBottom;
      div.style.paddingLeft = computed.paddingLeft;
    } else {
      // Input / Select: flexbox centers value vertically — matches native input
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.whiteSpace = "nowrap";
      div.style.overflow = "hidden";
      div.style.textOverflow = "ellipsis";
      // Keep left/right padding, zero top/bottom (flex centering handles it)
      div.style.paddingTop = "0";
      div.style.paddingBottom = "0";
      div.style.paddingLeft = computed.paddingLeft || "12px";
      div.style.paddingRight = computed.paddingRight || "12px";
    }

    // ── Force readable text color (fix white-on-white) ──
    const colorRGB = computed.color;
    if (colorRGB) {
      const match = colorRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 200) div.style.color = "#111111";
      }
    }

    // ── Force readable background (fix black-on-black) ──
    const bgRGB = computed.backgroundColor;
    if (bgRGB && bgRGB !== "rgba(0, 0, 0, 0)" && bgRGB !== "transparent") {
      const match = bgRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 50) div.style.backgroundColor = "#f0f0f0";
      }
    }

    div.textContent = displayValue;
    div.className = el.className;
    div.setAttribute("data-pdf-replacement", "true");

    el.parentNode.insertBefore(div, el);
    el.style.display = "none";
    replacements.push({ original: el, replacement: div });
  });

  return () => {
    replacements.forEach(({ original, replacement }) => {
      original.style.display = "";
      if (replacement.parentNode)
        replacement.parentNode.removeChild(replacement);
    });
  };
}

/**
 * Smart canvas slicer — finds white/empty rows to cut between,
 * so page breaks never slice through content.
 */
function smartSliceCanvas(sourceCanvas, maxSliceHeightPx, searchRangePx = 80) {
  const slices = [];
  const totalHeight = sourceCanvas.height;
  const width = sourceCanvas.width;
  const ctx = sourceCanvas.getContext("2d");
  let y = 0;

  while (y < totalHeight) {
    let sliceEnd = Math.min(y + maxSliceHeightPx, totalHeight);

    if (sliceEnd < totalHeight) {
      const searchStart = Math.max(y, sliceEnd - searchRangePx);
      let bestCut = sliceEnd;
      let bestScore = -1;
      let consecutiveWhite = 0;

      for (let row = sliceEnd; row >= searchStart; row--) {
        const imageData = ctx.getImageData(0, row, width, 1);
        const pixels = imageData.data;
        let whiteness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          whiteness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        }
        const avg = whiteness / (pixels.length / 4);

        if (avg > 250) {
          consecutiveWhite++;
          if (consecutiveWhite >= 10) {
            bestCut = row + 5;
            break;
          }
        } else {
          consecutiveWhite = 0;
        }

        if (avg > bestScore) {
          bestScore = avg;
          bestCut = row;
        }
      }
      sliceEnd = bestCut;
    }

    const sliceHeight = sliceEnd - y;
    if (sliceHeight <= 0) break;

    const slice = document.createElement("canvas");
    slice.width = width;
    slice.height = sliceHeight;
    slice
      .getContext("2d")
      .drawImage(
        sourceCanvas,
        0,
        y,
        width,
        sliceHeight,
        0,
        0,
        width,
        sliceHeight,
      );
    slices.push(slice);
    y = sliceEnd;
  }

  return slices;
}

/**
 * Add a canvas to the PDF — handles:
 * - Fits on current page → place it
 * - Needs new page but fits on one → new page
 * - Too tall for one page → smart slice
 */
function addCanvasToPdf(pdf, canvas, currentY, margin, pageW, pageH, contentW) {
  const imgHeightMM = (canvas.height * contentW) / canvas.width;
  const contentH = pageH - margin * 2;

  // Case 1: fits on current page without a new page
  if (currentY + imgHeightMM <= pageH - margin) {
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.92),
      "JPEG",
      margin,
      currentY,
      contentW,
      imgHeightMM,
    );
    return currentY + imgHeightMM;
  }

  // Case 2: fits on a single page, just needs a new page
  if (imgHeightMM <= contentH) {
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.92),
      "JPEG",
      margin,
      margin,
      contentW,
      imgHeightMM,
    );
    return margin + imgHeightMM;
  }

  // Case 3: too tall for one page — smart slice
  const pxPerMM = canvas.width / contentW;
  const maxSlicePx = contentH * pxPerMM;
  const searchPx = 80 * pxPerMM;
  const slices = smartSliceCanvas(canvas, maxSlicePx, searchPx);

  for (let i = 0; i < slices.length; i++) {
    const sliceH = (slices[i].height * contentW) / slices[i].width;

    if (i === 0 && currentY + sliceH <= pageH - margin) {
      // First slice fits on current page
      pdf.addImage(
        slices[i].toDataURL("image/jpeg", 0.92),
        "JPEG",
        margin,
        currentY,
        contentW,
        sliceH,
      );
      currentY += sliceH;
    } else {
      pdf.addPage();
      pdf.addImage(
        slices[i].toDataURL("image/jpeg", 0.92),
        "JPEG",
        margin,
        margin,
        contentW,
        sliceH,
      );
      currentY = margin + sliceH;
    }
  }

  return currentY;
}

/**
 * Trim trailing white rows from the bottom of a canvas.
 * Removes the large blank gaps caused by component padding.
 */
function trimCanvasBottom(canvas, threshold = 245) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  let lastContentRow = canvas.height - 1;

  for (let row = canvas.height - 1; row >= 0; row--) {
    const pixels = ctx.getImageData(0, row, width, 1).data;
    let isBlank = true;
    for (let i = 0; i < pixels.length; i += 4) {
      if ((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3 < threshold) {
        isBlank = false;
        break;
      }
    }
    if (!isBlank) {
      lastContentRow = row;
      break;
    }
  }

  const trimmedHeight = Math.min(lastContentRow + 24, canvas.height);
  if (trimmedHeight >= canvas.height) return canvas;

  const trimmed = document.createElement("canvas");
  trimmed.width = width;
  trimmed.height = trimmedHeight;
  trimmed
    .getContext("2d")
    .drawImage(canvas, 0, 0, width, trimmedHeight, 0, 0, width, trimmedHeight);
  return trimmed;
}

// ─────────────────────────────────────────────────────────────────────────────

export function PdfReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing report…");
  const [shareFile, setShareFile] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get("action");
  const sectionParam = searchParams.get("section"); // e.g. "lineup", "stats"

  // Map route keys to section IDs
  const ROUTE_TO_SECTION = {
    "register": "pdf-section-profile",
    "stats": "pdf-section-stats",
    "touch-counter": "pdf-section-touches",
    "reflection": "pdf-section-reflection",
    "evaluation": "pdf-section-evaluation",
    "roster": "pdf-section-grade",
    "lineup": "pdf-section-formation",
    "note-to-coach": "pdf-section-note",
  };

  const ALL_SECTIONS = [
    { id: "pdf-section-profile", label: "Register" },
    { id: "pdf-section-stats", label: "Player Stats" },
    { id: "pdf-section-touches", label: "Total Touches" },
    { id: "pdf-section-evaluation", label: "Player Evaluation" },
    { id: "pdf-section-reflection", label: "Player Reflection" },
    { id: "pdf-section-grade", label: "Player Grade" },
    { id: "pdf-section-formation", label: "Starting Lineup" },
    { id: "pdf-section-note", label: "Note to Coach" },
  ];

  // If sectionParam is set, only include that single section
  const SECTIONS = sectionParam && ROUTE_TO_SECTION[sectionParam]
    ? ALL_SECTIONS.filter(s => s.id === ROUTE_TO_SECTION[sectionParam])
    : ALL_SECTIONS;

  // Determine which section components to render
  const renderAll = !sectionParam;
  const targetSectionId = sectionParam ? ROUTE_TO_SECTION[sectionParam] : null;

  useEffect(() => {
    const timer = setTimeout(() => generatePDF(), 2500);
    return () => clearTimeout(timer);
  }, []);

  const generatePDF = async () => {
    // ── 1. Force light theme before any capture ──────────────────────────────
    const root = document.documentElement;
    const prevClass = root.className;
    root.classList.remove("theme-dark");
    root.classList.add("theme-light");

    const styleOverride = document.createElement("style");
    styleOverride.id = "pdf-theme-override";
    styleOverride.textContent = `
      :root, .theme-light {
        --bg-primary: #ffffff !important;
        --bg-secondary: #f5f5f5 !important;
        --bg-card: #ffffff !important;
        --bg-input: #f0f0f0 !important;
        --text-primary: #000000 !important;
        --text-secondary: #333333 !important;
        --text-input: #000000 !important;
        --border-color: #000000 !important;
        --color-accent: #000000 !important;
        --color-accent-new: #000000 !important;
        --color-accent-hover: #333333 !important;
        --category-header-bg: #000000 !important;
        --category-header-text: #ffffff !important;
        --ball-fill: #000000 !important;
        --ball-stroke: #000000 !important;
        --ball-stroke-width: 3 !important;
        --field-bg: #ffffff !important;
        --field-line: #000000 !important;
        --slider-filled: #000000 !important;
        --slider-unfilled: #cccccc !important;
        --slider-thumb: #000000 !important;
        --checkbox-checked-bg: #000000 !important;
        --checkbox-check-color: #ffffff !important;
      }
      /* Force field-specific elements for html2canvas */
      .football-field {
        background-color: #ffffff !important;
        border-color: #000000 !important;
      }
      .football-field div {
        border-color: #000000 !important;
      }
      .football-field input {
        border: 1px solid #000000 !important;
        background-color: #ffffff !important;
        color: #000000 !important;
      }
    `;
    document.head.appendChild(styleOverride);

    // Small delay so styles apply before capture
    await new Promise((r) => setTimeout(r, 400));

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const contentW = pageW - margin * 2;

      let currentY = margin;

      for (let i = 0; i < SECTIONS.length; i++) {
        const { id, label } = SECTIONS[i];
        const sectionEl = document.getElementById(id);

        setStatus(`Capturing ${label}…`);
        setProgress(Math.round(((i + 0.5) / SECTIONS.length) * 90));

        if (!sectionEl) {
          console.warn(`Section #${id} not found, skipping`);
          continue;
        }

        const cleanup = prepareInputsForCapture(sectionEl);

        const canvas = await html2canvas(sectionEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 0,
        });

        cleanup();

        const trimmed = trimCanvasBottom(canvas);

        currentY = addCanvasToPdf(
          pdf,
          trimmed,
          currentY,
          margin,
          pageW,
          pageH,
          contentW,
        );

        // Small gap between sections if still on the same page
        if (currentY + 4 < pageH - margin) {
          currentY += 4;
        }

        setProgress(Math.round(((i + 1) / SECTIONS.length) * 90));
      }

      setStatus("Finalizing PDF…");
      setProgress(100);

      const blob = pdf.output("blob");

      if (action === "share" && navigator.share) {
        setStatus("Report Ready!");
        const fileName = `player-report-${new Date().toISOString().split("T")[0]}.pdf`;
        const pdfFile = new File([blob], fileName, {
          type: "application/pdf",
          lastModified: new Date().getTime(),
        });

        setShareFile(pdfFile);
        return; // Wait for user to click the share button manually
      } else {
        setStatus("Downloading PDF…");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `player-report-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      await new Promise((r) => setTimeout(r, 800));
      navigate(-1);
    } catch (err) {
      console.error("PDF generation error:", err);
      setStatus("Error — going back…");
      await new Promise((r) => setTimeout(r, 2000));
      navigate(-1);
    } finally {
      // ── Always restore original theme ─────────────────────────────────────
      root.className = prevClass;
      document.getElementById("pdf-theme-override")?.remove();
    }
  };

  // ── Light-theme CSS variable overrides applied inline so every child
  //    component inherits white backgrounds regardless of :root defaults ──
  const lightThemeVars = {
    backgroundColor: "#ffffff",
    color: "#000000",
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f5f5f5",
    "--bg-card": "#ffffff",
    "--bg-input": "#f0f0f0",
    "--text-primary": "#000000",
    "--text-secondary": "#333333",
    "--text-input": "#000000",
    "--border-color": "#000000",
    "--color-accent": "#000000",
    "--color-accent-new": "#000000",
    "--color-accent-hover": "#333333",
    "--category-header-bg": "#000000",
    "--category-header-text": "#ffffff",
    "--ball-fill": "#000000",
    "--ball-stroke": "#000000",
    "--ball-stroke-width": "3",
    "--field-bg": "#ffffff",
    "--field-line": "#000000",
    "--slider-filled": "#000000",
    "--slider-unfilled": "#cccccc",
    "--slider-thumb": "#000000",
    "--checkbox-checked-bg": "#000000",
    "--checkbox-check-color": "#ffffff",
  };

  return (
    <>
      {/* ── Loading overlay ── */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm">
        <div className="bg-[#111] rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className={`w-12 h-12 text-[var(--color-accent)] ${!shareFile ? "animate-spin" : ""}`}
            />
            <div className="text-center">
              <h3 className="text-lg font-black uppercase text-white mb-2">
                {shareFile ? "Ready to Share" : "Generating PDF Report"}
              </h3>
              <p className="text-sm text-gray-400">{status}</p>
            </div>

            {shareFile ? (
              <div className="w-full flex flex-col gap-2 mt-2">
                <button
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: "Check out my football performance report!",
                        text: "I just completed my football training session. Check out my performance metrics and reflections!",
                        files: [shareFile],
                      });
                    } catch (e) {
                      if (e.name !== "AbortError") console.error(e);
                    }
                    navigate(-1);
                  }}
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-black uppercase py-3 rounded tracking-wider transition-colors"
                >
                  Share PDF Now
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-transparent hover:bg-white/10 text-white font-bold uppercase py-2 rounded tracking-wider transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{progress}% complete</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Hidden render container with forced light theme ── */}
      <div
        ref={containerRef}
        className="max-w-md mx-auto"
        style={lightThemeVars}
      >
        {/* REGISTER */}
        {(renderAll || targetSectionId === "pdf-section-profile") && (
          <div
            id="pdf-section-profile"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <PlayerProfile />
          </div>
        )}

        {/* PLAYER STATS */}
        {(renderAll || targetSectionId === "pdf-section-stats") && (
          <div
            id="pdf-section-stats"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <PlayerStats />
          </div>
        )}

        {/* TOTAL TOUCHES */}
        {(renderAll || targetSectionId === "pdf-section-touches") && (
          <div
            id="pdf-section-touches"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <LiveStats isPdf={true} />
          </div>
        )}

        {/* PLAYER EVALUATION */}
        {(renderAll || targetSectionId === "pdf-section-evaluation") && (
          <div
            id="pdf-section-evaluation"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <PlayerEvaluation isPdf={true} />
          </div>
        )}

        {/* PLAYER REFLECTION */}
        {(renderAll || targetSectionId === "pdf-section-reflection") && (
          <div
            id="pdf-section-reflection"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <PlayerReflection isPdf={true} />
          </div>
        )}

        {/* PLAYER GRADE */}
        {(renderAll || targetSectionId === "pdf-section-grade") && (
          <div
            id="pdf-section-grade"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <PlayerAttendanceGrade isPdf={true} />
          </div>
        )}

        {/* STARTING LINEUP */}
        {(renderAll || targetSectionId === "pdf-section-formation") && (
          <div
            id="pdf-section-formation"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <FootballFormation />
          </div>
        )}

        {/* NOTE TO COACH */}
        {(renderAll || targetSectionId === "pdf-section-note") && (
          <div
            id="pdf-section-note"
            style={{ background: "#fff", marginBottom: "8px", padding: "16px" }}
          >
            <NoteToCoach isPdf={true} />
          </div>
        )}
      </div>
    </>
  );
}
