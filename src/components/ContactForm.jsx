import React, { useState } from "react";

const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: form.name, from_email: form.email,
        subject: form.subject, message: form.message,
      }, { publicKey: EMAILJS_PUBLIC_KEY });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  const inputStyle = {
    width: "100%", borderRadius: "0.75rem", border: "1px solid var(--t-border)",
    backgroundColor: "var(--t-surface)", color: "var(--t-t1)",
    padding: "0.75rem 1rem", fontSize: "0.875rem", outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div className="bento-card p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-accent)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>Available for work</span>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--t-t1)" }}>Let's work together</h2>
        <p className="text-sm mt-1" style={{ color: "var(--t-t2)" }}>Got a project in mind? Send me a message and I'll get back to you within 24 hours.</p>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,107,107,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: "var(--t-t1)" }}>Message sent!</h3>
          <p className="text-sm mt-1" style={{ color: "var(--t-t2)" }}>Thanks for reaching out. I'll reply within 24 hours.</p>
          <button onClick={() => setStatus("idle")} className="mt-5 text-sm underline underline-offset-2 hover:opacity-80 transition" style={{ color: "var(--color-accent)" }}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What's this about?" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--t-t3)" }}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Tell me about your project..." rows={5} style={{ ...inputStyle, resize: "none" }} />
          </div>

          {status === "error" && (
            <p className="rounded-xl px-4 py-3 text-sm text-red-600" style={{ backgroundColor: "rgba(239,68,68,0.08)" }}>
              Something went wrong. Please try emailing directly or set up EmailJS credentials.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: "var(--color-accent)", boxShadow: "0 8px 24px rgba(255,107,107,0.2)" }}
          >
            {status === "sending" ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Sending…</>
            ) : (
              <>Send Message <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"/></svg></>
            )}
          </button>

          <p className="text-center text-xs" style={{ color: "var(--t-t3)" }}>
            Or email me at{" "}
            <a href="mailto:luai@lewispace.dev" className="underline underline-offset-2 hover:opacity-80 transition" style={{ color: "var(--color-accent)" }}>
              luai@lewispace.dev
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
