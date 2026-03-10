import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
})

Deno.serve(async (req) => {
  const { chiringuito_id, email, nombre } = await req.json()

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    business_profile: { name: nombre },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://chiringapp.com/panel',
    return_url: 'https://chiringapp.com/panel?stripe=ok',
    type: 'account_onboarding',
  })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  await fetch(`${supabaseUrl}/rest/v1/chiringuitos?id=eq.${chiringuito_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ stripe_account_id: account.id }),
  })

  return new Response(JSON.stringify({ url: accountLink.url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})