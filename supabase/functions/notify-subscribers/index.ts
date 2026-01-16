import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  post_id: string;
  title: string;
  excerpt: string;
  slug: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Goldenware <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return res.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const { post_id, title, excerpt, slug }: NotifyRequest = await req.json();

    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subscribers, error: subError } = await supabaseAdmin
      .from("subscribers")
      .select("email, name")
      .eq("verified", true)
      .is("unsubscribed_at", null);

    if (subError) {
      console.error("Error fetching subscribers:", subError);
      throw subError;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers to notify", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const baseUrl = Deno.env.get("SITE_URL") || "https://goldenware.co.ke";
    const postUrl = `${baseUrl}/blog/${slug}`;

    const emailPromises = subscribers.map(async (subscriber: { email: string; name: string | null }) => {
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      
      try {
        await sendEmail(
          subscriber.email,
          `New Post: ${title}`,
          `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #f2f2f2; padding: 40px 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #121212; border-radius: 8px; padding: 40px; }
                h1 { color: #f5b642; margin-bottom: 8px; }
                .excerpt { color: #999; font-size: 16px; line-height: 1.6; margin: 20px 0; }
                .cta { display: inline-block; background: linear-gradient(135deg, #f5c842, #f5b642, #cc9432); color: #0a0a0a; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #2e2e2e; font-size: 12px; color: #666; }
                .unsubscribe { color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <p style="color: #999; margin-bottom: 20px;">Hi${subscriber.name ? ` ${subscriber.name}` : ''},</p>
                <h1>${title}</h1>
                <p class="excerpt">${excerpt || 'Check out our latest post on the Goldenware blog.'}</p>
                <a href="${postUrl}" class="cta">Read the Full Post</a>
                <div class="footer">
                  <p>You're receiving this because you subscribed to Goldenware blog updates.</p>
                  <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a></p>
                </div>
              </div>
            </body>
            </html>
          `
        );
        return { success: true, email: subscriber.email };
      } catch (err) {
        console.error(`Failed to send to ${subscriber.email}:`, err);
        return { success: false, email: subscriber.email, error: err };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Sent ${successCount}/${subscribers.length} notification emails for post: ${title}`);

    return new Response(
      JSON.stringify({ 
        message: `Notifications sent to ${successCount} subscribers`,
        count: successCount,
        total: subscribers.length 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-subscribers:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
