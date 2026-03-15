import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { amount, pedidoId, apoyoAmount = 0 } = await req.json()

    if (amount == null || amount <= 0 || !pedidoId) {
      return new Response(
        JSON.stringify({ error: 'Faltan amount o pedidoId, o amount no es válido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: pedido, error: errPedido } = await supabase
      .from('pedidos')
      .select('id, chiringuito_id')
      .eq('id', pedidoId)
      .single()

    if (errPedido || !pedido?.chiringuito_id) {
      return new Response(
        JSON.stringify({ error: 'Pedido no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: chiringuito, error: errChir } = await supabase
      .from('chiringuitos')
      .select('stripe_account_id')
      .eq('id', pedido.chiringuito_id)
      .single()

    if (errChir || !chiringuito?.stripe_account_id) {
      return new Response(
        JSON.stringify({ error: 'Chiringuito sin cuenta de pago configurada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const amountTotalCents = Math.round(Number(amount) * 100)
    const apoyoCents = Math.round(Number(apoyoAmount) * 100)
    const orderCents = Math.max(0, amountTotalCents - apoyoCents)
    const applicationFeeCents = Math.round(orderCents * 0.15) + apoyoCents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTotalCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      transfer_data: {
        destination: chiringuito.stripe_account_id,
      },
      application_fee_amount: applicationFeeCents,
      metadata: {
        pedido_id: String(pedidoId),
        chiringuito_id: String(pedido.chiringuito_id),
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al crear el pago'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
