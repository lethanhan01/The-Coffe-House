import request from "supertest";
import app from "../src/app";

describe("Integration Test - Cafe CRUD API", () => {
  let newCafeId: number;

  // 1. CREATE
  test("POST /api/cafes - Create a new cafe", async () => {
    const newCafe = {
      owner_id: 1,
      name_vn: "Integration Test Cafe",
      name_jp: "テストカフェ",
      address: "123 Test Street, Hanoi",
      phone_number: "0123456789",
      open_hours: "08:00 - 22:00",
      cover_image_url: "https://example.com/image.jpg"
    };

    const res = await request(app).post("/api/cafes").send(newCafe);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    
    newCafeId = res.body.data.id;
  });

  // 2. READ
  test("GET /api/cafes/:id - Read the created cafe", async () => {
    const res = await request(app).get(`/api/cafes/${newCafeId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Integration Test Cafe");
  });

  // 3. UPDATE
  test("PUT /api/cafes/:id - Update the cafe status", async () => {
    const res = await request(app)
      .put(`/api/cafes/${newCafeId}`)
      .send({ is_open: true, is_crowded: true });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Verify update
    const getRes = await request(app).get(`/api/cafes/${newCafeId}`);
    expect(getRes.body.data.isOpen).toBe(true);
    expect(getRes.body.data.status).toBe('crowded');
  });

  // 4. DELETE
  test("DELETE /api/cafes/:id - Delete the cafe", async () => {
    const res = await request(app).delete(`/api/cafes/${newCafeId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const checkRes = await request(app).get(`/api/cafes/${newCafeId}`);
    expect(checkRes.status).toBe(404);
  });
});
