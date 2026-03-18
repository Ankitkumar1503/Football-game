import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

/**
 * Before html2canvas capture, replace every <input>, <textarea>, and <select>
 * with a styled <div> clone so the VALUE is visible in the captured image.
 * html2canvas can't reliably render native input values.
 */
function prepareInputsForCapture(container) {
  const replacements = [];

  container.querySelectorAll("input, textarea, select").forEach((el) => {
    // Skip checkboxes, radios, ranges, hidden — they render fine or aren't text
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
      displayValue = el.value || el.placeholder || "";
    }

    const div = document.createElement("div");

    // Copy all essential computed styles
    const stylesToCopy = [
      "width",
      "height",
      "minHeight",
      "maxHeight",
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
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

    // Force visibility
    div.style.display = el.tagName === "TEXTAREA" ? "block" : "flex";
    div.style.alignItems = "center";
    div.style.overflow = "hidden";
    div.style.whiteSpace = el.tagName === "TEXTAREA" ? "pre-wrap" : "nowrap";
    div.style.textOverflow = "ellipsis";
    div.style.minHeight = div.style.minHeight || `${rect.height}px`;

    // Force dark text if the color is too light (white text on white bg)
    const colorRGB = computed.color;
    if (colorRGB) {
      const match = colorRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 200) {
          // Text is very light — force it dark for white background PDF
          div.style.color = "#111111";
        }
      }
    }

    // If bg is too dark, force it light
    const bgRGB = computed.backgroundColor;
    if (bgRGB && bgRGB !== "rgba(0, 0, 0, 0)" && bgRGB !== "transparent") {
      const match = bgRGB.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 50) {
          div.style.backgroundColor = "#f0f0f0";
        }
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
 * Slice a tall canvas into page-sized chunks.
 * Returns an array of canvas objects, each fitting within maxHeight.
 */
function sliceCanvas(sourceCanvas, maxHeightPx) {
  const slices = [];
  const totalHeight = sourceCanvas.height;
  const width = sourceCanvas.width;
  let y = 0;

  while (y < totalHeight) {
    const sliceHeight = Math.min(maxHeightPx, totalHeight - y);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = width;
    sliceCanvas.height = sliceHeight;
    const ctx = sliceCanvas.getContext("2d");
    ctx.drawImage(
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
    slices.push(sliceCanvas);
    y += sliceHeight;
  }

  return slices;
}

export function PdfReportPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing sections…");

  const SECTIONS = [
    { id: "pdf-section-profile", label: "Player Profile" },
    { id: "pdf-section-touches", label: "Total Touches" },
    { id: "pdf-section-evaluation-1", label: "Player Evaluation (Part 1)" },
    { id: "pdf-section-evaluation-2", label: "Player Evaluation (Part 2)" },
    { id: "pdf-section-evaluation-3", label: "Player Evaluation (Part 3)" },
    { id: "pdf-section-evaluation-4", label: "Player Evaluation (Part 4)" },
    { id: "pdf-section-evaluation-5", label: "Player Evaluation (Part 5)" },
    { id: "pdf-section-reflection-1", label: "Player Reflection (Part 1)" },
    { id: "pdf-section-reflection-2", label: "Player Reflection (Part 2)" },
    { id: "pdf-section-reflection-3", label: "Player Reflection (Part 3)" },
    { id: "pdf-section-grade-1", label: "Player Grade (Part 1)" },
    { id: "pdf-section-grade-2", label: "Player Grade (Part 2)" },
    { id: "pdf-section-grade-3", label: "Player Grade (Part 3)" },
    { id: "pdf-section-grade-4", label: "Player Grade (Part 4)" },
    { id: "pdf-section-formation", label: "Starting Lineup" },
    { id: "pdf-section-note-1", label: "Note to Coach (Part 1)" },
    { id: "pdf-section-note-2", label: "Note to Coach (Part 2)" },
    { id: "pdf-section-note-3", label: "Note to Coach (Part 3)" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => generatePDF(), 2500);
    return () => clearTimeout(timer);
  }, []);

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      // Pixels-per-mm ratio at scale=2
      const scale = 2;

      let currentY = margin;

      for (let i = 0; i < SECTIONS.length; i++) {
        const { id, label } = SECTIONS[i];
        const sectionEl = document.getElementById(id);

        setStatus(`Capturing ${label}…`);
        setProgress(Math.round(((i + 0.5) / SECTIONS.length) * 90));

        if (!sectionEl) continue;

        // Prepare inputs → text divs
        const cleanup = prepareInputsForCapture(sectionEl);

        const canvas = await html2canvas(sectionEl, {
          scale,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 0,
        });

        cleanup();

        const imgWidthMM = contentW;
        const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;

        // Check if fits on current page. If not, add a new page.
        // We add a tiny buffer (2mm) to prevent extreme tight fits.
        if (currentY + imgHeightMM > pageH - margin && currentY > margin) {
          // Doesn't fit on this page, push to next
          pdf.addPage();
          currentY = margin;
        }

        if (imgHeightMM <= contentH) {
          // Fits on a single page, draw at currentY
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.92),
            "JPEG",
            margin,
            currentY,
            imgWidthMM,
            imgHeightMM,
          );
          currentY += imgHeightMM + 4; // Add a 4mm gap between sections
        } else {
          // Fallback slice mode (should not happen with aggressive splitting)
          const maxSliceHeightPx = (contentH / imgWidthMM) * canvas.width;
          const slices = sliceCanvas(canvas, maxSliceHeightPx);

          for (let s = 0; s < slices.length; s++) {
            if (s > 0 || currentY > margin) {
              pdf.addPage();
              currentY = margin;
            }
            const sliceImgH = (slices[s].height * imgWidthMM) / slices[s].width;
            pdf.addImage(
              slices[s].toDataURL("image/jpeg", 0.92),
              "JPEG",
              margin,
              currentY,
              imgWidthMM,
              sliceImgH,
            );
            currentY += sliceImgH + 4;
          }
        }

        setProgress(Math.round(((i + 1) / SECTIONS.length) * 90));
      }

      // Download
      setStatus("Downloading PDF…");
      setProgress(100);

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `player-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await new Promise((r) => setTimeout(r, 800));
      navigate(-1);
    } catch (err) {
      console.error("PDF generation error:", err);
      setStatus("Error — going back…");
      await new Promise((r) => setTimeout(r, 2000));
      navigate(-1);
    }
  };

  return (
    <>
      {/* ── Loading overlay ── */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm">
        <div className="bg-[#111] rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[var(--color-accent)] animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-black uppercase text-white mb-2">
                Generating PDF Report
              </h3>
              <p className="text-sm text-gray-400">{status}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{progress}% complete</p>
          </div>
        </div>
      </div>

      {/* ── Sections rendered with FORCED LIGHT theme for readable PDF ── */}
      <div
        ref={containerRef}
        className="max-w-md mx-auto px-4 py-6"
        style={{
          backgroundColor: "#ffffff",
          color: "#111111",
          "--bg-primary": "#ffffff",
          "--bg-secondary": "#f5f5f5",
          "--bg-card": "#f9f9f9",
          "--bg-input": "#f0f0f0",
          "--text-primary": "#111111",
          "--text-secondary": "#444444",
          "--border-color": "#cccccc",
          "--color-accent": "#E63422",
          "--color-accent-hover": "#cc2d1d",
          "--category-header-bg": "#222222",
          "--category-header-text": "#ffffff",
          "--ball-fill": "#E63422",
          "--ball-stroke": "#111111",
          "--ball-stroke-width": "3",
        }}
      >
        <div
          id="pdf-section-profile"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerProfile />
        </div>
        <div
          id="pdf-section-touches"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <LiveStats />
        </div>
        <div
          id="pdf-section-evaluation-1"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerEvaluation isPdf={true} pdfPart={1} />
        </div>
        <div
          id="pdf-section-evaluation-2"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerEvaluation isPdf={true} pdfPart={2} />
        </div>
        <div
          id="pdf-section-evaluation-3"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerEvaluation isPdf={true} pdfPart={3} />
        </div>
        <div
          id="pdf-section-evaluation-4"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerEvaluation isPdf={true} pdfPart={4} />
        </div>
        <div
          id="pdf-section-evaluation-5"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerEvaluation isPdf={true} pdfPart={5} />
        </div>
        <div
          id="pdf-section-reflection-1"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerReflection isPdf={true} pdfPart={1} />
        </div>
        <div
          id="pdf-section-reflection-2"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerReflection isPdf={true} pdfPart={2} />
        </div>
        <div
          id="pdf-section-reflection-3"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerReflection isPdf={true} pdfPart={3} />
        </div>
        <div
          id="pdf-section-grade-1"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerAttendanceGrade isPdf={true} pdfPart={1} />
        </div>
        <div
          id="pdf-section-grade-2"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerAttendanceGrade isPdf={true} pdfPart={2} />
        </div>
        <div
          id="pdf-section-grade-3"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerAttendanceGrade isPdf={true} pdfPart={3} />
        </div>
        <div
          id="pdf-section-grade-4"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <PlayerAttendanceGrade isPdf={true} pdfPart={4} />
        </div>
        <div
          id="pdf-section-formation"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <FootballFormation />
        </div>
        <div
          id="pdf-section-note-1"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <NoteToCoach isPdf={true} pdfPart={1} />
        </div>
        <div
          id="pdf-section-note-2"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <NoteToCoach isPdf={true} pdfPart={2} />
        </div>
        <div
          id="pdf-section-note-3"
          className="mb-6 p-4 rounded-lg"
          style={{ background: "#fff" }}
        >
          <NoteToCoach isPdf={true} pdfPart={3} />
        </div>
      </div>
    </>
  );
}
