"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLink, setMagicLink] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    if (magicLink) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setMessage(error ? error.message : "Check your email for the magic link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "#0c0c0e", fontFamily: "var(--font-display)" }}
    >
      {/* grid bg */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* amber glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#f97316]/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold text-white">
            Callback<span className="text-[#f97316]">Leads</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#141416] p-8">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
            Access your leads dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@smithplumbing.co.uk"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
              />
            </div>

            {!magicLink && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white/70">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
                />
              </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={magicLink}
                  onChange={(e) => setMagicLink(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all ${magicLink ? "bg-[#f97316] border-[#f97316]" : "border-white/20 bg-white/5"}`}>
                  {magicLink && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                Use magic link instead
              </span>
            </label>

            {message && (
              <p className={`rounded-xl px-4 py-3 text-sm ${
                message.includes("Check")
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f97316] py-4 text-base font-bold text-white shadow-lg shadow-[#f97316]/20 hover:bg-[#fb923c] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : magicLink ? "Send magic link →" : "Log in →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30" style={{ fontFamily: "var(--font-body)" }}>
            No account?{" "}
            <Link href="/signup" className="text-[#f97316] hover:text-[#fb923c] transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
