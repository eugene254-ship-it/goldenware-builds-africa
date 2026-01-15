import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  organization?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organization, message }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission:", { name, email, organization });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store submission in database
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        organization: organization || null,
        message,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save submission");
    }

    console.log("Contact submission saved to database");

    // Send email using Resend API directly via fetch
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      // Send confirmation email to submitter
      const confirmationRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Goldenware <onboarding@resend.dev>",
          to: [email],
          subject: "Thank you for contacting Goldenware",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; background: #171717; border-radius: 12px; padding: 40px; border: 1px solid #262626; }
                h1 { color: #f5a623; margin-bottom: 24px; }
                p { line-height: 1.6; color: #a3a3a3; }
                .highlight { color: #f5a623; }
                .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #262626; font-size: 14px; color: #737373; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Thank you, ${name}!</h1>
                <p>We've received your message and appreciate you reaching out to Goldenware.</p>
                <p>Our team will review your inquiry and get back to you within <span class="highlight">24-48 hours</span>.</p>
                ${organization ? `<p>Organization: <strong>${organization}</strong></p>` : ''}
                <div class="footer">
                  <p>Best regards,<br>The Goldenware Team<br>Kenya · Since 2013</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      const confirmationData = await confirmationRes.json();
      console.log("Confirmation email sent:", confirmationData);

      // Send notification to admin
      const notificationRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Goldenware Website <onboarding@resend.dev>",
          to: ["hello@goldenware.co.ke"],
          subject: `New Contact: ${name} from ${organization || 'N/A'}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                h1 { color: #171717; margin-bottom: 24px; }
                .field { margin-bottom: 16px; }
                .label { font-weight: 600; color: #737373; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
                .value { color: #171717; font-size: 16px; }
                .message-box { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-top: 24px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🔔 New Contact Form Submission</h1>
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Organization</div>
                  <div class="value">${organization || 'Not provided'}</div>
                </div>
                <div class="message-box">
                  <div class="label">Message</div>
                  <div class="value">${message}</div>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      const notificationData = await notificationRes.json();
      console.log("Admin notification sent:", notificationData);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Contact form submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-contact-email function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
