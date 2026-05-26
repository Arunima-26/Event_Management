-- ================= DATABASE =================
CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- ================= CLEAN RESET =================
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;

-- ================= EVENTS TABLE =================
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  date VARCHAR(50),
  venue VARCHAR(100),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= REGISTRATIONS TABLE =================
CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  event_id INT,
  certificate_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ================= INSERT (CREATE) =================

-- Add Events
INSERT INTO events (title, date, venue, description)
VALUES 
('Tech Fest', '2026-06-01', 'Auditorium', 'Coding competition'),
('AI Workshop', '2026-07-10', 'Lab 1', 'AI training session');

-- Add Students
INSERT INTO registrations (first_name, last_name, email, phone, event_id)
VALUES 
('Arunima', 'Sharma', 'arunima@gmail.com', '9876543210', 1),
('Rahul', 'Verma', 'rahul@gmail.com', '9123456789', 2);

-- ================= READ =================

-- View all events
SELECT * FROM events;

-- View all students
SELECT * FROM registrations;

-- View students with event details (JOIN 🔥)
SELECT 
  r.id,
  r.first_name,
  r.last_name,
  r.email,
  r.phone,
  e.title AS event_name,
  e.venue,
  r.certificate_sent,
  r.created_at
FROM registrations r
JOIN events e ON r.event_id = e.id;

-- ================= UPDATE =================

-- Update event
UPDATE events
SET title = 'Updated Tech Fest',
    date = '2026-06-05',
    venue = 'Main Hall',
    description = 'Updated description'
WHERE id = 1;

-- Update student
UPDATE registrations
SET first_name = 'Arunima',
    last_name = 'Sharma',
    email = 'arunima_new@gmail.com',
    phone = '9999999999',
    event_id = 2
WHERE id = 1;

-- Mark certificate sent
UPDATE registrations
SET certificate_sent = TRUE
WHERE id = 1;

-- ================= DELETE =================

-- Delete student
DELETE FROM registrations WHERE id = 2;

-- Delete event (auto deletes linked students)
DELETE FROM events WHERE id = 2;

-- ================= EXTRA =================

-- Students without certificate
SELECT * FROM registrations
WHERE certificate_sent = FALSE;

-- Add index for performance
CREATE INDEX idx_event_id ON registrations(event_id);
ALTER TABLE registrations 
ADD certificate_id VARCHAR(50);
