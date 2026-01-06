import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive Q&A knowledge base
const knowledgeBase = `
# ICHRA & Benefits Knowledge Base

## What is ICHRA?
ICHRA stands for Individual Coverage Health Reimbursement Arrangement. It allows employers to reimburse employees tax-free for individual health insurance premiums and qualified medical expenses instead of offering a traditional group health plan.

## How does ICHRA work?
1. Your employer sets a monthly allowance amount
2. You choose your own individual health insurance plan
3. You pay for your premiums and qualified expenses
4. Submit receipts for tax-free reimbursement up to your allowance
5. Unused funds may roll over (depending on employer policy)

## ICHRA Eligibility
- You must be enrolled in individual health coverage (not Medicare or spouse's employer plan)
- Cannot be claimed as a dependent on someone else's tax return
- Must meet any class definitions set by your employer

## What expenses are covered?
- Individual health insurance premiums
- Dental and vision insurance premiums
- Prescription medications
- Doctor visits and copays
- Lab tests and imaging
- Mental health services
- Some over-the-counter medications

## Enrollment & Plan Selection

### How do I enroll?
1. Log into your Member Dashboard
2. Go to the "My Enrollment" tab
3. Browse available plans or click "Find New Plans"
4. Compare options and select a plan
5. Submit your enrollment before the deadline

### Can I change my plan?
You can change plans during:
- Open enrollment period (typically November-January)
- Qualifying life events (marriage, birth, job loss, moving)

### How do I compare plans?
Use the comparison feature in your dashboard - you can select up to 3 plans to compare side-by-side for features, pricing, and coverage details.

## Account & Billing

### How do I view my ID card?
Click the "View ID Card" button on your dashboard overview. You can download or print your digital ID card.

### How do I submit a reimbursement?
1. Keep your receipts and documentation
2. Log into your dashboard
3. Go to Claims & Documents
4. Click "Submit New Claim"
5. Upload documentation and submit

### What is my monthly allowance?
Your monthly ICHRA allowance is set by your employer. View your current allowance and usage on your dashboard.

### When will I receive my reimbursement?
Reimbursements are typically processed within 5-7 business days after claim approval.

## Supplemental Benefits

### What supplemental benefits are available?
- Dental Insurance (Basic, Standard, Premium tiers)
- Vision Insurance
- Life Insurance
- Disability Insurance
- Accident Insurance
- Critical Illness Insurance
- Hospital Indemnity
- Pet Insurance

### How do I add supplemental benefits?
1. Go to "My Enrollment" tab
2. Scroll to "Available Supplemental Benefits"
3. Click "Add Basic" for quick enrollment or "View Plans" to compare options
4. Select your preferred tier and confirm

## Provider Network

### How do I find a provider?
1. Go to the Provider Map page
2. Search by location, specialty, or provider name
3. View in-network status and ratings
4. Get directions or contact information

### What if my doctor is out of network?
You can still see out-of-network providers, but you may pay higher costs. Check your plan details for out-of-network coverage percentages.

## Common Issues

### I can't log in
- Check your email and password
- Use "Forgot Password" to reset
- Clear browser cache and cookies
- Contact support if issues persist

### My claim was denied
- Review denial reason in your claims section
- Ensure the expense is ICHRA-eligible
- Submit additional documentation if requested
- Contact support for appeals

### I need to update my information
- Go to Settings in your dashboard
- Update personal, contact, or banking information
- Changes may take 1-2 business days to process

## Contact Information
- Email: support@healthnex.com
- Phone: 1-800-HEALTHNEX
- Hours: Monday-Friday 8am-8pm EST
- Live Chat: Available on your dashboard
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are HealthNex Support Assistant, a helpful and friendly AI assistant for a health insurance and ICHRA benefits platform.

Your role is to:
1. Answer questions about ICHRA, health insurance, and benefits
2. Guide users to the right features in their dashboard
3. Help with enrollment, claims, and account issues
4. Provide clear, accurate, and empathetic responses

Use this knowledge base to answer questions:
${knowledgeBase}

Guidelines:
- Be friendly, professional, and empathetic
- Keep responses concise but thorough
- If you don't know something, admit it and suggest contacting support
- When relevant, guide users to specific dashboard features (e.g., "You can find this in your 'My Enrollment' tab")
- For complex issues, recommend contacting support directly
- Never make up policy details or coverage information
- Use bullet points and clear formatting for complex answers`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Support chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
