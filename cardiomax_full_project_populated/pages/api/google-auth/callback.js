export default async function handler(req,res){
  res.status(200).send('Google OAuth callback - use the scripts/google-oauth-helper.js for manual token generation.')
}
