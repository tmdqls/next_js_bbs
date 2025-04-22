import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123123",
  database: "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;