import React, { useRef, useEffect, useState } from "react";

/**
 * ScrollReveal — wraps children and fades/slides them in
 * when they enter the viewport using IntersectionObserver.
 *
 * Props:
 *   delay   — animation delay in ms (default 0)
 *   y       — vertical translate distance in px (default 24)
 *   once    — only animate once (default true)
 */
export default function ScrollReveal({ children, delay = 0, y = 24, once = true, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
