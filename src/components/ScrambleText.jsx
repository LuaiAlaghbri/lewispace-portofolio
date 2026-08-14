import { useState, useEffect, useRef } from "react";

export default function ScrambleText({ text, className = "" }) {
  const [display, setDisplay] = useState(text);
  const hasAnimated = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function scramble() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    const duration = 600;
    const steps = 12;
    const stepTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const revealed = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < revealed) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);

      if (step >= steps) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, stepTime);
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
