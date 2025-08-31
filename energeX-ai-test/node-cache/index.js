const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const redis = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
redis.connect();

// Fetch all posts
app.get("/cache/posts", async (req, res) => {
  const cache = await redis.get("posts");
  if (cache) return res.json(JSON.parse(cache));

  const [rows] = await db.query("SELECT * FROM posts");
  await redis.setEx("posts", 600, JSON.stringify(rows));
  res.json(rows);
});

// Fetch single post
app.get("/cache/posts/:id", async (req, res) => {
  const id = req.params.id;
  const cache = await redis.get(`post_${id}`);
  if (cache) return res.json(JSON.parse(cache));

  const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  await redis.setEx(`post_${id}`, 600, JSON.stringify(rows[0]));
  res.json(rows[0]);
});

if (require.main === module) {
  app.listen(5000, () => console.log("Node cache running on port 5000"));
}

module.exports = app; 

