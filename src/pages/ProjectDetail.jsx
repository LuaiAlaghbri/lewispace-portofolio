import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/portfolio";
import ThemeToggle from "../components/ThemeToggle";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => String(p.id) === id);

  if (!project) {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8 font-sans"
        style={{ backgroundColor: "var(--t-surface)" }}
      >
        <p className="text-6xl">🔍</p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-t1)" }}>Project not found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm underline underline-offset-2 hover:opacity-80 transition"
          style={{ color: "var(--color-accent)" }}
        >
          ← Back to portfolio
        </button>
      </div>
    );
  }

  const bgColor = project.imageBgColor || "#F3EEE7";
  const tags = project.tags || project.tech || [];
  const process = project.process || [];

  return (
    <div className="min-h-dvh font-sans" style={{ backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}>

      {/* Sticky nav bar */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-md"
        style={{ borderBottom: "1px solid var(--t-border)", backgroundColor: "var(--t-raised)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--t-t2)" }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to portfolio
        </button>
        <div className="flex items-center gap-3">
          {project.category && (
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "rgba(255,107,107,0.1)", color: "var(--color-accent)" }}
            >
              {project.category}
            </span>
          )}
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              View Live
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd"/>
              </svg>
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Hero image */}
        <div
          className="relative mb-10 flex h-72 sm:h-96 items-center justify-center overflow-hidden rounded-3xl"
          style={{ backgroundColor: bgColor }}
        >
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-40">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16" style={{ color: "var(--t-t1)" }}>
                <rect x="6" y="10" width="36" height="28" rx="4"/>
                <circle cx="17" cy="22" r="4"/>
                <path d="M6 34l10-10 8 8 6-6 12 12"/>
              </svg>
              <p className="text-sm font-medium" style={{ color: "var(--t-t1)" }}>No image added yet</p>
            </div>
          )}
        </div>

        {/* Title + Description */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--t-t1)" }}>
            {project.title}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--t-t2)" }}>
            {project.description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full px-4 py-1.5 text-xs font-medium"
                  style={{ border: "1px solid var(--t-border)", backgroundColor: "var(--t-raised)", color: "var(--t-t2)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Process steps */}
        {process.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>
              Process
            </h2>
            <div className="flex flex-col gap-4">
              {process.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl p-5"
                  style={{ border: "1px solid var(--t-border)", backgroundColor: "var(--t-raised)" }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ backgroundColor: "rgba(255,107,107,0.1)", color: "var(--color-accent)" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    {step.title && (
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--t-t1)" }}>{step.title}</p>
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: "var(--t-t2)" }}>
                      {step.description || step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Image */}
        {project.secondaryImageUrl && (
          <div className="mb-10 overflow-hidden rounded-3xl border" style={{ borderColor: "var(--t-border)" }}>
            <img 
              src={project.secondaryImageUrl} 
              alt={`${project.title} secondary view`} 
              className="h-auto w-full object-cover" 
            />
          </div>
        )}



      </div>
    </div>
  );
}
