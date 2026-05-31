"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Business } from "@/lib/types";

const DEFAULT_TEMPLATE =
  "Sorry we missed your call from {business_name}. What do you need help with? Reply here or tell us more: {form_link}";

export function SetupForm({
  userEmail,
  initial,
}: {
  userEmail: string;
  initial: Business | null;
}) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initial?.business_name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initial?.phone_number ?? "");
  const [notificationEmail, setNotificationEmail] = useState(
    initial?.notification_email ?? userEmail
  );
  const [smsTemplate, setSmsTemplate] = useState(
    initial?.sms_template ?? DEFAULT_TEMPLATE
  );
  const [bookingLink, setBookingLink] = useState(initial?.booking_link ?? "");
  const [twilioNumber, setTwilioNumber] = useState(initial?.twilio_number ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Not logged in");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      business_name: businessName,
      email: userEmail,
      phone_number: phoneNumber || null,
      twilio_number: twilioNumber || null,
      sms_template: smsTemplate,
      booking_link: bookingLink || null,
      notification_email: notificationEmail,
    };

    if (initial) {
      const { error } = await supabase
        .from("businesses")
        .update(payload)
        .eq("id", initial.id);
      setMessage(error ? error.message : "Settings saved.");
    } else {
      const { error } = await supabase.from("businesses").insert(payload);
      setMessage(error ? error.message : "Business created! Configure Twilio below.");
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm"
    >
      <Input
        label="Business name"
        required
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />
      <Input
        label="Your business phone (for Twilio to forward to)"
        type="tel"
        placeholder="+447..."
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        label="Twilio number assigned to you (optional)"
        type="tel"
        placeholder="Same as platform number for MVP"
        value={twilioNumber}
        onChange={(e) => setTwilioNumber(e.target.value)}
      />
      <Input
        label="Notification email"
        type="email"
        required
        value={notificationEmail}
        onChange={(e) => setNotificationEmail(e.target.value)}
      />
      <Input
        label="Booking link (optional)"
        type="url"
        placeholder="https://..."
        value={bookingLink}
        onChange={(e) => setBookingLink(e.target.value)}
      />
      <Textarea
        label="SMS template"
        rows={4}
        value={smsTemplate}
        onChange={(e) => setSmsTemplate(e.target.value)}
      />
      <p className="text-xs text-[var(--muted)]">
        Variables: {"{business_name}"}, {"{form_link}"}, {"{booking_link}"}
      </p>
      {message && (
        <p
          className={`text-sm ${message.includes("saved") || message.includes("created") ? "text-green-700" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : initial ? "Save settings" : "Create business"}
      </Button>
    </form>
  );
}
