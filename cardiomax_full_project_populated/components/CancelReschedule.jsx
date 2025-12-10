import { useState } from 'react'

export default function CancelReschedule(){
  const [bookingId, setBookingId] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [message, setMessage] = useState('')

  async function handleReschedule(e){
    e.preventDefault()
    const res = await fetch('/api/reschedule-booking', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ bookingId, newDate, newTime }) })
    const json = await res.json()
    if(json.success) setMessage('Rescheduled')
    else setMessage(json.error || 'Error')
  }

  async function handleCancel(e){
    e.preventDefault()
    const res = await fetch('/api/cancel-booking', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ bookingId }) })
    const json = await res.json()
    if(json.success) setMessage('Cancelled')
    else setMessage(json.error || 'Error')
  }

  return (
    <div className="max-w-md">
      <input placeholder="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} className="w-full p-2 mb-2" />
      <form onSubmit={handleReschedule} className="mb-2">
        <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="w-full p-2 mb-2" />
        <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="w-full p-2 mb-2" />
        <button className="bg-blue-600 text-white p-2 rounded mr-2">Reschedule</button>
        <button onClick={handleCancel} className="bg-red-600 text-white p-2 rounded">Cancel</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
