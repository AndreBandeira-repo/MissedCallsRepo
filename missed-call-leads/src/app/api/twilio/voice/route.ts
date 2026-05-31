import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Twilio voice webhook — configure on your Twilio number:
 * Voice URL: POST {APP_URL}/api/twilio/voice
 * Status callback: POST {APP_URL}/api/twilio/status
 *
 * Query param ?business_id=UUID routes the call to the correct business.
 * For MVP: one Twilio number per platform, map via business_id in webhook URL
 * or match called number to business.twilio_number.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const from = (form.get("From") as string) ?? "";
  const to = (form.get("To") as string) ?? "";
  const callSid = (form.get("CallSid") as string) ?? "";
  const businessId = request.nextUrl.searchParams.get("business_id");

  const supabase = createAdminClient();

  let businessQuery = supabase.from("businesses").select("*").eq("is_active", true);

  if (businessId) {
    businessQuery = businessQuery.eq("id", businessId);
  } else {
    businessQuery = businessQuery.eq("twilio_number", to);
  }

  const { data: business } = await businessQuery.single();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const statusUrl = business
    ? `${baseUrl}/api/twilio/status?business_id=${business.id}`
    : `${baseUrl}/api/twilio/status`;

  // Ring briefly then go to voicemail/no-answer to trigger missed-call flow
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="15" action="${statusUrl}" method="POST">
    <Number>${business?.phone_number ?? ""}</Number>
  </Dial>
  <Say voice="alice">Sorry, we are unable to take your call right now. We will text you shortly.</Say>
  <Hangup/>
</Response>`;

  if (business && from) {
    await supabase.from("calls").insert({
      business_id: business.id,
      caller_phone: from,
      call_status: "no_answer",
      twilio_call_sid: callSid,
    });
  }

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
