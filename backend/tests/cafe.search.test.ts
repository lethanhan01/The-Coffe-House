import request from "supertest";
import app from "../src/app";

jest.setTimeout(15000);

const searchCafes = (query: Record<string, string>) =>
  request(app).get("/api/cafes/search").query(query);

const expectSearchResponse = (res: request.Response) => {
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.count).toBe(res.body.data.length);
};

const expectBooleanFlag = (cafe: Record<string, unknown>, field: string) => {
  expect([true, 1]).toContain(cafe[field]);
};

describe("GET /api/cafes/search", () => {
  test("searches cafes by keyword", async () => {
    const res = await searchCafes({ keyword: "Hanoi" });

    expectSearchResponse(res);
  });

  test("filters cafes by wifi", async () => {
    const res = await searchCafes({ has_wifi: "true" });

    expectSearchResponse(res);
    res.body.data.forEach((cafe: Record<string, unknown>) => {
      expectBooleanFlag(cafe, "has_wifi");
    });
  });

  test("filters cafes by quiet space", async () => {
    const res = await searchCafes({ is_quiet: "true" });

    expectSearchResponse(res);
    res.body.data.forEach((cafe: Record<string, unknown>) => {
      expectBooleanFlag(cafe, "is_quiet");
    });
  });

  test("filters cafes by air conditioner", async () => {
    const res = await searchCafes({ has_ac: "true" });

    expectSearchResponse(res);
    res.body.data.forEach((cafe: Record<string, unknown>) => {
      expectBooleanFlag(cafe, "has_ac");
    });
  });

  test("filters cafes by outlets", async () => {
    const res = await searchCafes({ has_outlets: "true" });

    expectSearchResponse(res);
    res.body.data.forEach((cafe: Record<string, unknown>) => {
      expectBooleanFlag(cafe, "has_outlets");
    });
  });

  test("returns empty data when keyword does not match", async () => {
    const res = await searchCafes({ keyword: "abcxyznotfound" });

    expectSearchResponse(res);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});
