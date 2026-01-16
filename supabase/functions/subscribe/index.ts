import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name }: SubscribeRequest = await req.json();

    if (!email || !email.includes("@")) {
      throw new Error("Valid email is required");
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, verified, unsubscribed_at, name")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      if (existing.verified && !existing.unsubscribed_at) {
        return new Response(
          JSON.stringify({ message: "You're already subscribed!" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Re-subscribe or update
      await supabase
        .from("subscribers")
        .update({ 
          verified: true, 
          unsubscribed_at: null,
          name: name || existing.name,
          verification_token: null 
        })
        .eq("id", existing.id);

      return new Response(
        JSON.stringify({ message: "Welcome back! You've been re-subscribed." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create new subscriber (auto-verified for simplicity)
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        verified: true, // Auto-verify for simplicity
        verification_token: null
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to subscribe");
    }

    console.log(`New subscriber: ${email}`);

    return new Response(
      JSON.stringify({ message: "Successfully subscribed to blog updates!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in subscribe:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
