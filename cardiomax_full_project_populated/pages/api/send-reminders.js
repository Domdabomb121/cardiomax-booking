import { supabase } from '../../lib/supabase'
import { sendConfirmationEmail } from '../../lib/sendEmail'
import { sendSMS } from '../../lib/sendSMS'
import { addHours } from 'date-fns'

export default async function handler(req, res){
  const hoursBefore = parseInt(process.env.DEFAULT_REMINDER_HOURS || '24', 10)
  const now = new Date()
  const target = addHours(now, hoursBefore)
  const dateString = target.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .eq('date', dateString)

  if(error) return res.status(500).json({ error: error.message })

  for(const b of data){
    await sendConfirmationEmail({
      to: b.email,
      subject: 'Reminder: Upcoming CardioMax appointment',
      html: `<p>Hi ${b.name},</p><p>This is a reminder for your ${b.type} on ${b.date} at ${b.time}.</p>`
    })

    if(b.phone){
      await sendSMS(b.phone, `Reminder: Your CardioMax appointment on ${b.date} at ${b.time}. Reply CANCEL to cancel.`)
    }
  }

  res.json({ sent: data.length })
}
