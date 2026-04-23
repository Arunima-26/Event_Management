import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function RegisterPage() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const submit = () => {
    axios.post("http://localhost:5000/register", {
      ...form,
      event_id: id
    })
    .then(() => alert("Registered + Email Sent"))
    .catch(() => alert("Error"));
  };

  return (
    <div style={styles.container}>
      <h2>📝 Register for Event</h2>

      <input
        placeholder="Name"
        style={styles.input}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        style={styles.input}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        style={styles.input}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button style={styles.btn} onClick={submit}>
        Submit
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    textAlign: "center",
    background: "#f5f5f5",
    height: "100vh"
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: 10,
    width: 250
  },
  btn: {
    padding: 10,
    background: "green",
    color: "white",
    border: "none"
  }
};

export default RegisterPage;