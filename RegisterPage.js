import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Register.css";

function RegisterPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    event_id: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/events")
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  const handleSubmit = async () => {
    if (!form.event_id) return alert("Select event!");

    await axios.post("http://localhost:5000/students", form);
    alert("✅ Registered Successfully");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🎓 Register for Event</h2>

        <input placeholder="First Name" onChange={e=>setForm({...form,first_name:e.target.value})}/>
        <input placeholder="Last Name" onChange={e=>setForm({...form,last_name:e.target.value})}/>
        <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Phone" onChange={e=>setForm({...form,phone:e.target.value})}/>

        <select onChange={e=>setForm({...form,event_id:e.target.value})}>
          <option value="">Select Event</option>
          {events.map(e=>(
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        <button onClick={handleSubmit}>Register</button>
      </div>
    </div>
  );
}

export default RegisterPage;
