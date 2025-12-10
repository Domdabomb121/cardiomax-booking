import Stripe from 'stripe'
import { supabase } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, phone, type, date, time, price_cents } = req.body

  const { data, error } = await supabase.from('bookings').insert([
    { name, email, phone, type, date, time, status: 'pending' }
  ]).select().single()

  if(error) return res.status(500).json({ error: error.message })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: {name: `${type} - ${date}`}, unit_amount: price_cents || 5000 }, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    metadata: { booking_id: data.id },
  })

  res.status(200).json({ url: session.url })
}
