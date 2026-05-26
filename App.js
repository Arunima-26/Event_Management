import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import RegisteredStudents from "./RegisteredStudents";
import AddEvent from "./AddEvent";
import EventList from "./EventList";

function App() {
  return (
    <Router>
      <div style={nav}>
        <Link to="/">Register</Link>
        <Link to="/students">Students</Link>
        <Link to="/add">Add Event</Link>
        <Link to="/events">Events</Link>
      </div>

      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/students" element={<RegisteredStudents />} />
        <Route path="/add" element={<AddEvent />} />
        <Route path="/events" element={<EventList />} />
      </Routes>
    </Router>
  );
}

export default App;

const nav = {
  display: "flex",
  gap: "20px",
  padding: "15px",
  background: "#1e293b",
};
