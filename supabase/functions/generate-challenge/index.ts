
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { existingTitles } = await req.json();

    if (!Array.isArray(existingTitles)) {
        return new Response(JSON.stringify({ error: "existingTitles must be an array" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const systemPrompt = `You are a creative guide for a mindfulness and self-awareness app called "BUGGED_BEING". Your task is to generate a new, unique "Presence Challenge". The tone should be slightly mysterious, tech-infused, and focused on sensory experience and being present.

The user has already seen these challenges:
- ${existingTitles.join('\n- ')}

Generate one new challenge. It must be different from the list above.
Provide a "title" (3-5 words, uppercase), a "description" (1-2 sentences), and a "difficulty" (EASY, MEDIUM, or HARD).

Respond ONLY with a single, minified JSON object in the following format:
{"title": "...", "description": "...", "difficulty": "..."}`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate a new presence challenge.' }],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Anthropic API error:", errorBody);
        throw new Error(`Anthropic API Error: ${errorBody}`);
    }

    const responseData = await response.json();
    const newChallengeText = responseData.content[0].text;
    
    try {
        const newChallenge = JSON.parse(newChallengeText);
        return new Response(JSON.stringify(newChallenge), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Failed to parse JSON from Anthropic response:", newChallengeText);
        throw new Error("Received malformed JSON from challenge generation service.");
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
