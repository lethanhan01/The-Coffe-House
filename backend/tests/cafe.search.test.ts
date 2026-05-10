import request from "supertest";
import app from "../src/app";
import db from "../src/utils/db";

describe("Integration Test - Cafe Search/Filter API", () => {
  test("GET /api/cafes/search?keyword=Hanoi - tìm kiếm theo keyword", async () => {
    const res = await request(app)
      .get("/api/cafes/search")
      .query({ keyword: "Hanoi" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/cafes/search?has_wifi=true - lọc quán có wifi", async () => {
    const res = await request(app)
      .get("/api/cafes/search")
      .query({ has_wifi: "true" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    for (const cafe of res.body.data) {
      expect(cafe.has_wifi).toBe(1);
    }
  });

  test("GET /api/cafes/search?is_quiet=true - lọc quán yên tĩnh", async () => {
    const res = await request(app)
      .get("/api/cafes/search")
      .query({ is_quiet: "true" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    for (const cafe of res.body.data) {
      expect(cafe.is_quiet).toBe(1);
    }
  });

  test("GET /api/cafes/search?keyword=abcxyznotfound - không có kết quả", async () => {
    const res = await request(app)
      .get("/api/cafes/search")
      .query({ keyword: "abcxyznotfound" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});

afterAll(async () => {
  await db.end();
});