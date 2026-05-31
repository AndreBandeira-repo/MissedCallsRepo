import twilio from "twilio";

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    throw new Error("Missing Twilio credentials");
  }

  return twilio(sid, token);
}

export function getTwilioFromNumber() {
  const number = process.env.TWILIO_PHONE_NUMBER;
  if (!number) throw new Error("Missing TWILIO_PHONE_NUMBER");
  return number;
}

export function formatSmsTemplate(
  template: string,
  vars: { business_name: string; form_link: string; booking_link?: string }
) {
  return template
    .replace(/\{business_name\}/g, vars.business_name)
    .replace(/\{form_link\}/g, vars.form_link)
    .replace(/\{booking_link\}/g, vars.booking_link ?? vars.form_link);
}
