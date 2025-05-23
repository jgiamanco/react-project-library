import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenAI, Modality } from "npm:@google/genai@0.6.0";

const COHERE_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!COHERE_API_KEY) {
    console.error("GEMINI_API_KEY is not set in Supabase Secrets.");
    return new Response(
      JSON.stringify({ error: "Gemini API key is not configured on the server." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { positivePrompt, negativePrompt, size } = await req.json();

    if (!positivePrompt || !size) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: positivePrompt and size" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey: COHERE_API_KEY });

    // Combine positive and negative prompts into one content string
    let contents = positivePrompt;
    if (negativePrompt && negativePrompt.trim().length > 0) {
      contents += `\nNegative prompt: ${negativePrompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        imageConfig: {
          // Assuming the API supports size config like this; adjust if needed
          size: size,
        },
      },
    });

    // Find the image part in the response
    let base64Image: string | null = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (!base64Image) {
      return new Response(
        JSON.stringify({ error: "No image data received from Gemini API." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return base64 image data as data URL
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return new Response(
      JSON.stringify({ imageUrl: dataUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});