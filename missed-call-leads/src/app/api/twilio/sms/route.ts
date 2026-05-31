import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLeadAndNotify } from "@/lib/leads";

/**
 * Inbound SMS — configure on Twilio number:
 * Messaging URL: POST {APP_URL}/api/twilio/sms
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const from = (form.get("From") as string) ?? "";
  const body = ((form.get("Body") as string) ?? "").trim();
  const to = (form.get("To") as string) ?? "";

  if (!from || !body) {
    return new NextResponse("", { status: 200 });
  }

  const businessId = request.nextUrl.searchParams.get("business_id");
  const supabase = createAdminClient();

  let query = supabase.from("businesses").select("*").eq("is_active", true);

  if (businessId) {
    query = query.eq("id", businessId);
  } else {
    query = query.eq("twilio_number", to);
  }

  const { data: business } = await query.single();

  if (!business) {
    return new NextResponse("", { status: 200 });
  }

  await createLeadAndNotify({
    businessId: business.id,
    callerPhone: from,
    message: body,
    source: "sms",
  });

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks — we've received your message and will be in touch shortly.</Message>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
