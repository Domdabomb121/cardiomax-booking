import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

export async function googleCreateEvent({ summary, description, start, end, attendees = [], eventId }) {
  const event = { summary, description, start, end, attendees }
  if(eventId){
    try{
      const res = await calendar.events.update({ calendarId: 'primary', eventId, requestBody: event })
      return res.data
    }catch(err){
      // fallback to insert
    }
  }
  const insert = await calendar.events.insert({ calendarId: 'primary', requestBody: event })
  return insert.data
}
