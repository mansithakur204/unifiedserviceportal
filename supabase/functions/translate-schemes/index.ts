import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get schemes without Hindi translations
    const { data: schemes, error } = await supabase
      .from("schemes")
      .select("id, scheme_name, details, eligibility, benefits, documents, helpline, funding_amount")
      .is("scheme_name_hi", null)
      .limit(5);

    if (error) throw error;
    if (!schemes || schemes.length === 0) {
      return new Response(JSON.stringify({ message: "All schemes already translated", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let translatedCount = 0;

    for (const scheme of schemes) {
      const fieldsToTranslate: Record<string, string> = {};
      if (scheme.scheme_name) fieldsToTranslate.scheme_name = scheme.scheme_name;
      if (scheme.details) fieldsToTranslate.details = scheme.details;
      if (scheme.eligibility) fieldsToTranslate.eligibility = scheme.eligibility;
      if (scheme.benefits) fieldsToTranslate.benefits = scheme.benefits;
      if (scheme.documents) fieldsToTranslate.documents = scheme.documents;
      if (scheme.helpline) fieldsToTranslate.helpline = scheme.helpline;
      if (scheme.funding_amount) fieldsToTranslate.funding_amount = scheme.funding_amount;

      const prompt = `Translate the following JSON values from English to Hindi. Keep the JSON keys exactly the same. Return ONLY valid JSON, no markdown, no extra text. Context: These are Indian government scheme details for rural citizens.\n\n${JSON.stringify(fieldsToTranslate)}`;

      // Add delay between requests to avoid rate limiting
      if (translatedCount > 0) {
        await delay(2000);
      }

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI failed for scheme ${scheme.id}:`, errText);
        if (aiResponse.status === 429) {
          // Stop on rate limit, return what we have
          break;
        }
        continue;
      }

      const aiData = await aiResponse.json();
      let translatedText = aiData.choices?.[0]?.message?.content || "";
      
      // Clean markdown code blocks if present
      translatedText = translatedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        const translated = JSON.parse(translatedText);
        
        const updateData: Record<string, string | null> = {};
        if (translated.scheme_name) updateData.scheme_name_hi = translated.scheme_name;
        if (translated.details) updateData.details_hi = translated.details;
        if (translated.eligibility) updateData.eligibility_hi = translated.eligibility;
        if (translated.benefits) updateData.benefits_hi = translated.benefits;
        if (translated.documents) updateData.documents_hi = translated.documents;
        if (translated.helpline) updateData.helpline_hi = translated.helpline;
        if (translated.funding_amount) updateData.funding_amount_hi = translated.funding_amount;

        await supabase.from("schemes").update(updateData).eq("id", scheme.id);
        translatedCount++;
      } catch (parseErr) {
        console.error(`Failed to parse translation for scheme ${scheme.id}:`, parseErr, translatedText);
      }
    }

    const { count: remaining } = await supabase
      .from("schemes")
      .select("id", { count: "exact", head: true })
      .is("scheme_name_hi", null);

    return new Response(
      JSON.stringify({ message: `Translated ${translatedCount} schemes`, count: translatedCount, remaining: remaining ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Translation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
