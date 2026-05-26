import React, { useEffect, useState } from "react";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");

      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh" }}>
      <h2 style={{ color: "white", textAlign: "center" }}>📅 Events</h2>

      {events.length === 0 ? (
        <p style={{ color: "white", textAlign: "center" }}>
          No events found
        </p>
      ) : (
        events.map(e => (
          <div key={e.id} style={card}>
            <h3>{e.title}</h3>
            <p>📅 {e.date}</p>
            <p>📍 {e.venue}</p>
            <p>{e.description}</p>

            <button onClick={()=>deleteEvent(e.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default EventList;

const card = {
  background: "#1e293b",
  padding: "15px",
  margin: "10px",
  color: "white",
  borderRadius: "10px",
};