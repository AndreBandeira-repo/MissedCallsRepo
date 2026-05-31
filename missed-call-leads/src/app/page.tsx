import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="font-semibold text-[var(--primary)]">CallBack Leads</span>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-[var(--muted)] hover:underline">
              Log in
            </Link>
            <Link href="/signup">
              <Button size="sm">Start free trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--primary)]">
          For plumbers, electricians &amp; gas engineers
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Turn missed calls into booked jobs
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">
          When you miss a call, we instantly text the customer, capture their job
          details, and drop a new lead in your dashboard — so you stop losing work.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup">
            <Button size="md" className="px-6 py-3 text-base">
              Get started — under 10 minutes
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="md" className="px-6 py-3 text-base">
              Business login
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-6 text-left sm:grid-cols-3">
          {[
            {
              title: "Missed call detected",
              body: "Forward your business line to our number. No answer? We trigger instantly.",
            },
            {
              title: "Customer gets SMS",
              body: "Apology + link to reply or fill a quick job form on their phone.",
            },
            {
              title: "Lead in your dashboard",
              body: "Name, phone, issue, status — plus email when a new lead lands.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
