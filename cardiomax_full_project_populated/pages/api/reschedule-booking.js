import { supabase } from '../../lib/supabase'
import { sendConfirmationEmail } from '../../lib/sendEmail'
import { googleCreateEvent } from '../../lib/googleCalendar'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const { bookingId, newDate, newTime } = req.body
  const { data, error } = await supabase.from('bookings').update({ date:newDate, time:newTime, status:'rescheduled' }).eq('id', bookingId).select().single()
  if(error) return res.status(500).json({ error: error.message })

  if(data.google_event_id){
    await googleCreateEvent({
      summary: `CardioMax: ${data.type}`,
      description: `Rescheduled appointment for ${data.name}`,
      start: { dateTime: new Date(`${newDate}T${newTime}`).toISOString() },
      end: { dateTime: new Date(new Date(`${newDate}T${newTime}`).getTime() + 60*60*1000).toISOString() },
      eventId: data.google_event_id
    })
  }

  await sendConfirmationEmail({ to: data.email, subject: 'Your CardioMax booking was rescheduled', html: `<p>Hi ${data.name},</p><p>Your booking is now ${newDate} at ${newTime}.</p>` })

  res.json({ success: true })
}
