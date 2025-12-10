import { useState } from 'react'

export default function Home(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', type:'personal_training', date:'', time:'', price_cents:5000 })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/create-checkout-session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form) })
    const json = await res.json()
    if(json.url) window.location = json.url
    else alert('Error creating session')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-neutral-900 p-6 rounded-2xl border border-red-600 w-full">
        <h1 className="text-2xl text-red-500 mb-4 font-bold">CardioMax Booking</h1>

        <input name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full p-2 mb-2 rounded" required />
        <input name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 mb-2 rounded" required />
        <input name="phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone (optional)" className="w-full p-2 mb-2 rounded" />
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full p-2 mb-2 rounded">
          <option value="personal_training">Personal Training</option>
          <option value="boxing_session">Boxing Session</option>
          <option value="fitness_assessment">Fitness Assessment</option>
          <option value="online_coaching">Online Coaching</option>
        </select>
        <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full p-2 mb-2 rounded" required />
        <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="w-full p-2 mb-2 rounded" required />

        <button disabled={loading} className="w-full bg-red-600 py-2 rounded-xl mt-2">{loading ? 'Processing...':'Pay & Book'}</button>
      </form>
    </main>
  )
}
