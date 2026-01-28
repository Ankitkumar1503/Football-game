import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { MessageSquare, Save, RotateCcw, Share2, Download } from 'lucide-react';
import { useActiveSession } from '../../hooks/useActiveSession';
import { db } from '../../lib/db';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WELL_DONE_TAGS = [
    'ATTACKING', 'FREE KICKS', 'LEADERSHIP',
    'FINISHING', 'MARKING', 'DECISIONS',
    'DEFENDING', 'SPEED', 'SUPPORT',
    'TACKLING', 'PENALTIES', 'CREATE SPACE',
    'LONG BALLS', 'ENDURANCE', 'BALL CONTROL',
    'TRAPPING', 'CORNERS', 'THROW-IN',
    'TRANSITION', 'PASSING', 'HEADING'
];

const PERFORMANCE_METRICS = [
    'ENDURANCE', 'FIRST TOUCH',
    'ENERGY', 'PASSING',
    'DECISION MAKING', 'RECEIVING',
    'CONFIDENCE', 'WILL',
    'MOTIVATION', 'FITNESS'
];

export function PlayerReflection() {
    const { sessionId, reflection, updateReflection } = useActiveSession();

    // Local state
    const [formData, setFormData] = useState({
        wellDoneTags: [],
        achievedGoal: '',
        whatLearned: '',
        whatWouldChange: '',
        detailedPerformance: {}
    });

    // Sync with DB
    useEffect(() => {
        if (reflection) {
            const newData = {
                wellDoneTags: reflection.wellDoneTags || [],
                achievedGoal: reflection.achievedGoal || '',
                whatLearned: reflection.whatLearned || '',
                whatWouldChange: reflection.whatWouldChange || '',
                detailedPerformance: reflection.detailedPerformance || {}
            };

            // Deep compare to prevent infinite loops if objects are referentially different but value-equal
            if (JSON.stringify(formData) !== JSON.stringify(newData)) {
                setFormData(newData);
            }
        }
    }, [reflection, formData]);

    // Handlers
    const handleTagToggle = async (tag) => {
        const currentTags = formData.wellDoneTags;
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];

        setFormData(prev => ({ ...prev, wellDoneTags: newTags }));
        await updateReflection({ wellDoneTags: newTags });
    };

    const handleTextChange = async (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Debounce saving could be added here, but for now simple update
        // To be safe with rapid typing, usually we debounce. 
        // I will just save on blur or use a simple timeout if I could, 
        // but given the tool limitations I'll just save immediately or maybe add a slight delay?
        // Actually, let's just save. IndexedDB is fast enough for text updates normally.
        await updateReflection({ [id]: value });
    };

    const handleMetricChange = async (metric, value) => {
        const newMetrics = {
            ...formData.detailedPerformance,
            [metric]: parseInt(value)
        };
        setFormData(prev => ({ ...prev, detailedPerformance: newMetrics }));
        await updateReflection({ detailedPerformance: newMetrics });
    };

    return (
        <Card className="mb-24 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
            <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-4 border-b-4 border-black dark:border-white pb-2">
                    <h2 className="text-2xl font-black uppercase text-black dark:text-white">PLAYER REFLECTION</h2>
                </div>

                {/* What did you do well? */}
                <div className="mb-6">
                    <h3 className="text-sm font-black uppercase mb-3 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-1">WHAT DID YOU DO WELL:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {WELL_DONE_TAGS.map(tag => (
                            <label key={tag} className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${formData.wellDoneTags.includes(tag) ? 'bg-[#FF4422] border-[#FF4422]' : 'border-gray-400 bg-transparent'}`}>
                                    {formData.wellDoneTags.includes(tag) && <span className="text-white font-bold text-xs">✓</span>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.wellDoneTags.includes(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                />
                                <span className="text-[10px] md:text-xs font-bold uppercase text-gray-700 dark:text-gray-300">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Text Inputs */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="achievedGoal" className="block text-sm font-black uppercase mb-1 text-black dark:text-white">DID YOU ACHIEVE YOUR GOAL?</label>
                        <input
                            id="achievedGoal"
                            type="text"
                            value={formData.achievedGoal}
                            onChange={handleTextChange}
                            className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] border border-black/10 p-2 text-sm font-medium focus:outline-none focus:border-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label htmlFor="whatLearned" className="block text-sm font-black uppercase mb-1 text-black dark:text-white">WHAT DID YOU LEARN?</label>
                        <input
                            id="whatLearned"
                            type="text"
                            value={formData.whatLearned}
                            onChange={handleTextChange}
                            className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] border border-black/10 p-2 text-sm font-medium focus:outline-none focus:border-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label htmlFor="whatWouldChange" className="block text-sm font-black uppercase mb-1 text-black dark:text-white">WHAT WOULD YOU CHANGE?</label>
                        <input
                            id="whatWouldChange"
                            type="text"
                            value={formData.whatWouldChange}
                            onChange={handleTextChange}
                            className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] border border-black/10 p-2 text-sm font-medium focus:outline-none focus:border-[#FF4422]"
                        />
                    </div>
                </div>

                {/* Performance Metrics */}
                <div>
                    <h3 className="text-sm font-black uppercase mb-4 text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-1">
                        REFLECT ON YOUR GAME PERFORMANCE: 1-10
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {PERFORMANCE_METRICS.map(metric => (
                            <div key={metric} className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 w-32">{metric}</span>
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={formData.detailedPerformance[metric] || 5}
                                        onChange={(e) => handleMetricChange(metric, e.target.value)}
                                        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#FF4422]"
                                    />
                                    <span className="text-xs font-black text-[#FF4422] w-4 text-right">{formData.detailedPerformance[metric] || 5}</span>
                                </div>
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

    const handleReset = async () => {
        if (!sessionId) return;

        if (confirm('Are you sure you want to reset this session? This will delete all touches and reflections and start a fresh match.')) {
            try {
                // Delete all touches for this session
                await db.touches.where('sessionId').equals(sessionId).delete();
                // Delete reflection
                await db.reflections.where('sessionId').equals(sessionId).delete();

                // Reload to refresh all state and start "fresh" with the same session ID
                window.location.reload();
            } catch (error) {
                console.error('Error resetting session:', error);
            }
        }
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        const element = document.getElementById('printable-dashboard');
        if (!element) return;

        try {
            // Apply print mode styles
            element.classList.add('print-mode');

            // Hide bottom bar for screenshot
            const bottomBar = document.getElementById('bottom-bar-container');
            if (bottomBar) bottomBar.style.display = 'none';

            // Wait for styles to apply (short delay for React/Browser paint)
            await new Promise(resolve => setTimeout(resolve, 200));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff', // Force white background for report
                scrollY: -window.scrollY
            });

            // Restore state immediately
            element.classList.remove('print-mode');
            if (bottomBar) bottomBar.style.display = 'block';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calculate height to fit width
            const imgFitWidth = pdfWidth;
            const imgFitHeight = (imgHeight * pdfWidth) / imgWidth;

            let heightLeft = imgFitHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgFitWidth, imgFitHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgFitHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgFitWidth, imgFitHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`player-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            // Cleanup on error
            element.classList.remove('print-mode');
            const bottomBar = document.getElementById('bottom-bar-container');
            if (bottomBar) bottomBar.style.display = 'block';
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        // Data is already auto-saved, but we can show a confirmation
        alert('Session saved successfully!');
    };

    return (
        <div id="bottom-bar-container" className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#FF4422]/20 z-50">
            <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-[#FF4422]/20 hover:border-[#FF4422]/40 transition-all"
                    onClick={handleReset}
                >
                    <RotateCcw className="size-4" />
                    <span className="text-[10px]">Reset</span>
                </Button>
                <Button variant="secondary" size="sm" className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-[#FF4422]/20 hover:border-[#FF4422]/40 transition-all">
                    <Share2 className="size-4" />
                    <span className="text-[10px]">Share</span>
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-col gap-1 py-3 h-auto bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 border-[#FF4422]/20 hover:border-[#FF4422]/40 transition-all"
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                >
                    <Download className="size-4" />
                    <span className="text-[10px]">{isGenerating ? '...' : 'PDF'}</span>
                </Button>
                <Button
                    variant="primary"
                    className="flex-col gap-1 py-3 h-auto shadow-lg shadow-[#FF4422]/40 bg-[#FF4422] hover:bg-[#FF6B35] border-none text-white transition-all"
                    onClick={handleSave}
                >
                    <Save className="size-4" />
                    <span className="text-[10px]">Save</span>
                </Button>
            </div>
        </div>
    );
}
