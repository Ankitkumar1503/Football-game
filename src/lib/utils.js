import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function isMobileDevice() {
    if (typeof window === "undefined") return false;

    // Allow URL testing overrides if present (e.g. ?test_mobile=1 or ?test_desktop=1)
    const urlParams = new URLSearchParams(window.location.search);
    if (
        urlParams.get("test_mobile") === "1" ||
        urlParams.get("test_ios_chrome") === "1" ||
        urlParams.get("test_ios_safari") === "1"
    ) {
        return true;
    }
    if (urlParams.get("test_desktop") === "1") {
        return false;
    }

    const ua = window.navigator.userAgent || window.navigator.vendor || window.opera || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(ua);
    const isTouchDevice = ("ontouchstart" in window) || (window.navigator.maxTouchPoints > 0);
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

    return isMobileUA || (isTouchDevice && isSmallScreen);
}

