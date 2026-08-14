export default function ProjectCard({ project, index }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border bg-surface-raised transition-all duration-500 hover:border-border-hover hover:-translate-y-1 animate-fade-in-up stagger-${(index % 6) + 1}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-overlay">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-text-primary">
            {project.title}
          </h3>
          <span className="rounded-full bg-tag-bg border border-tag-border px-2.5 py-0.5 text-[10px] font-medium text-text-muted uppercase tracking-wider">
            {project.category}
          </span>
        </div>

        <p className="mb-4 text-[13px] leading-relaxed text-text-secondary line-clamp-2">
          {project.description}
        </p>

        {/* Stats bar */}
        {project.stats && (
          <div className="grid grid-cols-4 gap-2 rounded-xl bg-surface-overlay border border-border p-3 mb-4">
            {project.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[15px] font-bold text-text-primary">{stat.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-tag-border bg-tag-bg px-2.5 py-0.5 text-[11px] text-text-secondary transition-colors duration-300 hover:border-accent-border hover:text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
