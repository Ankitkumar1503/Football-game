// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// /**
//  * Final PDF Generator
//  * - Rendering: purana code (jo theek tha)
//  * - Page size: dynamic per section (cursor ka fix)
//  * = No splitting + correct content
//  */

// export async function generateProfessionalPDF() {
//   try {
//     const pageWidth = 210; // A4 width fixed (mm)
//     const margin = 15; // 15mm top + 15mm bottom = 30mm total
//     const contentWidth = pageWidth - margin * 2;

//     const sections = [
//       "player-info-section",
//       "player-stats-section",
//       "touches-section",
//       "total-touches-section",
//       "player-evaluations",
//       "player-reflection",
//       "player-grade-section",
//       "starting-lineup-section",
//       "note-to-coach-section",
//     ];

//     // Rule: Each section ID renders EXACTLY ONCE — no duplicates
//     const uniqueSections = [...new Set(sections)];

//     const trimVertical = (sourceCanvas) => {
//       const ctx = sourceCanvas.getContext("2d");
//       if (!ctx) return sourceCanvas;

//       const { width, height } = sourceCanvas;

//       // Determine "background" color from the first pixel.
//       // Works for both transparent captures and solid backgrounds.
//       const bg = ctx.getImageData(0, 0, 1, 1).data; // [r,g,b,a]
//       const tol = 6;

//       const isRowBlank = (row) => {
//         const data = ctx.getImageData(0, row, width, 1).data;
//         for (let i = 0; i < data.length; i += 4) {
//           const r = data[i];
//           const g = data[i + 1];
//           const b = data[i + 2];
//           const a = data[i + 3];

//           // If the background is transparent (a==0), treat any non-transparent as content.
//           if (bg[3] === 0) {
//             if (a !== 0) return false;
//             continue;
//           }

//           // Otherwise compare to background rgb; ignore small noise.
//           if (
//             Math.abs(r - bg[0]) > tol ||
//             Math.abs(g - bg[1]) > tol ||
//             Math.abs(b - bg[2]) > tol ||
//             Math.abs(a - bg[3]) > tol
//           ) {
//             return false;
//           }
//         }
//         return true;
//       };

//       let top = 0;
//       while (top < height && isRowBlank(top)) top++;

//       let bottom = height - 1;
//       while (bottom > top && isRowBlank(bottom)) bottom--;

//       top = Math.max(0, top - 2);
//       bottom = Math.min(height - 1, bottom + 2);

//       const newHeight = bottom - top + 1;
//       if (newHeight <= 0 || newHeight === height) return sourceCanvas;

//       const trimmed = document.createElement("canvas");
//       trimmed.width = width;
//       trimmed.height = newHeight;
//       trimmed
//         .getContext("2d")
//         .drawImage(sourceCanvas, 0, top, width, newHeight, 0, 0, width, newHeight);
//       return trimmed;
//     };

//     let pdf = null;
//     let isFirstPage = true;

//     for (const sectionId of uniqueSections) {
//       const sectionElement = document.getElementById(sectionId);

//       if (!sectionElement) {
//         console.warn(`Section ${sectionId} not found, skipping...`);
//         continue;
//       }

//       // Rules:
//       // - scale: 2
//       // - backgroundColor: null (use element background)
//       // - scrollY: -window.scrollY
//       // - windowWidth: document.documentElement.offsetWidth
//       const rawCanvas = await html2canvas(sectionElement, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: null,
//         logging: false,
//         imageTimeout: 0,
//         removeContainer: true,
//         allowTaint: false,
//         foreignObjectRendering: false,
//         scrollY: -window.scrollY,
//         windowWidth: document.documentElement.offsetWidth,
//       });

//       // Fix extra empty space (e.g. evaluations whitespace) even on solid backgrounds
//       const canvas = trimVertical(rawCanvas);

//       // Dynamic page height per section: format: [210, sectionHeightMM + 30]
//       const sectionHeightMM = (canvas.height * contentWidth) / canvas.width;
//       const pageHeight = sectionHeightMM + margin * 2;

//       if (isFirstPage) {
//         pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "mm",
//           format: [pageWidth, pageHeight],
//         });
//         isFirstPage = false;
//       } else {
//         pdf.addPage([pageWidth, pageHeight], "portrait");
//       }

//       const imgData = canvas.toDataURL("image/jpeg", 0.8);

//       // Place at top with 15mm margin
//       pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, sectionHeightMM);
//     }

//     return pdf.output("blob");
//   } catch (error) {
//     console.error("PDF Generation Error:", error);
//     throw error;
//   }
// }

// /**
//  * Alternative: Section-by-section approach for even better control
//  */
// export async function generateProfessionalPDFV2() {
//     try {
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const margin = 15;

//         // Page 1: Player Info & Stats
//         await addSectionToPDF(pdf, 'player-info-section', margin, margin, pageWidth - (margin * 2));

//         // Page 2: Touches
//         pdf.addPage();
//         await addSectionToPDF(pdf, 'touches-section', margin, margin, pageWidth - (margin * 2));

//         // Page 3: Total Touches & Start of Evaluations
//         pdf.addPage();
//         let yPos = margin;
//         yPos = await addSectionToPDF(pdf, 'total-touches-section', margin, yPos, pageWidth - (margin * 2));

//         // Check if evaluations fit
//         const evalHeight = await getSectionHeight('player-evaluations', pageWidth - (margin * 2));
//         if (yPos + evalHeight > pageHeight - margin) {
//             pdf.addPage();
//             yPos = margin;
//         }
//         await addSectionToPDF(pdf, 'player-evaluations', margin, yPos, pageWidth - (margin * 2));

//         // Page 4+: Reflection
//         pdf.addPage();
//         await addSectionToPDF(pdf, 'player-reflection', margin, margin, pageWidth - (margin * 2));

//         // Page 5+: Profiles
//         pdf.addPage();
//         await addSectionToPDF(pdf, 'player-profiles-section', margin, margin, pageWidth - (margin * 2));

//         return pdf.output('blob');

//     } catch (error) {
//         console.error('PDF Generation Error:', error);
//         throw error;
//     }
// }

// /**
//  * Helper: Add a section to PDF and return new Y position
//  */
// async function addSectionToPDF(pdf, sectionId, x, y, width) {
//     const element = document.getElementById(sectionId);
//     if (!element) return y;

//     const canvas = await html2canvas(element, {
//         scale: 1.5,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false
//     });

//     const imgData = canvas.toDataURL('image/jpeg', 0.7);
//     const imgHeight = (canvas.height * width) / canvas.width;

//     pdf.addImage(imgData, 'JPEG', x, y, width, imgHeight);

//     return y + imgHeight + 5;
// }

// /**
//  * Helper: Get section height without adding to PDF
//  */
// async function getSectionHeight(sectionId, width) {
//     const element = document.getElementById(sectionId);
//     if (!element) return 0;

//     const canvas = await html2canvas(element, {
//         scale: 1.5,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false
//     });

//     return (canvas.height * width) / canvas.width;
// }