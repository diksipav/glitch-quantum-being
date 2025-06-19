
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { existingTitles = [] } = await req.json()

    const themes = [
      "Cosmic Whisper", "Quantum Perspective", "Temporal Dislocation", "Parallel Universe Observer",
      "Void Navigator", "Dream Reality Merger", "Consciousness Explorer", "Interdimensional Tourist",
      "Time Loop Detective", "Memory Architect", "Reality Hacker", "Existence Questioner"
    ]

    const descriptions = [
      "Pretend every sound you hear is a secret message from the universe trying to communicate in code.",
      "Imagine you're simultaneously in all possible versions of your current location across the multiverse.",
      "Picture that you're actually remembering this moment from 10 years in the future.",
      "Visualize your thoughts as confused tourists in a city where all street signs are written in an alien language.",
      "Act as if you're a detective investigating why this exact moment exists instead of infinite other possibilities.",
      "Pretend you're an alien anthropologist studying the strange ritual humans call 'sitting still'.",
      "Imagine your consciousness is a radio trying to tune into the frequency of absolute nothingness.",
      "Visualize yourself as a character in a dream that's being dreamed by your future self.",
      "Pretend you're a time traveler who got stuck in this moment and must find the exit through pure awareness.",
      "Imagine you're conducting an orchestra where each thought is an instrument playing the symphony of now."
    ]

    // Filter out existing titles
    const availableThemes = themes.filter(theme => !existingTitles.includes(theme))
    const finalThemes = availableThemes.length > 0 ? availableThemes : themes

    const randomTheme = finalThemes[Math.floor(Math.random() * finalThemes.length)]
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

    const meditation = {
      title: randomTheme,
      description: randomDescription
    }

    return new Response(
      JSON.stringify(meditation),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
