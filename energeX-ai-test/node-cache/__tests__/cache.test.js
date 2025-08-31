const request = require("supertest");
const app = require("../index");
let db, redis, server;

beforeAll(async () => {
  const mysql = require("mysql2/promise");
  const { createClient } = require("redis");
  
  // Create database connection
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  
  // Create Redis connection
  redis = createClient({ 
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` 
  });
  await redis.connect();
  
  // Start the server for testing
  server = app.listen(0); // Use random port for testing
}, 30000); // Increase timeout for service startup

afterAll(async () => {
  // Clean up connections to prevent Jest from hanging
  if (redis) {
    await redis.quit();
  }
  if (db) {
    await db.end();
  }
  if (server) {
    server.close();
  }
}, 10000);

describe("Node Cache API", () => {
  it("GET /cache/posts should return array", async () => {
    const res = await request(app).get("/cache/posts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000); // Increase timeout
  
  it("GET /cache/posts/:id should return a post or 404", async () => {
    const res = await request(app).get("/cache/posts/1");
    expect([200, 404]).toContain(res.statusCode);
  }, 10000); // Increase timeout
});
