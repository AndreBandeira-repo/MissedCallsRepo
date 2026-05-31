import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformAdmin } from "@/lib/admin";
import { AdminBusinessActions } from "@/components/AdminBusinessActions";
import type { Business, Lead } from "@/lib/types";

export default async function AdminBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isPlatformAdmin(user.email)) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: business } = await admin
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (!business) notFound();

  const { data: leads } = await admin
    .from("leads")
    .select("*")
    .eq("business_id", id)
    .order("created_at", { ascending: false });

  const b = business as Business;
  const rows = (leads ?? []) as Lead[];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Link href="/admin" className="text-sm text-[var(--muted)] hover:underline">
        ← All businesses
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{b.business_name}</h1>
          <p className="text-sm text-[var(--muted)]">{b.email}</p>
        </div>
        <AdminBusinessActions businessId={b.id} isActive={b.is_active} />
      </div>

      <h2 className="mt-8 font-semibold">Leads ({rows.length})</h2>
      <ul className="mt-4 space-y-2">
        {rows.map((l) => (
          <li
            key={l.id}
            className="rounded-lg border border-[var(--border)] bg-white p-4 text-sm"
          >
            <span className="font-medium">{l.caller_phone}</span>
            <span className="mx-2 text-[var(--muted)]">·</span>
            <span>{l.status}</span>
            <p className="mt-1 text-[var(--muted)]">{l.message}</p>
          </li>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No leads for this business.</p>
        )}
      </ul>
    </div>
  );
}
