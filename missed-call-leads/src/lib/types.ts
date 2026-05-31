export type LeadSource = "missed_call" | "sms" | "form";
export type LeadStatus = "new" | "contacted" | "booked" | "completed";
export type CallStatus = "missed" | "answered" | "no_answer";

export type Business = {
  id: string;
  user_id: string;
  business_name: string;
  email: string;
  phone_number: string | null;
  twilio_number: string | null;
  sms_template: string;
  booking_link: string | null;
  notification_email: string;
  is_active: boolean;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  business_id: string;
  caller_phone: string;
  caller_name: string | null;
  message: string;
  job_type: string | null;
  urgency: string | null;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type Call = {
  id: string;
  business_id: string;
  caller_phone: string;
  call_status: CallStatus;
  twilio_call_sid: string | null;
  created_at: string;
};

export const JOB_TYPES = [
  "Plumbing",
  "Electrical",
  "Boiler / Heating",
  "Emergency",
  "Other",
] as const;

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
];
