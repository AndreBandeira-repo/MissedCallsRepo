import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createLeadAndNotify } from "@/lib/leads";

const schema = z.object({
  businessId: z.string().uuid(),
  phone: z.string().min(8),
  name: z.string().optional(),
  jobType: z.string().optional(),
  message: z.string().min(3),
  urgency: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = schema.parse(json);

    const lead = await createLeadAndNotify({
      businessId: data.businessId,
      callerPhone: data.phone,
      callerName: data.name,
      message: data.message,
      jobType: data.jobType,
      urgency: data.urgency,
      source: "form",
    });

    if (!lead) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
