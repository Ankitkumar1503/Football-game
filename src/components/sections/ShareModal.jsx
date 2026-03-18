import React, { useState } from 'react';
import { X, MessageCircle, Send, Mail, Link2, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function ShareModal({ isOpen, onClose, sessionId }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // Generate shareable link (you can modify this based on your routing)
    const shareUrl = `${window.location.origin}/session/${sessionId}`;
    const shareTitle = 'Check out my football performance report!';
    const shareText = `I just completed my football training session. Check out my performance metrics and reflections!`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // const handleWhatsAppShare = () => {
    //     const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    //     window.open(url, '_blank');
    // };

    // const handleTelegramShare = () => {
    //     const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    //     window.open(url, '_blank');
    // };

    // const handleEmailShare = () => {
    //     const subject = encodeURIComponent(shareTitle);
    //     const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    //     window.location.href = `mailto:?subject=${subject}&body=${body}`;
    // };

    // const handleTeamsShare = () => {
    //     const url = `https://teams.microsoft.com/share?href=${encodeURIComponent(shareUrl)}&msgText=${encodeURIComponent(shareText)}`;
    //     window.open(url, '_blank');
    // };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        }
    };

    // const shareOptions = [
    //     {
    //         name: 'WhatsApp',
    //         icon: MessageCircle,
    //         color: 'bg-[#25D366] hover:bg-[#20BD5A]',
    //         onClick: handleWhatsAppShare
    //     },
    //     {
    //         name: 'Telegram',
    //         icon: Send,
    //         color: 'bg-[#0088cc] hover:bg-[#006699]',
    //         onClick: handleTelegramShare
    //     },
    //     {
    //         name: 'Email',
    //         icon: Mail,
    //         color: 'bg-[#EA4335] hover:bg-[#D33426]',
    //         onClick: handleEmailShare
    //     },
    //     {
    //         name: 'Teams',
    //         icon: Download,
    //         color: 'bg-[#6264A7] hover:bg-[#505194]',
    //         onClick: handleTeamsShare
    //     }
    // ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-white dark:bg-[#1A1A1A] border-2 border-[#FF4422]/30 shadow-2xl animate-slide-up">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black uppercase text-black dark:text-white">
                            Share Report
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Share Options Grid */}
                    {/* <div className="grid grid-cols-2 gap-3 mb-6">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={option.onClick}
                                className={`${option.color} text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-all transform hover:scale-105 active:scale-95`}
                            >
                                <option.icon className="w-6 h-6" />
                                <span className="text-sm font-bold">{option.name}</span>
                            </button>
                        ))}
                    </div> */}

                    {/* Native Share (if available) */}
                    {navigator.share && (
                        <Button
                            onClick={handleNativeShare}
                            className="w-full mb-4 bg-gradient-to-r from-[#FF4422] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF4422] text-white font-bold transition-all"
                        >
                            More Sharing Options
                        </Button>
                    )}

                    {/* Copy Link */}
                    {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                            Or copy link
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4422]"
                            />
                            <Button
                                onClick={handleCopyLink}
                                className={`px-4 transition-all ${copied
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-[#FF4422] hover:bg-[#FF6B35]'
                                    }`}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-1">
                                        <span className="text-sm">✓</span>
                                        Copied
                                    </span>
                                ) : (
                                    <Link2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div> */}
                </div>
            </Card>

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}