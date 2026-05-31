import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformAdmin } from "@/lib/admin";
import type { Business } from "@/lib/types";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isPlatformAdmin(user.email)) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data: businesses } = await admin
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (businesses ?? []) as Business[];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-[var(--border)] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-semibold text-red-700">Platform Admin</h1>
          <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:underline">
            Exit admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-[var(--muted)]">{rows.length} businesses</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Subscription</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{b.business_name}</td>
                  <td className="px-4 py-3">{b.email}</td>
                  <td className="px-4 py-3">{b.phone_number ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        b.is_active
                          ? "text-green-700"
                          : "text-red-600"
                      }
                    >
                      {b.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.subscription_status}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/businesses/${b.id}`}
                      className="text-[var(--primary)] hover:underline"
                    >
                      View leads
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
