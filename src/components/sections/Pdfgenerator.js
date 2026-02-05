import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Professional PDF Generator
 * Features:
 * - Proper page breaks (no content splitting)
 * - Optimized file size (compressed images)
 * - Better UX (no white screen)
 */

export async function generateProfessionalPDF() {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Define sections with their IDs - these should match your HTML element IDs
        const sections = [
            'player-info-section',      // Player header and basic info
            'player-stats-section',     // Player statistics
            'touches-section',          // Touches visualization
            'total-touches-section',    // Total touches table
            'player-evaluations',       // Evaluations section
            'player-reflection',        // Reflection section
            'player-profiles-section'   // Player profiles by position
        ];

        let isFirstPage = true;
        let yPosition = margin;

        // Process each section
        for (let i = 0; i < sections.length; i++) {
            const sectionElement = document.getElementById(sections[i]);

            if (!sectionElement) {
                console.warn(`Section ${sections[i]} not found, skipping...`);
                continue;
            }

            // Create canvas with optimized settings
            const canvas = await html2canvas(sectionElement, {
                scale: 1.5,  // Reduced from 2 for smaller file size
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 0,
                removeContainer: true,
                allowTaint: false,
                foreignObjectRendering: false  // Better compatibility
            });

            // Compress image to reduce file size
            const imgData = canvas.toDataURL('image/jpeg', 0.7);  // JPEG with 70% quality

            // Calculate dimensions
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Check if we need a new page
            if (!isFirstPage && (yPosition + imgHeight > pageHeight - margin)) {
                pdf.addPage();
                yPosition = margin;
            }

            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);

            // Update position for next section
            yPosition += imgHeight + 10; // 10mm spacing between sections

            // If content extends beyond page, start fresh page for next section
            if (yPosition > pageHeight - margin - 20) {
                pdf.addPage();
                yPosition = margin;
            }

            isFirstPage = false;
        }

        // Return as blob
        return pdf.output('blob');

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
}

/**
 * Alternative: Section-by-section approach for even better control
 */
export async function generateProfessionalPDFV2() {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;

        // Page 1: Player Info & Stats
        await addSectionToPDF(pdf, 'player-info-section', margin, margin, pageWidth - (margin * 2));

        // Page 2: Touches
        pdf.addPage();
        await addSectionToPDF(pdf, 'touches-section', margin, margin, pageWidth - (margin * 2));

        // Page 3: Total Touches & Start of Evaluations
        pdf.addPage();
        let yPos = margin;
        yPos = await addSectionToPDF(pdf, 'total-touches-section', margin, yPos, pageWidth - (margin * 2));

        // Check if evaluations fit
        const evalHeight = await getSectionHeight('player-evaluations', pageWidth - (margin * 2));
        if (yPos + evalHeight > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
        }
        await addSectionToPDF(pdf, 'player-evaluations', margin, yPos, pageWidth - (margin * 2));

        // Page 4+: Reflection
        pdf.addPage();
        await addSectionToPDF(pdf, 'player-reflection', margin, margin, pageWidth - (margin * 2));

        // Page 5+: Profiles
        pdf.addPage();
        await addSectionToPDF(pdf, 'player-profiles-section', margin, margin, pageWidth - (margin * 2));

        return pdf.output('blob');

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
}

/**
 * Helper: Add a section to PDF and return new Y position
 */
async function addSectionToPDF(pdf, sectionId, x, y, width) {
    const element = document.getElementById(sectionId);
    if (!element) return y;

    const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.7);
    const imgHeight = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'JPEG', x, y, width, imgHeight);

    return y + imgHeight + 5; // Return new Y position with spacing
}

/**
 * Helper: Get section height without adding to PDF
 */
async function getSectionHeight(sectionId, width) {
    const element = document.getElementById(sectionId);
    if (!element) return 0;

    const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    });

    return (canvas.height * width) / canvas.width;
}