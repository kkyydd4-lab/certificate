"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Expand, ShieldAlert } from "lucide-react";

interface UseExamSecurityProps {
    onViolation?: (type: "focus_loss" | "visibility_change" | "copy_paste") => void;
}

export function useExamSecurity({ onViolation }: UseExamSecurityProps = {}) {
    const [warnings, setWarnings] = useState<number>(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const router = useRouter();

    // Prevent Copy/Paste/Right Click
    useEffect(() => {
        const preventDefault = (e: Event) => {
            e.preventDefault();
            if (onViolation) onViolation("copy_paste");
            setWarnings(prev => prev + 1);
        };

        window.addEventListener("copy", preventDefault);
        window.addEventListener("paste", preventDefault);
        window.addEventListener("cut", preventDefault);
        window.addEventListener("contextmenu", preventDefault);

        return () => {
            window.removeEventListener("copy", preventDefault);
            window.removeEventListener("paste", preventDefault);
            window.removeEventListener("cut", preventDefault);
            window.removeEventListener("contextmenu", preventDefault);
        };
    }, [onViolation]);

    // Visiblity Change (Tab Switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (onViolation) onViolation("visibility_change");
                setWarnings(prev => prev + 1);
                alert("경고: 시험 화면을 벗어나면 부정행위로 간주될 수 있습니다.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleVisibilityChange);
        };
    }, [onViolation]);

    // Enter Full Screen
    const requestFullScreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } catch (e) {
            console.error("Full screen denied", e);
        }
    };

    return {
        warnings,
        isFullScreen,
        requestFullScreen
    };
}
