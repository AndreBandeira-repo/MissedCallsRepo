import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name")
    .eq("user_id", user.id)
    .single();

  return (
    <div>
      <DashboardNav businessName={business?.business_name} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
