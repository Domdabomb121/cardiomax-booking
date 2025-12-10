import { useState } from 'react'

export default function Admin(){
  const [password, setPassword] = useState('')
  const [bookings, setBookings] = useState([])

  async function fetchBookings(){
    const res = await fetch('/api/admin-get-bookings', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ password }) })
    const json = await res.json()
    if(json.error) alert(json.error)
    else setBookings(json)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl">Admin — Bookings</h1>
      <div className="mt-4">
        <input placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 mr-2" />
        <button onClick={fetchBookings} className="bg-red-600 text-white p-2 rounded">Load</button>
      </div>

      <table className="mt-6 w-full border-collapse">
        <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
        <tbody>
          {bookings.map(b=> (
            <tr key={b.id}><td>{b.name}</td><td>{b.email}</td><td>{b.type}</td><td>{b.date}</td><td>{b.time}</td><td>{b.status}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
