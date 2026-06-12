"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = __importDefault(require("../src/utils/db"));
describe("Integration Test - Auth API", () => {
    const testUser = {
        email: `testuser_${Date.now()}@example.com`,
        password: "password123",
        full_name: "Test User"
    };
    let token;
    // Cleanup after tests
    afterAll(async () => {
        // Xóa user test để tránh rác database
        await db_1.default.from("users").delete().eq("email", testUser.email);
    });
    test("POST /api/auth/register - Register a new user", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        if (res.status !== 201)
            console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.body.user).toHaveProperty("id");
        expect(res.body.user.email).toBe(testUser.email);
    });
    test("POST /api/auth/register - Duplicate email should fail", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send(testUser);
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error", "Email already in use");
    });
    test("POST /api/auth/login - Login with correct credentials", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
        expect(res.body.user.email).toBe(testUser.email);
        expect(res.body.user).not.toHaveProperty("password_hash");
        token = res.body.token; // Lưu lại token để test API /me
    });
    test("POST /api/auth/login - Login with wrong credentials should fail", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: testUser.email,
            password: "wrongpassword"
        });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid email or password");
    });
    test("GET /api/auth/me - Get current profile with valid token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testUser.email);
    });
    test("GET /api/auth/me - Get current profile without token should fail", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/auth/me");
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Access denied. No token provided.");
    });
});
//# sourceMappingURL=auth.test.js.map