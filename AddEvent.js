import { useState } from "react";
import axios from "axios";

function AddEvent() {
  const [data, setData] = useState({
    title: "", date: "", venue: "", description: ""
  });

  const submit = () => {
    axios.post("http://localhost:5000/events", data)
      .then(() => alert("Event Created"));
  };

  return (
    <div>
      <h2>Add Event</h2>

      <input placeholder="Title"
        onChange={e => setData({ ...data, title: e.target.value })} />

      <input placeholder="Date"
        onChange={e => setData({ ...data, date: e.target.value })} />

      <input placeholder="Venue"
        onChange={e => setData({ ...data, venue: e.target.value })} />

      <input placeholder="Description"
        onChange={e => setData({ ...data, description: e.target.value })} />

      <button onClick={submit}>Create</button>
    </div>
  );
}

export default AddEvent;