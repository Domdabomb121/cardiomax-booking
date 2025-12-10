import { supabase } from '../../lib/supabase'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if(password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })
  const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  res.json(data)
}
