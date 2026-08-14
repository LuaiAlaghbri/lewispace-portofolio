import React, { useState, useEffect } from "react";
import {
  personalInfo as initialPersonalInfo,
  accentColor as initialAccentColor,
  stats as initialStats,
  techStack as initialTechStack,
  projects as initialProjects,
  testimonials as initialTestimonials,
  sectionVisibility as initialVisibility,
  socialLinks as initialSocialLinks,
  resumeUrl as initialResumeUrl,
} from "../data/portfolio";
import { resolveIcon, ICON_MAP } from "../data/icons";
import Login, { SESSION_KEY } from "./Login";
import ThemeToggle from "../components/ThemeToggle";

const ALL_ICONS = Object.keys(ICON_MAP);

// ── Tabs ──────────────────────────────────────────────────────
const TABS = ["Personal", "Colors", "Projects", "Tech Stack", "Stats", "Testimonials", "Links", "Visibility"];

// ── Helpers ───────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  const style = {
    width: "100%", borderRadius: "0.75rem", border: "1px solid var(--t-border)",
    backgroundColor: "var(--t-surface)", color: "var(--t-t1)",
    padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none",
    transition: "border-color 0.2s ease",
  };
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={style}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  const style = {
    width: "100%", borderRadius: "0.75rem", border: "1px solid var(--t-border)",
    backgroundColor: "var(--t-surface)", color: "var(--t-t1)",
    padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none",
    resize: "none", transition: "border-color 0.2s ease",
  };
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={style}
    />
  );
}

function Select({ value, onChange, options }) {
  const style = {
    width: "100%", borderRadius: "0.75rem", border: "1px solid var(--t-border)",
    backgroundColor: "var(--t-surface)", color: "var(--t-t1)",
    padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none",
  };
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={style}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Btn({ onClick, children, danger, secondary }) {
  let cls = "rounded-xl px-4 py-2 text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] ";
  let style = {};
  if (danger) cls += "bg-red-50 text-red-500 hover:bg-red-100";
  else if (secondary) {
    cls += "border hover:brightness-95";
    style = { borderColor: "var(--t-border)", backgroundColor: "var(--t-surface)", color: "var(--t-t2)" };
  }
  else cls += "bg-[#FF6B6B] text-white shadow-sm shadow-[#FF6B6B]/25 hover:brightness-110";
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>
  );
}

