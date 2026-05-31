import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormLink } from "@/lib/leads";
import { formatSmsTemplate, getTwilioClient, getTwilioFromNumber } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const dialStatus = (form.get("DialCallStatus") as string) ?? "";
  const callStatus = (form.get("CallStatus") as string) ?? "";
  const from = (form.get("From") as string) ?? "";
  const businessId = request.nextUrl.searchParams.get("business_id");

  const missed =
    dialStatus === "no-answer" ||
    dialStatus === "busy" ||
    dialStatus === "failed" ||
    dialStatus === "canceled" ||
    callStatus === "no-answer" ||
    callStatus === "busy";

  if (!missed || !from) {
    return new NextResponse("", { status: 200 });
  }

  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId ?? "")
    .eq("is_active", true)
    .single();

  if (!business) {
    return new NextResponse("", { status: 200 });
  }

  await supabase.from("calls").insert({
    business_id: business.id,
    caller_phone: from,
    call_status: "missed",
  });

  const formLink = getFormLink(business.id, from);
  const body = formatSmsTemplate(business.sms_template, {
    business_name: business.business_name,
    form_link: formLink,
    booking_link: business.booking_link ?? undefined,
  });

  try {
    const client = getTwilioClient();
    await client.messages.create({
      from: getTwilioFromNumber(),
      to: from,
      body,
    });
  } catch (e) {
    console.error("Failed to send missed-call SMS:", e);
  }

  return new NextResponse("", { status: 200 });
}
