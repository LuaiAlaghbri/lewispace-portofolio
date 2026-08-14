import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ target, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function animate() {
    const start = performance.now();
    const numTarget = parseInt(target, 10) || 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(numTarget);
      }
    }

    requestAnimationFrame(tick);
  }

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
