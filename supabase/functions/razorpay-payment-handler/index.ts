
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency, receipt } = await req.json()
    
    const keyId = Deno.env.get('KEY_ID')
    const keySecret = Deno.env.get('KEY_SECRET')
    
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Create Razorpay order
    const orderData = {
      amount: amount, // amount in smallest currency unit
      currency: currency,
      receipt: receipt,
      payment_capture: 1
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Razorpay API error:', errorText)
      throw new Error(`Razorpay API error: ${response.status}`)
    }

    const order = await response.json()
    
    return new Response(
      JSON.stringify(order),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error creating order:', error)
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
