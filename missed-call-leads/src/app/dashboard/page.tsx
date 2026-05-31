import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import type { Lead, LeadSource } from "@/lib/types";

const sourceLabels: Record<LeadSource, string> = {
  missed_call: "Missed Call",
  sms: "SMS",
  form: "Form",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, business_name")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/setup");

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const rows = (leads ?? []) as Lead[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-[var(--muted)]">
            {rows.length} total — recover jobs from missed calls
          </p>
        </div>
        <Link
          href="/setup"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Settings &amp; Twilio setup →
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
          <p className="font-medium text-slate-800">No leads yet</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Forward your business line to your Twilio number (see Settings).
            When you miss a call, leads appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-slate-50 text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-medium text-[var(--primary)] hover:underline"
                    >
                      {lead.caller_name ?? "Unknown"}
                    </Link>
                    <p className="text-xs text-[var(--muted)]">{lead.caller_phone}</p>
                  </td>
                  <td className="px-4 py-3">{sourceLabels[lead.source]}</td>
                  <td className="max-w-xs truncate px-4 py-3" title={lead.message}>
                    {lead.job_type ? `${lead.job_type}: ` : ""}
                    {lead.message}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                    {formatTime(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect leadId={lead.id} current={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
