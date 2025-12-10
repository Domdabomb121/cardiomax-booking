import { supabase } from '../../lib/supabase'
import { sendConfirmationEmail } from '../../lib/sendEmail'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const { bookingId, reason } = req.body
  const { data, error } = await supabase.from('bookings').update({ status:'cancelled', cancelled_reason: reason }).eq('id', bookingId).select().single()
  if(error) return res.status(500).json({ error: error.message })

  await sendConfirmationEmail({ to: data.email, subject: 'Your CardioMax booking was cancelled', html: `<p>Hi ${data.name},</p><p>Your booking on ${data.date} at ${data.time} was cancelled.</p>` })

  res.json({ success: true })
}
