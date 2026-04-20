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

    // ✅ Copy important layout + typography styles
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
      } catch (e) {}
    });

    // ✅ Set strict exact dimensions from original
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    div.style.minHeight = `${rect.height}px`;
    div.style.maxHeight = `${rect.height}px`;
    div.style.boxSizing = "border-box";

    // ✅ Handle specific element types for proper alignment
    if (el.tagName === "INPUT" || el.tagName === "SELECT") {
      div.style.display = "flex";
      div.style.alignItems = "center";
      if (computed.textAlign === "center") {
        div.style.justifyContent = "center";
      } else if (computed.textAlign === "right") {
        div.style.justifyContent = "flex-end";
      } else {
        div.style.justifyContent = "flex-start";
      }
      div.style.whiteSpace = "nowrap"; // strict single-line
      div.style.overflow = "hidden"; // clip any weird overflow
    } else {
      // TEXTAREA
      div.style.display = "block";
      div.style.whiteSpace = "pre-wrap";
      div.style.wordBreak = "break-word";
      div.style.overflow = "hidden";
    }

    // ✅ Preserve padding exactly like input
    div.style.paddingTop = computed.paddingTop;
    div.style.paddingBottom = computed.paddingBottom;
    div.style.paddingLeft = computed.paddingLeft;
    div.style.paddingRight = computed.paddingRight;

    // ✅ CRITICAL: Correct text alignment & spacing
    div.style.lineHeight = computed.lineHeight;
    div.style.textAlign = computed.textAlign;

    // ✅ Ensure fonts match exactly
    div.style.fontFamily = computed.fontFamily;
    div.style.fontSize = computed.fontSize;
    div.style.fontWeight = computed.fontWeight;

    // ✅ Fix very light text (white-on-white issue)
    const colorRGB = computed.color;
    if (colorRGB) {
      const match = colorRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 200) div.style.color = "#111111";
      }
    }

    // ✅ Fix very dark background (black-on-black issue)
    const bgRGB = computed.backgroundColor;
    if (bgRGB && bgRGB !== "rgba(0, 0, 0, 0)" && bgRGB !== "transparent") {
      const match = bgRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 50) div.style.backgroundColor = "#f5f5f5";
      }
    }

    // ✅ Set text
    div.textContent = displayValue;

    // ✅ Keep original class (important for styling)
    div.className = el.className;

    div.setAttribute("data-pdf-replacement", "true");

    // Replace element
    el.parentNode.insertBefore(div, el);
    el.style.display = "none";

    replacements.push({ original: el, replacement: div });
  });

  // Cleanup function
  return () => {
    replacements.forEach(({ original, replacement }) => {
      original.style.display = "";
      if (replacement.parentNode) {
        replacement.parentNode.removeChild(replacement);
      }
    });
  };
}

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
    register: "pdf-section-profile",
    stats: "pdf-section-stats",
    "touch-counter": "pdf-section-touches",
    reflection: "pdf-section-reflection",
    evaluation: "pdf-section-evaluation",
    roster: "pdf-section-grade",
    lineup: "pdf-section-formation",
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
  const SECTIONS =
    sectionParam && ROUTE_TO_SECTION[sectionParam]
      ? ALL_SECTIONS.filter((s) => s.id === ROUTE_TO_SECTION[sectionParam])
      : ALL_SECTIONS;

  // Determine which section components to render
  const renderAll = !sectionParam;
  const targetSectionId = sectionParam ? ROUTE_TO_SECTION[sectionParam] : null;

  useEffect(() => {
    const timer = setTimeout(() => generatePDF(), 2500);
    return () => clearTimeout(timer);
  }, []);

  const generatePDF = async () => {
    const root = document.documentElement;
    const prevClass = root.className;

    root.classList.remove("theme-dark");
    root.classList.add("theme-light");

    const styleOverride = document.createElement("style");
    styleOverride.id = "pdf-theme-override";
    styleOverride.textContent = `:root { --bg-primary:#fff !important; }`;
    document.head.appendChild(styleOverride);

    await new Promise((r) => setTimeout(r, 1000));

    try {
      let pdf = null;
      let isFirstPage = true;

      const pageWidth = 210; // A4 width in mm
      const margin = 5;

      for (let i = 0; i < SECTIONS.length; i++) {
        const { id, label } = SECTIONS[i];
        const sectionEl = document.getElementById(id);

        setStatus(`Capturing ${label}…`);
        setProgress(Math.round(((i + 0.5) / SECTIONS.length) * 90));

        if (!sectionEl) continue;

        const cleanup = prepareInputsForCapture(sectionEl);

        // Inject the FOOTBALLER ATHLETICS logo to the bottom of the section
        const footer = document.createElement("div");
        footer.className = "text-center pt-8 pb-2";
        footer.innerHTML = `<span class="text-[12px] tracking-[0.15em] text-black uppercase">
          <strong class="font-black">FOOTBALLER</strong> <span class="font-normal">ATHLETICS</span>
        </span>`;
        sectionEl.appendChild(footer);
        sectionEl.style.transform = "scale(1)";
        sectionEl.offsetHeight; // force reflow

        const canvas = await html2canvas(sectionEl, {
          scale: 2, // Higher scale for better text clarity
          useCORS: true,
          backgroundColor: "#ffffff",
          letterRendering: true,
          removeContainer: true, // Helps with layout shifting
          onclone: (clonedDoc) => {
            const elements = clonedDoc.getElementsByTagName("*");
            for (let el of elements) {
              if (el.getAttribute("data-pdf-replacement") === "true") {
                el.style.color = "black";
              }
            }
            // Number badges fix - force white text on black circle
            clonedDoc
              .querySelectorAll(".football-field .bg-black span")
              .forEach((span) => {
                span.style.color = "#ffffff";
                span.style.display = "block";
                span.style.textAlign = "center";
              });
          },
        });

        sectionEl.removeChild(footer);
        cleanup();

        // ✅ Trim extra white space (IMPORTANT)
        const trimmed = trimCanvasBottom(canvas);

        const imgWidth = pageWidth;
        const imgHeight = (trimmed.height * imgWidth) / trimmed.width;

        const pageHeight = imgHeight + margin * 2;

        // ✅ First page create
        if (isFirstPage) {
          pdf = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: [pageWidth, pageHeight], // 🔥 dynamic height
          });

          isFirstPage = false;
        } else {
          pdf.addPage([pageWidth, pageHeight]); // 🔥 dynamic page
        }

        pdf.addImage(
          trimmed.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          margin,
          imgWidth,
          imgHeight,
        );

        setProgress(Math.round(((i + 1) / SECTIONS.length) * 90));
      }

      setStatus("Finalizing PDF…");
      setProgress(100);

      const blob = pdf.output("blob");

      if (action === "share" && navigator.share) {
        setStatus("Report Ready!");
        const fileName = `player-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        const pdfFile = new File([blob], fileName, {
          type: "application/pdf",
        });

        setShareFile(pdfFile);
        return;
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `player-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
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
      root.className = prevClass;
      document.getElementById("pdf-theme-override")?.remove();
    }
  };

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
            <FootballFormation isPdf={true} />
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
