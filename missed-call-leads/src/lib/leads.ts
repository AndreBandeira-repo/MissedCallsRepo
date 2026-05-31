import { createAdminClient } from "./supabase/admin";
import { sendNewLeadEmail } from "./notifications";
import type { Business, Lead, LeadSource } from "./types";

type CreateLeadInput = {
  businessId: string;
  callerPhone: string;
  callerName?: string;
  message: string;
  jobType?: string;
  urgency?: string;
  source: LeadSource;
};

export async function createLeadAndNotify(input: CreateLeadInput): Promise<Lead | null> {
  const supabase = createAdminClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", input.businessId)
    .eq("is_active", true)
    .single();

  if (!business) return null;

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      business_id: input.businessId,
      caller_phone: input.callerPhone,
      caller_name: input.callerName ?? null,
      message: input.message,
      job_type: input.jobType ?? null,
      urgency: input.urgency ?? null,
      source: input.source,
      status: "new",
    })
    .select()
    .single();

  if (error || !lead) {
    console.error("Failed to create lead:", error);
    return null;
  }

  try {
    await sendNewLeadEmail(business as Business, lead as Lead);
  } catch (e) {
    console.error("Email notification failed:", e);
  }

  return lead as Lead;
}

export function getFormLink(businessId: string, phone?: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({ b: businessId });
  if (phone) params.set("phone", phone);
  return `${base}/capture?${params.toString()}`;
}
