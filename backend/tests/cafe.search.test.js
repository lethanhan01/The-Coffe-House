"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
jest.setTimeout(15000);
const searchCafes = (query) => (0, supertest_1.default)(app_1.default).get("/api/cafes/search").query(query);
const expectSearchResponse = (res) => {
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(res.body.data.length);
};
const expectBooleanFlag = (cafe, field) => {
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
        res.body.data.forEach((cafe) => {
            expectBooleanFlag(cafe, "has_wifi");
        });
    });
    test("filters cafes by quiet space", async () => {
        const res = await searchCafes({ is_quiet: "true" });
        expectSearchResponse(res);
        res.body.data.forEach((cafe) => {
            expectBooleanFlag(cafe, "is_quiet");
        });
    });
    test("filters cafes by air conditioner", async () => {
        const res = await searchCafes({ has_ac: "true" });
        expectSearchResponse(res);
        res.body.data.forEach((cafe) => {
            expectBooleanFlag(cafe, "has_ac");
        });
    });
    test("filters cafes by outlets", async () => {
        const res = await searchCafes({ has_outlets: "true" });
        expectSearchResponse(res);
        res.body.data.forEach((cafe) => {
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
afterAll(async () => {
    // Supabase client does not require explicit connection closing
    // Just cleanup any resources if needed
});
//# sourceMappingURL=cafe.search.test.js.map