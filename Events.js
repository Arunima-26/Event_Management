import React, { useState, useEffect } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", venue: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/events");
    setEvents(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/events/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/events", form);
    }
    setForm({ name: "", description: "", venue: "" });
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5000/events/${id}`);
    fetchEvents();
  };

  const editEvent = (e) => {
    setForm(e);
    setEditId(e.id);
  };

  return (
    <div className="card">
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Desc" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      <input placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/>

      <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>

      {events.map(e=>(
        <div key={e.id}>
          <p>{e.name} - {e.venue}</p>
          <button onClick={()=>editEvent(e)}>Edit</button>
          <button onClick={()=>deleteEvent(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Events;
