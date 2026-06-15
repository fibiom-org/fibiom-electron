export const INVOICE_PROMPT = `Extract the data from this invoice or bill and return STRICTLY valid JSON
with no explanation and no markdown, matching this schema:
{
  "vendor": string | null,        // who issued the invoice / who is to be paid
  "invoice_number": string | null,
  "date": string | null,          // issue date, ISO 8601 if recognizable
  "due_date": string | null,      // payment due date, ISO 8601 if recognizable
  "currency": string | null,      // ISO code if recognizable, e.g. USD
  "amount_due": number | null,    // total payable
  "items": [{ "description": string, "amount": number | null }]
}
If a field is not recognizable, use null. Numbers must not include a currency symbol or thousands separators.`
