import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Leads" },
  { href: "/setup", label: "Settings" },
];

export function DashboardNav({ businessName }: { businessName?: string }) {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-semibold text-[var(--primary)]">
            CallBack Leads
          </Link>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        {businessName && (
          <span className="text-sm text-[var(--muted)]">{businessName}</span>
        )}
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="text-sm text-[var(--muted)] hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
