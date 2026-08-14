export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-dim px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-accent">
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
          style={{ animation: "pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  );
}
