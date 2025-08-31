const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const app = express();

// Initialize connections
let db, redis;

const initializeConnections = async () => {
  if (!db) {
    db = await mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'energeX_test',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  
  if (!redis) {
    redis = createClient({ 
      url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}` 
    });
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();
  }
};

// Middleware to ensure connections are ready
app.use(async (req, res, next) => {
  try {
    await initializeConnections();
    next();
  } catch (error) {
    console.error('Connection initialization failed:', error);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

// Fetch all posts
app.get("/cache/posts", async (req, res) => {
  try {
    const cache = await redis.get("all_posts");
    if (cache) return res.json(JSON.parse(cache));

    const [rows] = await db.query("SELECT * FROM posts");
    await redis.setEx("all_posts", 600, JSON.stringify(rows));
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch single post
app.get("/cache/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cache = await redis.get(`post_${id}`);
    if (cache) return res.json(JSON.parse(cache));

    const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    await redis.setEx(`post_${id}`, 600, JSON.stringify(rows[0]));
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  if (redis) {
    await redis.quit();
  }
  if (db) {
    await db.end();
  }
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
