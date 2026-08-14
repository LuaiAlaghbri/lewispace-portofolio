import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Custom plugin: exposes POST /api/save-portfolio during dev only
function savePortfolioPlugin() {
  return {
    name: 'save-portfolio',
    configureServer(server) {
      server.middlewares.use('/api/save-portfolio', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve(__dirname, 'src/data/portfolio.js')
            const content = `// ─────────────────────────────────────────────────────────────
// PORTFOLIO CONFIG — edit this file OR use the /admin panel
// ─────────────────────────────────────────────────────────────

export const personalInfo = ${JSON.stringify(data.personalInfo, null, 2)};

export const accentColor = "${data.accentColor}";

export const socialLinks = ${JSON.stringify(data.socialLinks || [], null, 2)};

export const resumeUrl = ${JSON.stringify(data.resumeUrl || "")};

export const stats = ${JSON.stringify(data.stats, null, 2)};

export const techStack = ${JSON.stringify(data.techStack, null, 2)};

export const testimonials = ${JSON.stringify(data.testimonials || [], null, 2)};

export const sectionVisibility = ${JSON.stringify(data.sectionVisibility || {}, null, 2)};

export const projects = ${JSON.stringify(data.projects, null, 2)};
`
            fs.writeFileSync(filePath, content, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: err.message }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), savePortfolioPlugin()],
})
