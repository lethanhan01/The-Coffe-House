"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = __importDefault(require("../src/utils/db"));
describe("Integration Test - Review API", () => {
    const testUser1 = {
        email: `reviewer1_${Date.now()}@example.com`,
        password: "password123",
        full_name: "Reviewer 1",
        role_id: 1
    };
    const testUser2 = {
        email: `reviewer2_${Date.now()}@example.com`,
        password: "password123",
        full_name: "Reviewer 2",
        role_id: 1
    };
    const testCafe = {
        owner_id: 2, // Hardcoded to an existing owner from seed data
        name_vn: "Test Review Cafe",
        name_jp: "テストレビューカフェ",
        address: "123 Test Street",
    };
    let token1;
    let token2;
    let cafeId;
    beforeAll(async () => {
        // 1. Create two users and login to get tokens
        await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser1);
        await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser2);
        const loginRes1 = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({ email: testUser1.email, password: testUser1.password });
        token1 = loginRes1.body.token;
        const loginRes2 = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({ email: testUser2.email, password: testUser2.password });
        token2 = loginRes2.body.token;
        // 2. Create a test cafe directly in db
        const { data: cafe } = await db_1.default.from('cafes').insert([testCafe]).select('id').single();
        cafeId = cafe.id;
    });
    afterAll(async () => {
        // Cleanup
        await db_1.default.from("cafes").delete().eq("id", cafeId);
        await db_1.default.from("users").delete().in("email", [testUser1.email, testUser2.email]);
    });
    test("POST /api/reviews - Create first review (5 stars)", async () => {
        const reviewData = {
            cafe_id: cafeId,
            rating: 5,
            comment: "Excellent cafe!",
            image_urls: ["https://example.com/img1.jpg"]
        };
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token1}`)
            .send(reviewData);
        if (res.status !== 201)
            console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body.data.new_cafe_average_rating).toBe(5);
        expect(res.body.data.new_cafe_review_count).toBe(1);
    });
    test("POST /api/reviews - Create second review (3 stars)", async () => {
        const reviewData = {
            cafe_id: cafeId,
            rating: 3,
            comment: "It is okay."
        };
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token2}`)
            .send(reviewData);
        if (res.status !== 201)
            console.log(res.body);
        expect(res.status).toBe(201);
        // Average should be (5 + 3) / 2 = 4
        expect(res.body.data.new_cafe_average_rating).toBe(4);
        expect(res.body.data.new_cafe_review_count).toBe(2);
    });
    test("POST /api/reviews - Fails without token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/reviews")
            .send({ cafe_id: cafeId, rating: 5 });
        expect(res.status).toBe(401);
    });
    test("POST /api/reviews - Fails with invalid rating", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token1}`)
            .send({ cafe_id: cafeId, rating: 6 }); // Rating > 5
        expect(res.status).toBe(400);
    });
});
//# sourceMappingURL=review.test.js.map