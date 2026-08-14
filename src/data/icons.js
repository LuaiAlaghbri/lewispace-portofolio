// Central icon resolver for the tech stack.
// Maps the icon string key from portfolio.js → the actual react-icons component.
// To add a new icon: import it from "react-icons/si" and add it to the map below.
// Full list: https://react-icons.github.io/react-icons/icons/si/

import {
  SiReact,
  SiFigma,
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiFramer,
  SiGit,
  SiFirebase,
  SiVercel,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiGooglecloud,
  SiDocker,
  SiLinux,
  SiNotion,
  SiWebflow,
  SiSass,
  SiJavascript,
  SiHtml5,
  SiRedux,
  SiPrisma,
  SiStorybook,
  SiElectron,
  SiExpo,
  SiFlutter,
  SiDart,
  SiRust,
  SiGo,
  SiKubernetes,
  SiNginx,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiNetlify,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiJira,
  SiLinear,
  SiTrello,
  SiAsana,
} from "react-icons/si";

export const ICON_MAP = {
  // Frontend
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiSass,
  SiTailwindcss,
  SiRedux,

  // Design
  SiFigma,
  SiFramer,
  SiWebflow,
  SiStorybook,

  // Backend & DB
  SiNodedotjs,
  SiPython,
  SiGo,
  SiRust,
  SiGraphql,
  SiPrisma,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiRedis,
  SiFirebase,
  SiSupabase,

  // DevOps & Cloud
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiNginx,

  // Hosting & Deploy
  SiVercel,
  SiNetlify,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,

  // Tools
  SiNotion,
  SiJira,
  SiLinear,
  SiTrello,
  SiAsana,

  // Mobile
  SiExpo,
  SiFlutter,
  SiDart,
  SiElectron,
};

/**
 * Resolve an icon key string → React component
 * Returns null if key is not found (renders a fallback dot in UI)
 */
export function resolveIcon(key) {
  return ICON_MAP[key] || null;
}
