import { google } from 'googleapis'
import readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

;(async () => {
  try {
    const client_id = process.env.GOOGLE_CLIENT_ID
    const client_secret = process.env.GOOGLE_CLIENT_SECRET
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob'

    if(!client_id || !client_secret){
      console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your env before running this script.')
      process.exit(1)
    }

    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri)
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent'
    })

    console.log('\n1) Visit this URL in your browser:\n')
    console.log(authUrl)
    const code = await ask('\n2) Paste the code from Google here: ')
    const { tokens } = await oauth2Client.getToken(code.trim())
    console.log('\n=== OAuth Success ===\n')
    console.log('Refresh Token:', tokens.refresh_token)
    console.log('\nAdd this to your .env as GOOGLE_REFRESH_TOKEN=...\n')
    rl.close()
  } catch(err) {
    console.error('Error during OAuth:', err)
    rl.close()
  }
})()
