import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-8 font-sans"
      style={{ backgroundColor: "var(--t-surface)" }}
    >
      {/* 404 number */}
      <div
        className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter select-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "2px var(--t-border)",
          opacity: 0.6,
        }}
      >
        404
      </div>

      {/* Message */}
      <h1
        className="text-2xl font-bold mt-2 mb-2"
        style={{ color: "var(--t-t1)" }}
      >
        Page not found
      </h1>
      <p
        className="text-sm mb-8 text-center max-w-xs"
        style={{ color: "var(--t-t2)" }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: "var(--color-accent)",
          boxShadow: "0 8px 24px rgba(255,107,107,0.2)",
        }}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        Back to portfolio
      </button>
    </div>
  );
}
