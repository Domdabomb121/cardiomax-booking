import Stripe from 'stripe'
import { buffer } from 'micro'
import { supabase } from '../../lib/supabase'
import { sendConfirmationEmail } from '../../lib/sendEmail'
import { sendSMS } from '../../lib/sendSMS'

export const config = { api: { bodyParser: false } }
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res){
  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET)
  }catch(e){
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object
    const bookingId = session.metadata.booking_id
    await supabase.from('bookings').update({ status: 'confirmed', stripe_payment_intent: session.payment_intent }).eq('id', bookingId)

    const { data } = await supabase.from('bookings').select().eq('id', bookingId).single()

    await sendConfirmationEmail({
      to: data.email,
      subject: 'Your CardioMax Appointment is Confirmed',
      html: `<p>Hi ${data.name},</p><p>Your ${data.type} on ${data.date} at ${data.time} is confirmed.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/cancel?bookingId=${data.id}">Manage booking</a></p>`
    })

    if(data.phone){
      await sendSMS(data.phone, `Your CardioMax appointment on ${data.date} at ${data.time} is confirmed.`)
    }
  }

  res.json({ received: true })
}
