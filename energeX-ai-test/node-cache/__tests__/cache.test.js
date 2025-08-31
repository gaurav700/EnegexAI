const request = require("supertest");
const app = require("../index");

let db, redis;

beforeAll(async () => {
  const mysql = require("mysql2/promise");
  const { createClient } = require("redis");

  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  redis = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
  await redis.connect();
});

afterAll(async () => {
  await redis.quit();
  await db.end();
});

describe("Node Cache API", () => {
  it("GET /cache/posts should return array", async () => {
    const res = await request(app).get("/cache/posts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /cache/posts/:id should return a post or 404", async () => {
    const res = await request(app).get("/cache/posts/1");
    expect([200, 404]).toContain(res.statusCode);
  });
});
