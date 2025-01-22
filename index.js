import express from "express";
import "dotenv/config";
import pool from "./config/connectdb.js";
import routes from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// connect to MySQL DB
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
  } else {
    console.log("Connected to MySQL DB.");
    connection.release();
  }
});

app.use("/", routes);

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