// ── Admin Component ────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [tab, setTab] = useState("Personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Data state
  const [personalInfo, setPersonalInfo] = useState({ ...initialPersonalInfo });
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [stats, setStats] = useState(initialStats.map((s, i) => ({ ...s, _id: i })));
  const [techStack, setTechStack] = useState(initialTechStack.map((t, i) => ({ ...t, _id: i })));
  const [projects, setProjects] = useState(initialProjects.map((p) => ({ ...p })));
  const [editingProject, setEditingProject] = useState(null);
  const [testimonials, setTestimonials] = useState((initialTestimonials || []).map((t, i) => ({ ...t, _id: i })));
  const [socials, setSocials] = useState((initialSocialLinks || []).map((l, i) => ({ ...l, _id: i })));
  const [resumeLink, setResumeLink] = useState(initialResumeUrl || "");
  const [visibility, setVisibility] = useState(initialVisibility || {
    profile: true, greeting: true, projects: true,
    techStack: true, stats: true, testimonials: true, contact: true,
    socials: true, resume: true
  });

  // Apply accent color to root CSS variable live
  useEffect(() => {
    document.documentElement.style.setProperty("--admin-accent", accentColor);
  }, [accentColor]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  // ── Save to disk ──
  async function saveAll() {
    setSaving(true);
    setError(null);
    const payload = {
      personalInfo,
      accentColor,
      stats: stats.map(({ _id, ...s }) => s),
      techStack: techStack.map(({ _id, ...t }) => t),
      projects: projects.map((p) => p),
      testimonials: testimonials.map(({ _id, ...t }) => t),
      socialLinks: socials.map(({ _id, ...l }) => l),
      resumeUrl: resumeLink,
      sectionVisibility: visibility,
    };
    try {
      const res = await fetch("/api/save-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError("Could not save. Are you running npm run dev?");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  // ── List helpers ──
  function updateStat(id, key, val) {
    setStats(stats.map((s) => s._id === id ? { ...s, [key]: val } : s));
  }
  function addStat() {
    setStats([...stats, { _id: Date.now(), value: "0", label: "New Stat" }]);
  }
  function deleteStat(id) {
    setStats(stats.filter((s) => s._id !== id));
  }

  function updateTech(id, key, val) {
    setTechStack(techStack.map((t) => t._id === id ? { ...t, [key]: val } : t));
  }
  function addTech() {
    setTechStack([...techStack, { _id: Date.now(), name: "New Tool", color: "#888888" }]);
  }
  function deleteTech(id) {
    setTechStack(techStack.filter((t) => t._id !== id));
  }

  function updateProject(id, key, val) {
    setProjects(projects.map((p) => p.id === id ? { ...p, [key]: val } : p));
  }
  function addProject() {
    const newId = Math.max(0, ...projects.map((p) => p.id)) + 1;
    const newProj = {
      id: newId,
      title: "New Project",
      description: "Project description.",
      category: "Project",
      theme: "white",
      imageBgColor: "#F0F0F0",
      imageUrl: "",
      secondaryImageUrl: "",
      link: "/project/" + newId,
      externalUrl: "",
      column: 1,
      tags: [],
      process: [],
    };
    setProjects([...projects, newProj]);
    setEditingProject(newId);
  }
  function deleteProject(id) {
    setProjects(projects.filter((p) => p.id !== id));
    if (editingProject === id) setEditingProject(null);
  }

  // ── Render ──
  return (
    <div className="min-h-dvh font-sans" style={{ backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md" style={{ backgroundColor: "var(--t-raised)", borderBottom: "1px solid var(--t-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}40` }}
          >
            L
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: "var(--t-t1)" }}>Admin Panel</h1>
            <p className="text-[10px]" style={{ color: "var(--t-t3)" }}>lewispace.dev</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/" target="_blank" className="rounded-xl border px-4 py-2 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: "var(--t-border)", color: "var(--t-t2)" }}>
            ↗ View Site
          </a>
          {saved && (
            <span className="rounded-xl bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
              ✓ Saved!
            </span>
          )}
          {error && (
            <span className="rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-500">
              {error}
            </span>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60"
            style={{ backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}35` }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button onClick={logout} className="rounded-xl border px-3 py-2 text-xs transition hover:opacity-80" style={{ borderColor: "var(--t-border)", color: "var(--t-t3)" }}>
            Log out
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[65px] z-40 flex gap-1 px-6 pt-1 backdrop-blur-md" style={{ borderBottom: "1px solid var(--t-border)", backgroundColor: "var(--t-raised)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-xl px-5 py-3 text-xs font-semibold transition ${
              tab === t ? "border-b-2" : "hover:opacity-80"
            }`}
            style={
              tab === t
                ? { borderColor: accentColor, color: accentColor }
                : { color: "var(--t-t3)" }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <main className="mx-auto max-w-3xl px-6 py-10">

        {/* ── PERSONAL ── */}
        {tab === "Personal" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Personal Info" desc="Your name, bio, greeting, and location shown on the portfolio." />
            <Card>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <Input value={personalInfo.name} onChange={(v) => setPersonalInfo({ ...personalInfo, name: v })} placeholder="Your name" />
                </Field>
                <Field label="Roles / Title">
                  <Input value={personalInfo.roles} onChange={(v) => setPersonalInfo({ ...personalInfo, roles: v })} placeholder="Designer | Developer" />
                </Field>
                <Field label="Greeting Text">
                  <Input value={personalInfo.greeting} onChange={(v) => setPersonalInfo({ ...personalInfo, greeting: v })} placeholder="Hello Everyone!" />
                </Field>
                <Field label="Location">
                  <Input value={personalInfo.location} onChange={(v) => setPersonalInfo({ ...personalInfo, location: v })} placeholder="City, Country" />
                </Field>
                <Field label="Availability">
                  <Input value={personalInfo.availability} onChange={(v) => setPersonalInfo({ ...personalInfo, availability: v })} placeholder="Open to remote" />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Short Bio">
                  <Textarea value={personalInfo.bio} onChange={(v) => setPersonalInfo({ ...personalInfo, bio: v })} placeholder="A short sentence about you." rows={2} />
                </Field>
              </div>
            </Card>
          </section>
        )}

        {/* ── COLORS ── */}
        {tab === "Colors" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Brand Colors" desc="Change the accent color to make the portfolio feel uniquely yours." />
            <Card>
              <div className="flex items-center gap-6">
                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Accent Color</div>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-12 w-12 cursor-pointer rounded-xl border-0 p-0.5 outline-none"
                    />
                    <div>
                      <code className="text-sm font-mono font-bold" style={{ color: "var(--t-t1)" }}>{accentColor.toUpperCase()}</code>
                      <p className="text-xs mt-0.5" style={{ color: "var(--t-t3)" }}>Click to open color picker</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {["#FF6B6B","#F59E0B","#10B981","#6366F1","#EC4899","#14B8A6","#F97316","#8B5CF6"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: c, borderColor: accentColor === c ? "var(--t-t1)" : "transparent" }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl p-5" style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}25` }}>
                <p className="text-xs mb-3" style={{ color: "var(--t-t2)" }}>Preview</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md" style={{ backgroundColor: accentColor }}>
                    View Project
                  </div>
                  <div className="text-2xl font-bold" style={{ color: accentColor }}>Luai</div>
                  <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: accentColor }}>
                    Available for Work
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {tab === "Projects" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Projects" desc="Add, edit, or remove project cards. Set which column (1, 2 or 3) each appears in.">
              <Btn onClick={addProject}>+ Add Project</Btn>
            </SectionHeader>

            <div className="flex flex-col gap-4">
              {projects.map((p) => (
                <Card key={p.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold" style={{ color: "var(--t-t1)" }}>{p.title}</h3>
                    <div className="flex gap-2">
                      <Btn secondary onClick={() => setEditingProject(editingProject === p.id ? null : p.id)}>
                        {editingProject === p.id ? "Collapse ↑" : "Edit ↓"}
                      </Btn>
                      <Btn danger onClick={() => deleteProject(p.id)}>Delete</Btn>
                    </div>
                  </div>

                  {/* Project preview chip */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: accentColor }}>{p.category}</span>
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--t-border)", color: "var(--t-t2)" }}>Col {p.column}</span>
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--t-border)", color: "var(--t-t2)" }}>{p.theme} theme</span>
                    {p.link !== "#" && <span className="rounded-full border px-3 py-1 text-xs font-mono truncate max-w-[180px]" style={{ borderColor: "var(--t-border)", color: "var(--t-t2)" }}>{p.link}</span>}
                  </div>

                  {editingProject === p.id && (
                    <div className="mt-5 grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-2" style={{ borderColor: "var(--t-border)" }}>
                      <Field label="Title">
                        <Input value={p.title} onChange={(v) => updateProject(p.id, "title", v)} />
                      </Field>
                      <Field label="Category Badge">
                        <Input value={p.category} onChange={(v) => updateProject(p.id, "category", v)} placeholder="Project" />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Description">
                          <Textarea value={p.description} onChange={(v) => updateProject(p.id, "description", v)} />
                        </Field>
                      </div>
                      <Field label="Card Link (internal)">
                        <Input value={p.link} onChange={(v) => updateProject(p.id, "link", v)} placeholder="/project/1" />
                      </Field>
                      <Field label="Live Project URL (external)">
                        <Input value={p.externalUrl || ""} onChange={(v) => updateProject(p.id, "externalUrl", v)} placeholder="https://myproject.com (leave empty to hide button)" />
                      </Field>
                      <Field label="Primary Image URL">
                        <Input value={p.imageUrl} onChange={(v) => updateProject(p.id, "imageUrl", v)} placeholder="/projects/myproject.png" />
                      </Field>
                      <Field label="Secondary Image URL">
                        <Input value={p.secondaryImageUrl || ""} onChange={(v) => updateProject(p.id, "secondaryImageUrl", v)} placeholder="/projects/myproject-2.png" />
                      </Field>
                      <Field label="Card Background Color">
                        <div className="flex items-center gap-3">
                          <input type="color" value={p.imageBgColor === "transparent" ? "#ffffff" : p.imageBgColor} onChange={(e) => updateProject(p.id, "imageBgColor", e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-0" />
                          <Input value={p.imageBgColor} onChange={(v) => updateProject(p.id, "imageBgColor", v)} placeholder="#FFFFFF" />
                        </div>
                      </Field>
                      <Field label="Card Theme">
                        <Select
                          value={p.theme}
                          onChange={(v) => updateProject(p.id, "theme", v)}
                          options={[
                            { value: "white", label: "White (default)" },
                            { value: "green", label: "Green (EcoTrack style)" },
                            { value: "dark", label: "Dark (PixelVerse style)" },
                          ]}
                        />
                      </Field>
                      <Field label="Column (1, 2 or 3)">
                        <Select
                          value={p.column}
                          onChange={(v) => updateProject(p.id, "column", Number(v))}
                          options={[
                            { value: 1, label: "Column 1 (left)" },
                            { value: 2, label: "Column 2 (center)" },
                            { value: 3, label: "Column 3 (right)" },
                          ]}
                        />
                      </Field>
                      
                      <div className="sm:col-span-2 mt-2">
                        <Field label="Tags / Technologies (comma separated)">
                          <Input 
                            value={(p.tags || []).join(", ")} 
                            onChange={(v) => updateProject(p.id, "tags", v.split(",").map(s => s.trimStart()))} 
                            placeholder="e.g. React, Tailwind, Figma" 
                          />
                        </Field>
                      </div>

                      <div className="sm:col-span-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--t-border)" }}>
                        <div className="flex items-center justify-between mb-3">
                          <Field label="Process Steps" />
                          <Btn secondary onClick={() => updateProject(p.id, "process", [...(p.process || []), { title: "New Step", description: "" }])}>
                            + Add Step
                          </Btn>
                        </div>
                        <div className="flex flex-col gap-3">
                          {(p.process || []).map((step, i) => (
                            <div key={i} className="flex gap-3 items-start border p-3 rounded-xl" style={{ borderColor: "var(--t-border)" }}>
                              <div className="flex-1 flex flex-col gap-2">
                                <Input 
                                  value={step.title} 
                                  onChange={(v) => {
                                    const newProc = [...(p.process || [])];
                                    newProc[i].title = v;
                                    updateProject(p.id, "process", newProc);
                                  }} 
                                  placeholder="Step title" 
                                />
                                <Textarea 
                                  value={step.description} 
                                  onChange={(v) => {
                                    const newProc = [...(p.process || [])];
                                    newProc[i].description = v;
                                    updateProject(p.id, "process", newProc);
                                  }} 
                                  placeholder="Step description" 
                                  rows={2} 
                                />
                              </div>
                              <button 
                                onClick={() => {
                                  const newProc = (p.process || []).filter((_, idx) => idx !== i);
                                  updateProject(p.id, "process", newProc);
                                }} 
                                className="text-red-400 hover:text-red-500 font-bold p-2 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          {(!p.process || p.process.length === 0) && (
                            <div className="text-xs" style={{ color: "var(--t-t3)" }}>No process steps added yet.</div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── TECH STACK ── */}
        {tab === "Tech Stack" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Tech Stack" desc="Tools and technologies shown in your portfolio's tech card.">
              <Btn onClick={addTech}>+ Add Tool</Btn>
            </SectionHeader>

            {/* Live preview grid */}
            <Card>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Preview</p>
              <div className="grid grid-cols-6 gap-3">
                {techStack.map((t) => {
                  const Icon = resolveIcon(t.icon);
                  return (
                    <div key={t._id} className="flex flex-col items-center gap-1.5 rounded-xl border p-2.5" style={{ borderColor: "var(--t-border)" }}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${t.color}18` }}>
                        {Icon ? <Icon style={{ color: t.color, fontSize: "18px" }} /> : <div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />}
                      </div>
                      <span className="text-center text-[9px] font-medium leading-tight" style={{ color: "var(--t-t3)" }}>{t.name}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Edit list */}
            <Card>
              <div className="flex flex-col gap-4">
                {techStack.map((t) => {
                  const Icon = resolveIcon(t.icon);
                  return (
                    <div key={t._id} className="flex items-center gap-3">
                      {/* Icon preview */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" style={{ backgroundColor: `${t.color}15`, borderColor: "var(--t-border)" }}>
                        {Icon ? <Icon style={{ color: t.color, fontSize: "18px" }} /> : <div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />}
                      </div>
                      {/* Name */}
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => updateTech(t._id, "name", e.target.value)}
                        placeholder="Tool name"
                        className="w-32 shrink-0 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
                        style={{ borderColor: "var(--t-border)", backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}
                      />
                      {/* Icon key dropdown */}
                      <select
                        value={t.icon || ""}
                        onChange={(e) => updateTech(t._id, "icon", e.target.value)}
                        className="flex-1 rounded-xl border px-3 py-2 text-xs outline-none focus:ring-2"
                        style={{ borderColor: "var(--t-border)", backgroundColor: "var(--t-surface)", color: "var(--t-t2)" }}
                      >
                        <option value="">— No icon —</option>
                        {ALL_ICONS.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                      {/* Color picker */}
                      <input
                        type="color"
                        value={t.color}
                        onChange={(e) => updateTech(t._id, "color", e.target.value)}
                        className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 p-0.5"
                        title="Icon color"
                      />
                      {/* Delete */}
                      <button onClick={() => deleteTech(t._id)} className="shrink-0 rounded-lg p-2 hover:bg-red-50 hover:text-red-500 transition" style={{ color: "var(--t-t3)" }}>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}

        {/* ── STATS ── */}
        {tab === "Stats" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Stats" desc="Numbers shown in the stats grid card (e.g. 50+ Projects).">
              <Btn onClick={addStat}>+ Add Stat</Btn>
            </SectionHeader>
            <Card>
              <div className="flex flex-col gap-3">
                {stats.map((s) => (
                  <div key={s._id} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => updateStat(s._id, "value", e.target.value)}
                      placeholder="50+"
                      className="w-24 shrink-0 rounded-xl border px-4 py-2 text-sm font-bold outline-none focus:ring-2"
                      style={{ borderColor: "var(--t-border)", backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}
                    />
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => updateStat(s._id, "label", e.target.value)}
                      placeholder="Projects Completed"
                      className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2"
                      style={{ borderColor: "var(--t-border)", backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}
                    />
                    <button onClick={() => deleteStat(s._id)} className="shrink-0 rounded-lg p-2 hover:bg-red-50 hover:text-red-500 transition" style={{ color: "var(--t-t3)" }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {tab === "Testimonials" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Testimonials" desc="Client quotes shown in the rotating testimonial card on your portfolio.">
              <Btn onClick={() => setTestimonials([...testimonials, { _id: Date.now(), quote: "An amazing experience working with Luai.", name: "Client Name", role: "Role, Company" }])}>+ Add Quote</Btn>
            </SectionHeader>
            <div className="flex flex-col gap-4">
              {testimonials.map((t) => (
                <Card key={t._id}>
                  <div className="flex flex-col gap-4">
                    <Field label="Quote">
                      <Textarea
                        value={t.quote}
                        onChange={(v) => setTestimonials(testimonials.map((x) => x._id === t._id ? { ...x, quote: v } : x))}
                        placeholder="What the client said..."
                        rows={3}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Client Name">
                        <Input
                          value={t.name}
                          onChange={(v) => setTestimonials(testimonials.map((x) => x._id === t._id ? { ...x, name: v } : x))}
                          placeholder="Jane Smith"
                        />
                      </Field>
                      <Field label="Role / Company">
                        <Input
                          value={t.role}
                          onChange={(v) => setTestimonials(testimonials.map((x) => x._id === t._id ? { ...x, role: v } : x))}
                          placeholder="CEO, Acme Inc."
                        />
                      </Field>
                    </div>
                    <div className="flex justify-end">
                      <Btn danger onClick={() => setTestimonials(testimonials.filter((x) => x._id !== t._id))}>Delete</Btn>
                    </div>
                  </div>
                </Card>
              ))}
              {testimonials.length === 0 && (
                <div className="rounded-2xl border border-dashed p-10 text-center text-sm" style={{ borderColor: "var(--t-border)", color: "var(--t-t3)" }}>
                  No testimonials yet. Click "+ Add Quote" to add your first one.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── LINKS ── */}
        {tab === "Links" && (
          <section className="flex flex-col gap-6">
            <SectionHeader title="Social & Resume Links" desc="Manage your social profiles and resume download link." />
            <Card>
              <div className="flex flex-col gap-4">
                <Field label="Resume / CV URL">
                  <Input value={resumeLink} onChange={setResumeLink} placeholder="e.g. /resume.pdf or https://link-to-resume.com" />
                </Field>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--t-t1)" }}>Social Links</h3>
                  <Btn onClick={() => setSocials([...socials, { platform: "GitHub", url: "", _id: Date.now() }])}>+ Add Link</Btn>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  {socials.map((link, i) => (
                    <div key={link._id} className="relative rounded-2xl p-4 border border-dashed" style={{ borderColor: "var(--t-border)" }}>
                      <button onClick={() => setSocials(socials.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-xs font-semibold text-red-400 hover:text-red-500 transition-colors">
                        Remove
                      </button>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Field label="Platform Name">
                          <Input
                            value={link.platform}
                            onChange={(val) => {
                              const newSocials = [...socials];
                              newSocials[i].platform = val;
                              setSocials(newSocials);
                            }}
                            placeholder="e.g. YouTube, GitHub"
                          />
                        </Field>
                        <Field label="URL">
                          <Input
                            value={link.url}
                            onChange={(val) => {
                              const newSocials = [...socials];
                              newSocials[i].url = val;
                              setSocials(newSocials);
                            }}
                            placeholder="https://..."
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                  {socials.length === 0 && (
                    <div className="text-center py-8 text-sm" style={{ color: "var(--t-t3)" }}>
                      No social links added yet.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ── VISIBILITY ── */}
        {tab === "Visibility" && (
          <section className="flex flex-col gap-6">
            <SectionHeader
              title="Section Visibility"
              desc="Toggle sections on or off. Disabled sections are hidden from your portfolio instantly after saving."
            />
            <Card>
              <div className="flex flex-col divide-y" style={{ borderColor: "var(--t-border)" }}>
                {[
                  { key: "profile",      label: "Profile Card",    desc: "Your photo, name, roles and bio" },
                  { key: "greeting",     label: "Greeting Card",   desc: "\"Hello Everyone, I'm Luai\" hero card" },
                  { key: "projects",     label: "Projects",        desc: "All project cards across all columns" },
                  { key: "techStack",    label: "Tech Stack",      desc: "Technology logo grid" },
                  { key: "stats",        label: "Stats",           desc: "Numbers grid (projects, clients, years...)" },
                  { key: "testimonials", label: "Testimonials",    desc: "Rotating client quotes card" },
                  { key: "contact",      label: "Contact Form",    desc: "Full-width contact form at the bottom" },
                  { key: "socials",      label: "Social Links",    desc: "Social icons in profile card and footer" },
                  { key: "resume",       label: "Resume Card",     desc: "Resume download card in third column" },
                ].map(({ key, label, desc }) => {
                  const enabled = visibility[key] !== false;
                  return (
                    <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="pr-6">
                        <p className="text-sm font-semibold" style={{ color: "var(--t-t1)" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--t-t3)" }}>{desc}</p>
                      </div>
                      {/* Toggle switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => setVisibility({ ...visibility, [key]: !enabled })}
                        className="relative shrink-0 h-6 w-11 rounded-full transition-all duration-300 focus:outline-none"
                        style={{ backgroundColor: enabled ? accentColor : "var(--t-border)" }}
                      >
                        <span
                          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300"
                          style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Live preview hint */}
            <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--t-t2)" }}>
              <span style={{ color: accentColor, fontWeight: 600 }}>💡 Tip: </span>
              Changes take effect after you click <strong>Save Changes</strong> above. The portfolio page will reload with the updated visibility.
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ border: "1px solid var(--t-border)", backgroundColor: "var(--t-raised)" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--t-t1)" }}>{title}</h2>
        <p className="text-sm" style={{ color: "var(--t-t3)" }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}
