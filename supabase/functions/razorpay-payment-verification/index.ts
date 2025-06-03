
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()
    
    const keySecret = Deno.env.get('KEY_SECRET')
    
    if (!keySecret) {
      throw new Error('Razorpay secret key not configured')
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = createHmac('sha256', keySecret)
      .update(body)
      .digest('hex')

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid signature' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get payment details from Razorpay
    const keyId = Deno.env.get('KEY_ID')
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}`
      }
    })

    if (!paymentResponse.ok) {
      throw new Error('Failed to fetch payment details')
    }

    const paymentData = await paymentResponse.json()
    const totalAmount = paymentData.amount / 100 // Convert from paise to rupees

    // Calculate splits
    const razorpayFee = Math.round(totalAmount * 0.02 * 100) / 100 // 2% to Razorpay (automatically deducted)
    const adminFee = 3.0 // Fixed ₹3 to admin
    const vendorAmount = totalAmount - adminFee // Vendor gets total minus admin fee (Razorpay fee is handled separately)

    // Store payment route information
    const { error: paymentRouteError } = await supabase
      .from('payment_routes')
      .insert({
        order_id: paymentData.notes?.order_id, // This should be passed from the frontend
        total_amount: totalAmount,
        vendor_amount: vendorAmount,
        admin_fee: adminFee,
        razorpay_fee: razorpayFee,
        razorpay_route_id: razorpay_payment_id,
        status: 'completed'
      })

    if (paymentRouteError) {
      console.error('Error storing payment route:', paymentRouteError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment_id: razorpay_payment_id,
        splits: {
          vendor_amount: vendorAmount,
          admin_fee: adminFee,
          razorpay_fee: razorpayFee
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
