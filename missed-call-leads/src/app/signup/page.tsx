"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_name: businessName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/setup";
    } else {
      setMessage("Check your email to confirm your account, then log in.");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "#0c0c0e", fontFamily: "var(--font-display)" }}
    >
      {/* subtle grid bg */}
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
          <h1 className="text-2xl font-bold text-white">Start your free trial</h1>
          <p className="mt-1 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
            Set up missed-call recovery in under 10 minutes
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">
                Business name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Smith Plumbing Ltd"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@smithplumbing.co.uk"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
              />
            </div>

            {message && (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  message.includes("Check")
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f97316] py-4 text-base font-bold text-white shadow-lg shadow-[#f97316]/20 hover:bg-[#fb923c] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30" style={{ fontFamily: "var(--font-body)" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#f97316] hover:text-[#fb923c] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
