"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const STATS = [
  { value: "£180+", label: "avg job value recovered" },
  { value: "< 30s", label: "SMS sent after missed call" },
  { value: "10 min", label: "to go live — no tech skills" },
];

const PROBLEMS = [
  {
    icon: "📞",
    title: "You're on-site, hands full",
    body: "You can't stop mid-job to answer a call. You're a professional — that's just reality.",
  },
  {
    icon: "⏱",
    title: "They call the next person",
    body: "Customers don't wait. They open Google and call the next plumber. You never even knew.",
  },
  {
    icon: "💸",
    title: "£300 gone, just like that",
    body: "A single missed call is a boiler repair, a rewire, a gas check — walking out the door.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Forward your number",
    body: "Point your business line to our number. Takes 2 minutes in your phone settings.",
  },
  {
    num: "02",
    title: "We text them instantly",
    body: '"Sorry we missed you — what do you need help with?" Your branding, our automation.',
  },
  {
    num: "03",
    title: "Lead lands in your dashboard",
    body: "Name, number, job description, urgency. You call back knowing exactly what they need.",
  },
];

export default function HomePage() {
  const signupRef = useRef<HTMLDivElement>(null);

  function scrollToSignup() {
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="font-display min-h-screen" style={{ fontFamily: "var(--font-display)" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white">
            Callback<span className="text-[#f97316]">Leads</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#fb923c] transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0c0c0e] px-6 pb-28 pt-40">
        {/* grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* amber glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#f97316]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#f97316]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f97316] animate-pulse" />
              Built for UK plumbers, electricians &amp; gas engineers
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.1)}
            className="mt-8 text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-7xl"
          >
            Stop losing jobs
            <br />
            <span className="text-[#f97316]">every time you miss</span>
            <br />
            a call.
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            When you miss a call on-site, we instantly text the customer, capture their job
            details, and drop a qualified lead in your dashboard — so you never lose work again.
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToSignup}
              className="rounded-xl bg-[#f97316] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#f97316]/20 hover:bg-[#fb923c] transition-all hover:shadow-[#f97316]/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get early access — it&apos;s free
            </button>
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/80 hover:bg-white/10 transition-colors"
            >
              Business login →
            </Link>
          </motion.div>
        </div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-3xl grid grid-cols-1 gap-px rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-3 overflow-hidden"
        >
          {STATS.map((s) => (
            <div key={s.value} className="bg-[#141416] px-8 py-7 text-center">
              <p className="text-4xl font-extrabold text-[#f97316]">{s.value}</p>
              <p className="mt-1.5 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-[#f8fafc] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f97316]">The problem</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Sound familiar?
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md hover:border-[#f97316]/30 transition-all"
              >
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="bg-[#0c0c0e] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f97316]">How it works</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Three steps. Zero effort.
            </h2>
          </div>
          <div className="mt-14 space-y-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-6 rounded-2xl border border-white/6 bg-[#141416] p-7 hover:border-[#f97316]/20 transition-colors"
              >
                <span className="shrink-0 text-4xl font-extrabold text-[#f97316]/30">{s.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                    {s.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI BANNER ── */}
      <section className="relative overflow-hidden bg-[#f97316] px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            One recovered job pays for
            <br />a whole year.
          </h2>
          <p className="mt-5 text-lg text-white/80" style={{ fontFamily: "var(--font-body)" }}>
            If we recover just one boiler callout a month, that&apos;s £2,000+ you weren&apos;t getting before.
            The maths is simple.
          </p>
        </div>
      </section>

      {/* ── EARLY ACCESS SIGNUP ── */}
      <section ref={signupRef} className="bg-[#f8fafc] px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f97316]">Early access</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            Be first in line
          </h2>
          <p className="mt-4 text-base text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Join UK tradespeople already on the waitlist. Free trial, no card required.
          </p>
          <div className="mt-10">
            <EarlyAccessForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
        <span className="font-semibold text-slate-700">
          Callback<span className="text-[#f97316]">Leads</span>
        </span>
        {" "}· Built for UK trades · plumbers, electricians &amp; gas engineers
      </footer>
    </div>
  );
}

function EarlyAccessForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.from("early_access").insert({ name, email, phone });
      if (error) throw error;
      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8"
      >
        <span className="text-4xl">🎉</span>
        <h3 className="mt-3 text-xl font-bold text-emerald-800">You&apos;re on the list!</h3>
        <p className="mt-2 text-sm text-emerald-600" style={{ fontFamily: "var(--font-body)" }}>
          We&apos;ll be in touch shortly. Keep your phone handy — we&apos;ll set you up within days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] ${
            errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Business email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@smithplumbing.co.uk"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] ${
            errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 7700 900000"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] ${
            errors.phone ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
          }`}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[#f97316] py-4 text-base font-bold text-white shadow-lg shadow-[#f97316]/20 hover:bg-[#fb923c] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Request early access →"}
      </button>
      <p className="text-center text-xs text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
        No card required. We&apos;ll reach out within 24 hours.
      </p>
    </form>
  );
}
