import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import type { Lead, LeadSource } from "@/lib/types";

const sourceLabels: Record<LeadSource, string> = {
  missed_call: "Missed Call",
  sms: "SMS",
  form: "Form",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/setup");

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (!lead) notFound();

  const l = lead as Lead;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:underline">
        ← Back to leads
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{l.caller_name ?? "Unknown caller"}</h1>
      <p className="text-[var(--muted)]">{l.caller_phone}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--muted)]">Status</p>
          <div className="mt-2">
            <LeadStatusSelect leadId={l.id} current={l.status} />
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-4">
          <p className="text-xs uppercase text-[var(--muted)]">Source</p>
          <p className="mt-2 font-medium">{sourceLabels[l.source]}</p>
        </div>
        {l.job_type && (
          <div className="rounded-lg border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase text-[var(--muted)]">Job type</p>
            <p className="mt-2 font-medium">{l.job_type}</p>
          </div>
        )}
        {l.urgency && (
          <div className="rounded-lg border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase text-[var(--muted)]">Urgency</p>
            <p className="mt-2 font-medium">{l.urgency}</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-[var(--border)] bg-white p-4">
        <p className="text-xs uppercase text-[var(--muted)]">Message</p>
        <p className="mt-2 whitespace-pre-wrap">{l.message}</p>
      </div>

      <p className="mt-4 text-sm text-[var(--muted)]">
        Received {new Date(l.created_at).toLocaleString("en-GB")}
      </p>

      <a
        href={`tel:${l.caller_phone}`}
        className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-dark)]"
      >
        Call customer
      </a>
    </div>
  );
}
