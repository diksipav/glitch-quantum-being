
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Create a single absurd meditation prompt. Return ONLY a JSON object with "title" and "description" fields. The title should be 2-4 words, surreal and cosmic. The description should be one sentence, 15-25 words, describing an imaginative meditation scenario involving cosmic, quantum, or surreal elements. Make it creative and mind-bending but suitable for meditation.`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content[0].text
    
    // Parse the JSON from Claude's response
    const meditation = JSON.parse(content)
    
    return new Response(JSON.stringify(meditation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        title: "Quantum Echoes",
        description: "Imagine your thoughts are radio signals bouncing between parallel dimensions, each echo bringing wisdom from alternate versions of yourself."
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
