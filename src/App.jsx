import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { personalInfo, stats, techStack, projects, accentColor, sectionVisibility, socialLinks, resumeUrl } from "./data/portfolio";
import { resolveIcon } from "./data/icons";
import SplashScreen from "./components/SplashScreen";
import ThemeToggle from "./components/ThemeToggle";
import ScrollReveal from "./components/ScrollReveal";
import TestimonialsCard from "./components/TestimonialsCard";
import ContactForm from "./components/ContactForm";
import BackToTop from "./components/BackToTop";

document.documentElement.style.setProperty("--color-accent", accentColor);

const show = (key) => sectionVisibility?.[key] !== false;

// Social platform SVG icons (inline to avoid extra deps)
const SOCIAL_ICONS = {
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Dribbble: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  ),
};

// Helper to resolve an icon dynamically
function resolveSocialIcon(platform) {
  if (!platform) return null;
  // 1. Check hardcoded exact matches
  if (SOCIAL_ICONS[platform]) return SOCIAL_ICONS[platform];
  
  // 2. Fallback to first letter
  return <span className="text-xs font-bold uppercase">{platform[0]}</span>;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(
    () => typeof sessionStorage !== "undefined" && !!sessionStorage.getItem("luai_splash_shown")
  );
  const navigate = useNavigate();

  const column1Projects = projects.filter((p) => p.column === 1);
  const column2Projects = projects.filter((p) => p.column === 2);
  const column3Projects = projects.filter((p) => p.column === 3);

  function renderProjectCard(project) {
    const isGreenTheme = project.theme === "green";
    const isDarkTheme  = project.theme === "dark";

    const handleClick = () => {
      if (project.link && project.link.startsWith("/project/")) {
        navigate(project.link);
      } else if (project.link && project.link !== "#") {
        window.open(project.link, "_blank");
      }
    };

    return (
      <div
        key={project.id}
        onClick={handleClick}
        className={`bento-card group cursor-pointer ${isGreenTheme ? "green-theme" : ""} ${isDarkTheme ? "dark-theme" : ""}`}
      >
        <div
          className="relative flex justify-center items-end overflow-hidden"
          style={{
            backgroundColor: project.imageBgColor,
            height: isDarkTheme ? "200px" : "240px",
            paddingTop: "2rem", paddingLeft: "2rem",
            paddingRight: "2rem", paddingBottom: "1rem",
          }}
        >
          {project.category && (
            <div className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm"
              style={{ backgroundColor: "var(--color-accent)" }}>
              {project.category}
            </div>
          )}
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={`${project.title} - ${project.category || 'Portfolio'} Project by ${personalInfo.name}`}
              className="w-[85%] h-auto rounded-t-xl shadow-2xl relative top-4 transition-transform duration-500 group-hover:-translate-y-4" />
          ) : (
            <div className={`w-[85%] h-[105%] rounded-t-xl shadow-2xl relative top-4 transition-transform duration-500 group-hover:-translate-y-4 flex flex-col p-4 border-t border-x ${isDarkTheme ? "bg-[#111115] border-gray-800" : "bg-white border-gray-200"}`}>
              <div className={`w-full h-1/2 rounded-lg mb-2 ${isDarkTheme ? "bg-gray-900" : "bg-gray-100"}`} />
              <div className={`w-full h-1/3 rounded-lg ${isDarkTheme ? "bg-gray-800" : "bg-gray-50"}`} />
            </div>
          )}
        </div>
        <div className="p-6" style={{ backgroundColor: "var(--t-raised)", borderTop: "1px solid var(--t-border)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--t-t1)" }}>{project.title}</h3>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--t-t2)" }}>{project.description}</p>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold group-hover:gap-2.5 transition-all duration-300"
            style={{ color: "var(--color-accent)" }}>
            View Project
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      <div className="min-h-dvh font-sans" style={{ backgroundColor: "var(--t-surface)", color: "var(--t-t1)" }}>

        <div className="fixed top-4 right-4 z-40">
          <ThemeToggle />
        </div>

        <BackToTop />

        <div className="p-4 sm:p-8 md:p-12 lg:p-16 flex justify-center">
          <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max items-start">

            {/* ── COLUMN 1 ── */}
            <div className="flex flex-col gap-6">

              {show("profile") && (
                <ScrollReveal delay={0}>
                  <div className="bento-card p-8 flex flex-col items-center text-center">
                    <div className="h-32 w-32 rounded-full p-1 mb-4" style={{ boxShadow: "0 0 0 4px rgba(255,107,107,0.2)" }}>
                      <img src="/profile.png" alt={personalInfo.name} className="h-full w-full rounded-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-accent)" }}>{personalInfo.name}</h1>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--t-t2)" }}>{personalInfo.roles}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--t-t3)" }}>{personalInfo.bio}</p>

                    {/* Social links row — inside profile card */}
                    {show("socials") && socialLinks && socialLinks.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {socialLinks.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.platform}
                            aria-label={`Visit my ${link.platform}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                            style={{
                              backgroundColor: "var(--t-surface)",
                              border: "1px solid var(--t-border)",
                              color: "var(--t-t2)",
                            }}
                          >
                            {resolveSocialIcon(link.platform)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {show("greeting") && (
                <ScrollReveal delay={60}>
                  <div className="bento-card p-10 flex flex-col justify-center min-h-[280px]">
                    <h2 className="text-5xl font-bold leading-[1.1] tracking-tight" style={{ color: "var(--t-t1)" }}>
                      {personalInfo.greeting}
                    </h2>
                  </div>
                </ScrollReveal>
              )}

              {show("projects") && column1Projects.map((p, i) => (
                <ScrollReveal key={p.id} delay={120 + i * 60}>
                  {renderProjectCard(p)}
                </ScrollReveal>
              ))}
            </div>

            {/* ── COLUMN 2 ── */}
            <div className="flex flex-col gap-6">

              {show("projects") && column2Projects.map((p, i) => (
                <ScrollReveal key={p.id} delay={60 + i * 60}>
                  {renderProjectCard(p)}
                </ScrollReveal>
              ))}

              {show("stats") && (
                <ScrollReveal delay={180}>
                  <div className="bento-card p-8">
                    <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                      {stats.map((stat, i) => (
                        <div key={i}>
                          <div className="text-3xl font-bold mb-1" style={{ color: "var(--color-accent)" }}>{stat.value}</div>
                          <div className="text-xs font-medium leading-tight" style={{ color: "var(--t-t1)" }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {show("testimonials") && (
                <ScrollReveal delay={220}>
                  <TestimonialsCard />
                </ScrollReveal>
              )}
            </div>

            {/* ── COLUMN 3 ── */}
            <div className="flex flex-col gap-6">

              {show("projects") && column3Projects.slice(0, 1).map((p, i) => (
                <ScrollReveal key={p.id} delay={90 + i * 60}>
                  {renderProjectCard(p)}
                </ScrollReveal>
              ))}

              {show("techStack") && (
                <ScrollReveal delay={150}>
                  <div className="bento-card p-6">
                    <h3 className="text-lg font-bold mb-4" style={{ color: "var(--t-t1)" }}>Tech Stack</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {techStack.map((tech, i) => {
                        const IconComponent = resolveIcon(tech.icon);
                        return (
                          <div
                            key={i}
                            className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default"
                            style={{ border: "1px solid var(--t-border)", backgroundColor: "var(--t-surface)" }}
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: `${tech.color}18` }}>
                              {IconComponent
                                ? <IconComponent style={{ color: tech.color, fontSize: "20px" }} />
                                : <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tech.color }} />
                              }
                            </div>
                            <span className="text-center text-[10px] font-medium leading-tight" style={{ color: "var(--t-t2)" }}>
                              {tech.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Resume download card */}
              {show("resume") && resumeUrl && (
                <ScrollReveal delay={190}>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bento-card group flex items-center gap-4 p-5 cursor-pointer"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: "rgba(255,107,107,0.1)" }}
                    >
                      {/* Download icon */}
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" style={{ color: "var(--color-accent)" }}>
                        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--t-t1)" }}>Download Resume</p>
                      <p className="text-xs" style={{ color: "var(--t-t3)" }}>View my full CV / PDF</p>
                    </div>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--t-t3)" }}>
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                </ScrollReveal>
              )}

              {/* Spacer */}
              <ScrollReveal delay={200}>
                <div className="bento-card py-4 flex justify-center items-center text-xl tracking-[0.3em] font-bold"
                  style={{ color: "var(--t-t3)" }}>
                  ...
                </div>
              </ScrollReveal>

              {show("projects") && column3Projects.slice(1).map((p, i) => (
                <ScrollReveal key={p.id} delay={240 + i * 60}>
                  {renderProjectCard(p)}
                </ScrollReveal>
              ))}
            </div>

          </div>
        </div>

        {show("contact") && (
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 pb-16 flex justify-center">
            <div className="max-w-[1200px] w-full">
              <ScrollReveal delay={0}>
                <ContactForm />
              </ScrollReveal>
            </div>
          </div>
        )}

        {/* Footer with social links */}
        <footer className="py-8 text-center" style={{ borderTop: "1px solid var(--t-border)" }}>
          {show("socials") && socialLinks && socialLinks.length > 0 && (
            <div className="flex justify-center gap-3 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.platform}
                  aria-label={`Visit my ${link.platform}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ color: "var(--t-t3)" }}
                >
                  {resolveSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
          <p className="text-xs" style={{ color: "var(--t-t3)" }}>
            © {new Date().getFullYear()} Luai — lewispace.dev. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
