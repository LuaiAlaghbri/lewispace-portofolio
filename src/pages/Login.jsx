import React, { useState } from "react";

const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "luai_admin_session";

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4 font-sans"
      style={{ backgroundColor: "var(--t-surface)" }}
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-10 shadow-xl transition-transform ${shake ? "animate-shake" : ""}`}
        style={{
          border: "1px solid var(--t-border)",
          backgroundColor: "var(--t-raised)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{ backgroundColor: "var(--color-accent)", boxShadow: "0 8px 24px rgba(255,107,107,0.3)" }}
          >
            L
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--t-t1)" }}>Admin Panel</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--t-t3)" }}>lewispace.dev</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--t-t2)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: error ? "1px solid #FCA5A5" : "1px solid var(--t-border)",
                backgroundColor: error ? "rgba(239,68,68,0.06)" : "var(--t-surface)",
                color: "var(--t-t1)",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-500">Incorrect password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-accent)",
              boxShadow: "0 4px 16px rgba(255,107,107,0.25)",
            }}
          >
            Enter Admin Panel →
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--t-t3)" }}>
          Default password: <span className="font-mono">admin123</span>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}

export { SESSION_KEY };
