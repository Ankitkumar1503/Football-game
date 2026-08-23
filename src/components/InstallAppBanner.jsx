import React, { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X, Smartphone, Check } from "lucide-react";

let globalDeferredPrompt = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    window.dispatchEvent(new CustomEvent("pwa-installable"));
  });
}

export function InstallAppBanner({ className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(isStandaloneMode));
    };

    // Check iOS user agent
    const checkIOS = () => {
      const ua = window.navigator.userAgent || "";
      const isIOSDevice =
        /iphone|ipad|ipod/i.test(ua) ||
        (window.navigator.maxTouchPoints > 0 && /macintosh/i.test(ua));
      setIsIOS(isIOSDevice);
    };

    checkStandalone();
    checkIOS();

    const handleInstallable = (e) => {
      if (e && e.preventDefault && e !== window) {
        e.preventDefault();
        globalDeferredPrompt = e;
      }
      setDeferredPrompt(globalDeferredPrompt);
    };

    window.addEventListener("beforeinstallprompt", handleInstallable);
    window.addEventListener("pwa-installable", handleInstallable);

    // Also listen for appinstalled event
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallable);
      window.removeEventListener("pwa-installable", handleInstallable);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || globalDeferredPrompt;
    if (!promptEvent) return;

    try {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(`[PWA INSTALL] User response outcome: ${outcome}`);
      if (outcome === "accepted") {
        setInstalledSuccess(true);
      }
    } catch (err) {
      console.error("[PWA INSTALL] Error prompting install:", err);
    } finally {
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    }
  };

  // If already running in standalone PWA mode or dismissed, don't display
  if (isStandalone || dismissed) {
    return null;
  }

  if (installedSuccess) {
    return (
      <div className={`rounded-xl p-3 bg-emerald-950/80 border border-emerald-500/40 text-white flex items-center justify-between shadow-lg ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              App Installed!
            </h4>
            <p className="text-[10px] text-white/70">
              TOUCHES is now added to your home screen.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/50 hover:text-white p-1"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // 1. iOS Safari Instruction Banner
  if (isIOS) {
    return (
      <div className={`relative rounded-xl p-3.5 bg-gradient-to-r from-[#141926] via-[#101420] to-[#171120] border-2 border-[#00AEEF]/50 shadow-xl text-white space-y-2 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center flex-shrink-0 border border-[#00AEEF]/30">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00AEEF]/20 text-[#00AEEF] text-[8px] font-black uppercase tracking-wider">
                iPhone / iPad App
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                INSTALL TOUCHES APP
              </h3>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/40 hover:text-white transition-colors"
            title="Close banner"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-[11px] text-white/90 font-medium space-y-1">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>On iPhone: tap</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/15 text-white font-bold text-[10px] border border-white/20">
              <Share size={12} className="text-[#00AEEF]" /> Share
            </span>
            <span>→</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/15 text-white font-bold text-[10px] border border-white/20">
              <PlusSquare size={12} className="text-emerald-400" /> Add to Home Screen
            </span>
          </p>
        </div>
      </div>
    );
  }

  // 2. Android / Desktop Chrome / Edge Install Banner
  return (
    <div className={`relative rounded-xl p-3.5 bg-gradient-to-r from-[#171424] via-[#121624] to-[#1E1119] border-2 border-[#FF4422]/60 shadow-2xl text-white space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4422]/20 text-[#FF4422] flex items-center justify-center flex-shrink-0 border border-[#FF4422]/40 shadow-md">
            <Download size={22} className="animate-bounce" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FF4422]/20 text-[#FF4422] text-[8px] font-black uppercase tracking-widest">
              ⚡ App Experience
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Install TOUCHES App
            </h3>
            <p className="text-[10px] text-white/70 font-medium">
              Open without browser bars & access offline anytime
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-white/40 hover:text-white transition-colors"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <div className="pt-0.5">
        <button
          onClick={handleInstallClick}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#FF4422] to-[#FF6600] hover:from-[#FF5533] hover:to-[#FF7711] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FF4422]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Download size={15} />
          <span>INSTALL APP NOW</span>
        </button>
      </div>
    </div>
  );
}
