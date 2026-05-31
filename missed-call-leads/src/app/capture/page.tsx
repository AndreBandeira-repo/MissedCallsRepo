"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { JOB_TYPES } from "@/lib/types";

function CaptureForm() {
  const params = useSearchParams();
  const businessId = params.get("b") ?? "";
  const prefilledPhone = params.get("phone") ?? "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(prefilledPhone);
  const [jobType, setJobType] = useState<string>(JOB_TYPES[0]);
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) {
      setError("Invalid link — please use the link from your text message.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/leads/public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId,
        phone,
        name: name || undefined,
        jobType,
        message,
        urgency: urgency || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.toString() ?? "Something went wrong");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (!businessId) {
    return (
      <p className="text-center text-red-600">
        This form link is invalid. Please reply to the text you received.
      </p>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-800">We&apos;ve received your request</h1>
        <p className="mt-2 text-[var(--muted)]">
          Someone will be in touch as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold">Tell us what you need</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Quick form — we&apos;ll get back to you shortly
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Phone number"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Select
          label="Job type"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
        />
        <Textarea
          label="Describe the issue"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Boiler not heating, leak under sink…"
        />
        <Select
          label="Urgency (optional)"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          options={[
            { value: "", label: "Select…" },
            { value: "Emergency", label: "Emergency — today" },
            { value: "This week", label: "This week" },
            { value: "Flexible", label: "Flexible" },
          ]}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? "Sending…" : "Submit request"}
        </Button>
      </form>
    </>
  );
}

export default function CapturePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <Suspense fallback={<p className="text-center text-sm">Loading…</p>}>
          <CaptureForm />
        </Suspense>
      </div>
    </div>
  );
}
