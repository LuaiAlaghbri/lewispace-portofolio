export default function Button({ children, variant = "primary", href, onClick, className = "" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer select-none";

  const variants = {
    primary:
      "bg-accent text-white hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(255,107,107,0.18)]",
    ghost:
      "border border-border text-text-secondary hover:border-border-hover hover:text-text-primary hover:scale-[1.03] active:scale-[0.98]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
