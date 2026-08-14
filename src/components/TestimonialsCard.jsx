import React, { useState, useEffect } from "react";
import { testimonials } from "../data/portfolio";

export default function TestimonialsCard() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setFading(false);
      }, 350);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <div
      className="bento-card p-6 flex flex-col justify-between min-h-[200px]"
    >
      {/* Quote icon */}
      <svg viewBox="0 0 32 24" className="h-6 w-6 mb-3" fill="currentColor" style={{ color: "var(--color-accent)", opacity: 0.5 }}>
        <path d="M0 24V14.5C0 6.5 5 1.5 15 0l1.5 2.5C10 4 7 7.5 7 12h5v12H0zm18 0V14.5C18 6.5 23 1.5 33 0l1.5 2.5C28 4 25 7.5 25 12h5v12H18z"/>
      </svg>

      {/* Quote text */}
      <blockquote
        className="flex-1 text-[14px] leading-relaxed italic"
        style={{
          color: "var(--t-t1)",
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        "{t.quote}"
      </blockquote>

      {/* Attribution */}
      <div
        className="mt-4 flex items-center justify-between"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--t-t1)" }}>{t.name}</p>
          <p className="text-xs" style={{ color: "var(--t-t3)" }}>{t.role}</p>
        </div>

        {testimonials.length > 1 && (
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setIndex(i); setFading(false); }, 350); }}
                className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === index ? "20px" : "6px",
                  backgroundColor: i === index ? "var(--color-accent)" : "var(--t-border)",
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
