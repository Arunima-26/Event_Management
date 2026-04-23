const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ashu@1234",
  database: "event_management",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

module.exports = db;