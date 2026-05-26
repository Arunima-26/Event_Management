import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/students")
      .then(res => {
        const found = res.data.find(s => s.certificate_id === id);
        setData(found);
      });
  }, [id]);

  if (!data) return <h2>❌ Invalid Certificate</h2>;

  return (
    <div style={{textAlign:"center", marginTop:"50px"}}>
      <h1>✅ Verified Certificate</h1>
      <h2>{data.first_name} {data.last_name}</h2>
      <p>Event: {data.event_name}</p>
      <p>Certificate ID: {data.certificate_id}</p>
    </div>
  );
}

export default Verify;