import React, { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => 
    {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("resume", resume);
    try {
      const res = await
        axios.post("http://localhost:5000/send-mails", formData
        //   ,{
        //   timeout: 100000,//10second
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     },

        // }
      );
        setStatus(res.data.message);
    }
    catch(error){
  //     if (error.code === 'ECONNABORTED') {
  //   console.error('Request timed out');
  // }
  // else{
      console.error("Error:",error);
      setStatus("Failed to send emails.")
    // }
  }
  };
  
  return (
    <div style={{padding: '20px', maxWidth: "600px", margin: "auto" }}>
      <h2>Send Bulk Email to HRs</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder='Email Subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: "100%",padding: "10px", marginBottom: "10px" }}
          />
          <textarea
          placeholder='Email Body'
          value={body}
          onChange={(e) =>
            setBody(e.target.value)}
            required
            rows={6}
            style={{ width: "100%", padding: "10px",
              marginBottom: "10px" }}
          />
          <input type="file"
          accept='.pdf'
          onChange={(e)=> setResume(e.target.files[0]) }
          required
          style={{marginBottom: "10px" }}
          />
          <button type='submit'
          style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >Send Emails</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}


