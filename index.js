import "dotenv/config";
import express from "express";
import pool from "./config/connectdb.js";

const app = express();

app.use(express.json());

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
  } else {
    console.log("Connected to MySQL DB.");
    connection.release();
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
