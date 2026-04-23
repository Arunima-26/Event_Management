const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

const app = express();

app.use(cors());
app.use(express.json());

// DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ashu@1234",
  database: "event_management"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arunima.sha9001@gmail.com",
    pass: "sharma@26"
  }
});


// ================= EVENTS =================

// CREATE
app.post("/events", (req, res) => {
  const { title, date, venue, description } = req.body;

  db.query(
    "INSERT INTO events (title,date,venue,description) VALUES (?,?,?,?)",
    [title, date, venue, description],
    (err) => {
      if (err) return res.json(err);
      res.json({ message: "Event Created" });
    }
  );
});

// GET
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// DELETE
app.delete("/events/:id", (req, res) => {
  db.query("DELETE FROM events WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    res.json({ message: "Deleted" });
  });
});


// ================= REGISTER =================

app.post("/register", async (req, res) => {
  const { name, email, phone, event_id } = req.body;

  db.query(
    "INSERT INTO registrations (name,email,phone,event_id) VALUES (?,?,?,?)",
    [name, email, phone, event_id],
    async (err) => {
      if (err) return res.json(err);

      // QR
      const qr = await QRCode.toDataURL(`Pay for Event ID: ${event_id}`);

      // EMAIL
      const mail = {
        from: "arunima.sha9001@gmail.com",
        to: email,
        subject: "Registration Successful",
        html: `
          <h2>Hello ${name}</h2>
          <p>You are registered successfully 🎉</p>
          <p>Scan QR for payment:</p>
          <img src="${qr}" />
        `
      };

     // await transporter.sendMail(mail);

      res.json({ message: "Registered + Email Sent" });
    }
  );
});


// ================= VIEW REGISTRATIONS =================

app.get("/registrations", (req, res) => {
  const sql = `
    SELECT r.*, e.title 
    FROM registrations r
    JOIN events e ON r.event_id = e.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});


// ================= CERTIFICATE =================

app.get("/certificate/:id", (req, res) => {
  db.query("SELECT * FROM registrations WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.json(err);

    const student = result[0];

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");

    doc.pipe(res);

    doc.fontSize(25).text("Certificate of Participation", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text("This is to certify that");
    doc.fontSize(22).text(student.name, { align: "center" });
    doc.text("Has Succefully Participated In This Even");

    doc.end();
  });
});


// START
app.listen(5000, () => console.log("Server running on port 5000"));