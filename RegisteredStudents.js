import React, { useEffect, useState } from "react";
import axios from "axios";

function RegisteredStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students");

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  const generateCertificate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/generate-certificate/${id}`);
      alert("🎉 Certificate sent!");
    } catch (err) {
      console.log(err);
      alert("Error generating certificate");
    }
  };

  return (
    <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh" }}>
      <h2 style={{ color: "white", textAlign: "center" }}>
        👨‍🎓 Students
      </h2>

      {students.map(s => (
        <div key={s.id} style={card}>
          <h3>{s.first_name} {s.last_name}</h3>
          <p>{s.email}</p>
          <p>{s.phone}</p>
          <p>🎯 {s.event_name}</p>

          <button onClick={()=>deleteStudent(s.id)}>Delete</button>
          <button onClick={()=>generateCertificate(s.id)}>Certificate</button>
        </div>
      ))}
    </div>
  );
}

export default RegisteredStudents;

const card = {
  background: "#1e293b",
  padding: "15px",
  margin: "10px",
  color: "white",
  borderRadius: "10px",
};
