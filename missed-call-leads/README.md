# CallBack Leads — Missed Call → Instant Lead Capture

MVP SaaS for UK tradespeople (plumbers, electricians, gas engineers). When a business misses a call, the system texts the caller, captures job details via SMS or web form, and logs leads in a simple dashboard.

## What's included

| Feature | Status |
|---------|--------|
| Missed call → auto SMS (Twilio) | ✅ |
| SMS reply → lead | ✅ |
| Mobile capture form | ✅ |
| Lead dashboard + status | ✅ |
| Email notifications (Resend) | ✅ |
| Business setup (template, email) | ✅ |
| Auth (email/password + magic link) | ✅ |
| Platform admin panel | ✅ |
| Stripe billing | ❌ (manual `subscription_status` field) |

## Tech stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend/DB:** Supabase (Postgres + Auth + RLS)
- **SMS/Calls:** Twilio
- **Email:** Resend
- **Hosting:** Vercel

## Quick start

### 1. Install Node.js

Install [Node.js 20+](https://nodejs.org/) so `npm` is available in your terminal.

### 2. Install dependencies

```bash
cd missed-call-leads
npm install
cp .env.example .env.local
```

### 3. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor.
3. Copy **Project URL**, **anon key**, and **service role key** into `.env.local`.
4. In Authentication → URL configuration, add:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Twilio

1. Buy a UK phone number.
2. Set environment variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.
3. Configure webhooks (use ngrok for local dev):

| Setting | URL |
|---------|-----|
| Voice → A call comes in | `https://YOUR_DOMAIN/api/twilio/voice?business_id=BUSINESS_UUID` |
| Messaging → A message comes in | `https://YOUR_DOMAIN/api/twilio/sms?business_id=BUSINESS_UUID` |

4. **MVP flow:** Forward the tradesperson's mobile to the Twilio number. Twilio rings their real phone for 15s; if no answer, status webhook sends the SMS.

### 5. Resend

1. Create an API key at [resend.com](https://resend.com).
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (verified domain).

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Sign up → **Settings** → save business → configure Twilio URLs with your `business_id`.

### 7. Platform admin

Set `ADMIN_EMAILS=you@example.com` in `.env.local`. Visit `/admin` when logged in with that email.

## Core user flow

```
Missed call on Twilio number
    → Dial timeout / no-answer
    → POST /api/twilio/status
    → SMS to caller (custom template + form link)
    → Customer replies OR opens /capture?b=...
    → Lead created + email to business
    → Dashboard shows lead (New → Contacted → Booked → Completed)
```

## SMS template variables

- `{business_name}` — business name from setup
- `{form_link}` — mobile capture form with phone pre-filled
- `{booking_link}` — optional Calendly/booking URL

## Deploy to Vercel

1. Push repo to GitHub.
2. Import in Vercel, add all env vars from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to your production URL.
4. Update Supabase auth redirect URLs and Twilio webhooks to production.

## Monetisation (not built)

Track `subscription_status` manually in admin (`trial`, `active`, `cancelled`). Stripe Checkout can be added in a follow-up PR.

## MVP success checklist

- [ ] Business connects number in &lt;10 minutes (forward to Twilio)
- [ ] Missed call triggers SMS within seconds
- [ ] Lead visible in dashboard
- [ ] Owner receives email notification
- [ ] User recovers 1–3 jobs/week from missed calls

## Project structure

```
src/
  app/
    api/twilio/     # Voice, status, inbound SMS webhooks
    api/leads/      # Public form API + status updates
    capture/        # Customer-facing job form
    dashboard/      # Lead CRM table + detail
    setup/          # Business configuration
    admin/          # Platform owner panel
  lib/              # Supabase, Twilio, Resend, lead helpers
supabase/schema.sql # Database + RLS policies
```

## Next steps (post-MVP)

- Per-business Twilio subaccounts / dedicated numbers
- SMS notifications to business owner
- Stripe subscriptions
- SIP/VoIP direct integration (Option B)
- WhatsApp / analytics (explicitly out of scope for MVP)
