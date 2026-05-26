import React, { useState } from "react";
import axios from "axios";

function AddEvent() {
  const [event, setEvent] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
  });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/events", event);
    alert("Event Added");
  };

  return (
    <div>
      <h2>Add Event</h2>

      <input placeholder="Title" onChange={e=>setEvent({...event,title:e.target.value})}/>
      <input placeholder="Date" onChange={e=>setEvent({...event,date:e.target.value})}/>
      <input placeholder="Venue" onChange={e=>setEvent({...event,venue:e.target.value})}/>
      <input placeholder="Description" onChange={e=>setEvent({...event,description:e.target.value})}/>

      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default AddEvent;
