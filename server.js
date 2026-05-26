const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ashu@1234",
  database: "event_management",
});

db.connect((err) => {
  if (err) console.log(" DB Error:", err);
  else console.log("MySQL Connected");
});

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arunima.sha9001@gmail.com",       
    pass: "rlopihrbvawcuoyf",   
  },
});

// ================= EVENTS =================

// GET EVENTS
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// ADD EVENT
app.post("/events", (req, res) => {
  const { title, date, venue, description } = req.body;

  db.query(
    "INSERT INTO events (title, date, venue, description) VALUES (?, ?, ?, ?)",
    [title, date, venue, description],
    (err, result) => {
      if (err) return res.send(err);
      res.json({ id: result.insertId });
    }
  );
});

// UPDATE EVENT
app.put("/events/:id", (req, res) => {
  const { title, date, venue, description } = req.body;

  db.query(
    "UPDATE events SET title=?, date=?, venue=?, description=? WHERE id=?",
    [title, date, venue, description, req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Event Updated");
    }
  );
});

// DELETE EVENT
app.delete("/events/:id", (req, res) => {
  db.query("DELETE FROM events WHERE id=?", [req.params.id]);
  res.send("Event Deleted");
});

// ================= STUDENTS =================

// GET STUDENTS
app.get("/students", (req, res) => {
  db.query(
    `SELECT r.*, e.title AS event_name 
     FROM registrations r
     JOIN events e ON r.event_id = e.id`,
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

// REGISTER STUDENT + EMAIL
app.post("/students", async (req, res) => {
  const { first_name, last_name, email, phone, event_id } = req.body;

  db.query(
    "INSERT INTO registrations (first_name,last_name,email,phone,event_id) VALUES (?,?,?,?,?)",
    [first_name, last_name, email, phone, event_id],
    async (err) => {
      if (err) return res.send(err);

      try {
        await transporter.sendMail({
          from: "arunima.sha9001.com",
          to: email,
          subject: "Registration Successful ",
          html: `<h2>Hello ${first_name}</h2><p>You registered successfully!</p>`,
        });
        console.log(" Email Sent");
      } catch (e) {
        console.log(" Email Error:", e.message);
      }

      res.send("Student Registered");
    }
  );
});

// DELETE STUDENT
app.delete("/students/:id", (req, res) => {
  db.query("DELETE FROM registrations WHERE id=?", [req.params.id]);
  res.send("Student Deleted");
});

// ================= CERTIFICATE =================

app.post("/generate-certificate/:id", (req, res) => {

  db.query(
    `SELECT r.*, e.title AS event_name 
     FROM registrations r
     JOIN events e ON r.event_id = e.id
     WHERE r.id=?`,
    [req.params.id],
    async (err, result) => {

      if (err || result.length === 0) {
        console.log(err);
        return res.send("Error fetching student");
      }

      const s = result[0];

      // ===== UNIQUE CERTIFICATE ID =====
      const certID = `CERT-${new Date().getFullYear()}-${s.id}`;

      // SAVE TO DB
      db.query(
        "UPDATE registrations SET certificate_id=? WHERE id=?",
        [certID, s.id]
      );

      const fileName = `certificate_${s.id}.pdf`;
      const filePath = path.join(__dirname, fileName);

      // ===== VERIFY URL =====
      const verifyURL = `http://localhost:3000/verify/${certID}`;

      // ===== QR CODE =====
      const qrPath = path.join(__dirname, `qr_${s.id}.png`);
      await QRCode.toFile(qrPath, verifyURL);

      // ===== CREATE PDF =====
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
      });

      doc.pipe(fs.createWriteStream(filePath));

      // BORDER
      doc.rect(20, 20, 800, 550).stroke("#4f46e5");

      // TITLE
      doc.fontSize(40).fillColor("#1e3a8a")
        .text("CERTIFICATE OF PARTICIPATION", { align: "center" });

      doc.moveDown(2);

      // TEXT
      doc.fontSize(20).fillColor("black")
        .text("This is to certify that", { align: "center" });

      doc.moveDown();

      // NAME
      doc.fontSize(30)
        .text(`${s.first_name} ${s.last_name}`, {
          align: "center",
          underline: true,
        });

      doc.moveDown();

      doc.fontSize(20)
        .text("has successfully participated in", { align: "center" });

      doc.moveDown();

      doc.fontSize(24).fillColor("#4f46e5")
        .text(`"${s.event_name}"`, { align: "center" });

      doc.moveDown(2);

      // CERT ID
      doc.fontSize(14).fillColor("black")
        .text(`Certificate ID: ${certID}`, 100, 420);

      // DATE
      const today = new Date().toLocaleDateString();
      doc.text(`Date: ${today}`, 100, 450);

      // SIGNATURE
      doc.text("____________________", 600, 450);
      doc.text("Authorized Signature", 600, 470);

      // QR
      doc.image(qrPath, 650, 320, { width: 120 });
      doc.fontSize(10).text("Scan to verify", 650, 450);

      doc.end();

      // ===== EMAIL =====
      setTimeout(async () => {
        try {
          await transporter.sendMail({
            from: "yourgmail@gmail.com",
            to: s.email,
            subject: " Your Certificate",
            html: `
              <h2>Congratulations ${s.first_name}</h2>
              <p>Your certificate is attached.</p>
              <p><b>ID:</b> ${certID}</p>
              <p>Verify: ${verifyURL}</p>
            `,
            attachments: [
              { filename: fileName, path: filePath },
            ],
          });

          console.log(" Certificate Email Sent");
        } catch (e) {
          console.log(" Email Error:", e.message);
        }
      }, 2000);

      res.send("Certificate Generated with QR + ID!");
    }
  );
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log(" Server running on http://localhost:5000");
});
