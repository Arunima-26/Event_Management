import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // FETCH EVENTS
  const loadEvents = () => {
    axios.get("http://localhost:5000/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // DELETE EVENT
  const deleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => loadEvents())
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎉 All Events</h2>

      {events.length === 0 && <p>No events available</p>}

      {events.map((e) => (
        <div key={e.id} style={styles.card}>
          <h3 style={styles.title}>{e.title}</h3>

          <p><b>📍 Venue:</b> {e.venue}</p>
          <p><b>📅 Date:</b> {new Date(e.date).toDateString()}</p>
          <p>{e.description}</p>

          <div style={styles.btnContainer}>
            
            {/* REGISTER BUTTON → NEW PAGE */}
            <button
              style={styles.registerBtn}
              onClick={() => navigate(`/register/${e.id}`)}
            >
              Register
            </button>

            {/* DELETE BUTTON */}
            <button
              style={styles.deleteBtn}
              onClick={() => deleteEvent(e.id)}
            >
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
    background: "linear-gradient(to right, #74ebd5, #9face6)",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    color: "#333"
  },
  card: {
    background: "white",
    padding: "15px",
    margin: "15px auto",
    width: "300px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
  },
  title: {
    color: "#2c3e50"
  },
  btnContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between"
  },
  registerBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};