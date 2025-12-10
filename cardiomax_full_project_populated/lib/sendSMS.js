import Twilio from 'twilio'
const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendSMS(to, body){
  return client.messages.create({
    body,
    from: process.env.TWILIO_FROM_NUMBER,
    to
  })
}
