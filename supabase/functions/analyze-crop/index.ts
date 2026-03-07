import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image, filename } = await req.json();
    if (!image) throw new Error("No image provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert agricultural pathologist AI. Analyze crop leaf images and diagnose diseases.
You must respond using the suggest_diagnosis tool.
If the image is not a plant/crop leaf, respond with disease "Not a crop image" and appropriate description.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this crop leaf image (filename: ${filename}). Identify any diseases, provide treatment recommendations and prevention tips.`,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${image}` },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_diagnosis",
              description: "Return the crop disease diagnosis result",
              parameters: {
                type: "object",
                properties: {
                  disease: {
                    type: "string",
                    description: "Name of the disease, or 'Healthy' if no disease detected",
                  },
                  confidence: {
                    type: "string",
                    description: "Confidence level like 'High', 'Medium', 'Low'",
                  },
                  description: {
                    type: "string",
                    description: "Brief description of the disease and its impact on the crop",
                  },
                  treatment: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of treatment recommendations",
                  },
                  prevention: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of prevention tips",
                  },
                },
                required: ["disease", "confidence", "description", "treatment", "prevention"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_diagnosis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No diagnosis returned");

    const diagnosis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-crop error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
