import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetupForm } from "@/components/SetupForm";
import { getFormLink } from "@/lib/leads";
import type { Business } from "@/lib/types";

export default async function SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER ?? "(configure in .env)";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-[var(--border)] bg-white px-4 py-4">
        <a href="/dashboard" className="text-sm text-[var(--primary)] hover:underline">
          ← Dashboard
        </a>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Business setup</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Configure your number, SMS template, and notifications
        </p>

        <SetupForm
          userEmail={user.email ?? ""}
          initial={business as Business | null}
        />

        <section className="mt-10 rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="font-semibold">Twilio setup (MVP — Option A)</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
            <li>
              Buy a UK number in{" "}
              <a
                href="https://console.twilio.com"
                className="text-[var(--primary)] underline"
                target="_blank"
                rel="noreferrer"
              >
                Twilio Console
              </a>
              .
            </li>
            <li>
              Set <strong>Voice URL</strong> to:{" "}
              <code className="block mt-1 break-all rounded bg-slate-100 p-2 text-xs text-slate-800">
                {appUrl}/api/twilio/voice
                {business ? `?business_id=${business.id}` : ""}
              </code>
            </li>
            <li>
              Set <strong>Messaging URL</strong> to:{" "}
              <code className="block mt-1 break-all rounded bg-slate-100 p-2 text-xs text-slate-800">
                {appUrl}/api/twilio/sms
              </code>
            </li>
            <li>
              Forward your business mobile to:{" "}
              <strong className="text-slate-900">{twilioNumber}</strong>
            </li>
            <li>Miss a test call — you should receive the auto-SMS and see a lead.</li>
          </ol>
          {business && (
            <p className="mt-4 text-sm">
              Your capture form link:{" "}
              <code className="break-all text-xs">{getFormLink(business.id)}</code>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
