import React, { useEffect, useState } from "react";

const SPLASH_KEY = "luai_splash_shown";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("show"); // 'show' | 'fadeout' | 'done'

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(SPLASH_KEY)) {
      onDone();
      return;
    }
    sessionStorage.setItem(SPLASH_KEY, "1");

    // Hold for 1.6s then fade out
    const hold = setTimeout(() => setPhase("fadeout"), 1600);
    // After fade (400ms) signal done
    const done = setTimeout(() => { setPhase("done"); onDone(); }, 2000);

    return () => { clearTimeout(hold); clearTimeout(done); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F2]"
      style={{
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      {/* Animated "L" logo */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer ring pulse */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "rgba(255,107,107,0.12)",
            animation: "splash-ring 1.4s ease-in-out infinite",
          }}
        />
        {/* Inner card */}
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6B6B] shadow-2xl shadow-[#FF6B6B]/30"
          style={{ animation: "splash-pop 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="text-3xl font-bold text-white">L</span>
        </div>
      </div>

      {/* Name */}
      <div
        className="mt-5 text-center"
        style={{ animation: "splash-fade 0.5s ease 0.3s both" }}
      >
        <p className="text-lg font-bold text-[#1A1715] tracking-tight">Luai</p>
        <p className="text-xs text-[#A9A29A] tracking-widest uppercase mt-0.5">lewispace.dev</p>
      </div>

      {/* Loading bar */}
      <div
        className="mt-8 h-0.5 w-24 rounded-full bg-[#EFEBE4] overflow-hidden"
        style={{ animation: "splash-fade 0.5s ease 0.4s both" }}
      >
        <div
          className="h-full rounded-full bg-[#FF6B6B]"
          style={{ animation: "splash-bar 1.3s cubic-bezier(0.4,0,0.2,1) 0.2s both" }}
        />
      </div>

      <style>{`
        @keyframes splash-pop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-ring {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes splash-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
