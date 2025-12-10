import { useState } from 'react'

export default function CancelPage(){
  const [bookingId, setBookingId] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleCancel(e){
    e.preventDefault()
    const res = await fetch('/api/cancel-booking', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ bookingId }) })
    const json = await res.json()
    if(json.success) setMessage('Booking cancelled')
    else setMessage(json.error || 'Error')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl">Manage Booking</h1>
      <form onSubmit={handleCancel} className="max-w-md mt-4">
        <input placeholder="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} className="w-full p-2 mb-2" />
        <button className="bg-red-600 text-white p-2 rounded">Cancel Booking</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </main>
  )
}
