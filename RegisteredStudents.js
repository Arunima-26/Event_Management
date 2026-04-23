import { useEffect, useState } from "react";
import axios from "axios";

function RegisteredStudents() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/registrations")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Registered Students</h2>

      {data.map(d => (
        <div key={d.id}>
          <h4>{d.name}</h4>
          <p>{d.email}</p>
          <p>{d.phone}</p>
          <p>{d.title}</p>

          <button onClick={() => {
            window.open(`http://localhost:5000/certificate/${d.id}`);
          }}>
            Download Certificate
          </button>
        </div>
      ))}
    </div>
  );
}

export default RegisteredStudents;