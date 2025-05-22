import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { CohereClient } from 'npm:cohere-ai@7.17.1'; // Import CohereClient class

// Get Cohere API key from environment variables (Supabase Secrets)
const COHERE_API_KEY = Deno.env.get('COHERE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Ensure API key is set before proceeding with the actual request
  if (!COHERE_API_KEY) {
     console.error("COHERE_API_KEY is not set in Supabase Secrets.");
     return new Response(JSON.stringify({ error: "Cohere API key is not configured on the server." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Instantiate CohereClient with the API key
  const cohere = new CohereClient({
    token: COHERE_API_KEY, // Use 'token' for initialization
  });

  try {
    const { messages } = await req.json();
    console.log("Edge Function: Received messages:", messages);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid or empty messages array" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the latest user message
    const latestUserMessage = messages.findLast((msg: any) => msg.sender === 'user');
    // History should exclude the latest user message as it's passed separately
    const chatHistory = messages
      .filter((msg: any) => msg.id !== latestUserMessage?.id)
      .map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'chatbot',
        message: msg.text,
      }));

    const response = await cohere.chat({ // Use the instance method
      model: 'command-r-plus-08-2024',
      message: latestUserMessage?.text || '',
      chatHistory: chatHistory,
      // Add other parameters as needed
    });

    console.log("Edge Function: Received response from Cohere:", response);

    const aiResponseText = response.text;

    if (!aiResponseText) {
      return new Response(JSON.stringify({ error: "No text response received from Cohere API." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ response: aiResponseText }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred in the Edge Function." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});