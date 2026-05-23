# Promotion API Documentation

## Overview
API endpoints for managing cafe promotions/advertisements. Promotions allow cafe owners and staff to create time-limited offers.

## Base URL
```
http://localhost:5000/api/promotions
```

## Database Schema
```sql
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    description_jp TEXT NOT NULL,
    image_url TEXT,
    valid_until DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_promotion_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);
```

---

## Endpoints

### 1. Create Promotion
**POST** `/api/promotions`

Create a new promotion for a cafe.

**Request Body:**
```json
{
    "cafe_id": 1,
    "title": "50% OFF Coffee",
    "title_jp": "コーヒー50%割引",
    "description": "Get 50% off on all coffee drinks this week!",
    "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
    "image_url": "https://example.com/promo.jpg",
    "valid_until": "2026-05-28"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Tạo khuyến mãi thành công",
    "data": {
        "id": 1,
        "cafe_id": 1,
        "title": "50% OFF Coffee",
        "title_jp": "コーヒー50%割引",
        "description": "Get 50% off on all coffee drinks this week!",
        "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
        "image_url": "https://example.com/promo.jpg",
        "valid_until": "2026-05-28",
        "created_at": "2026-05-21T10:30:00Z"
    }
}
```

**Error (400):**
```json
{
    "success": false,
    "message": "Thiếu thông tin yêu cầu"
}
```

---

### 2. Get All Active Promotions
**GET** `/api/promotions/active`

Get all promotions that haven't expired yet (global).

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "cafe_id": 1,
            "title": "50% OFF Coffee",
            "title_jp": "コーヒー50%割引",
            "description": "Get 50% off on all coffee drinks this week!",
            "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
            "image_url": "https://example.com/promo.jpg",
            "valid_until": "2026-05-28",
            "created_at": "2026-05-21T10:30:00Z"
        }
    ]
}
```

---

### 3. Get All Promotions of a Cafe
**GET** `/api/promotions/cafe/:cafeId`

Get all promotions (active and expired) for a specific cafe.

**Parameters:**
- `cafeId` (required): The ID of the cafe

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "cafe_id": 1,
            "title": "50% OFF Coffee",
            "title_jp": "コーヒー50%割引",
            "description": "Get 50% off on all coffee drinks this week!",
            "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
            "image_url": "https://example.com/promo.jpg",
            "valid_until": "2026-05-28",
            "created_at": "2026-05-21T10:30:00Z"
        }
    ]
}
```

---

### 4. Get Active Promotions of a Cafe
**GET** `/api/promotions/cafe/active/:cafeId`

Get only active (non-expired) promotions for a specific cafe.

**Parameters:**
- `cafeId` (required): The ID of the cafe

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "cafe_id": 1,
            "title": "50% OFF Coffee",
            "title_jp": "コーヒー50%割引",
            "description": "Get 50% off on all coffee drinks this week!",
            "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
            "image_url": "https://example.com/promo.jpg",
            "valid_until": "2026-05-28",
            "created_at": "2026-05-21T10:30:00Z"
        }
    ]
}
```

---

### 5. Get Promotion by ID
**GET** `/api/promotions/:id`

Get details of a specific promotion.

**Parameters:**
- `id` (required): The promotion ID

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "cafe_id": 1,
        "title": "50% OFF Coffee",
        "title_jp": "コーヒー50%割引",
        "description": "Get 50% off on all coffee drinks this week!",
        "description_jp": "この週、すべてのコーヒードリンクで50%割引を受けてください!",
        "image_url": "https://example.com/promo.jpg",
        "valid_until": "2026-05-28",
        "created_at": "2026-05-21T10:30:00Z"
    }
}
```

**Error (404):**
```json
{
    "success": false,
    "message": "Khuyến mãi không tồn tại"
}
```

---

### 6. Update Promotion
**PUT** `/api/promotions/:id`

Update an existing promotion.

**Parameters:**
- `id` (required): The promotion ID

**Request Body** (all fields optional):
```json
{
    "title": "75% OFF Coffee",
    "title_jp": "コーヒー75%割引",
    "description": "Get 75% off on all coffee drinks!",
    "description_jp": "すべてのコーヒードリンクで75%割引!",
    "image_url": "https://example.com/promo-new.jpg",
    "valid_until": "2026-06-04"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Cập nhật khuyến mãi thành công",
    "data": {
        "id": 1,
        "cafe_id": 1,
        "title": "75% OFF Coffee",
        "title_jp": "コーヒー75%割引",
        "description": "Get 75% off on all coffee drinks!",
        "description_jp": "すべてのコーヒードリンクで75%割引!",
        "image_url": "https://example.com/promo-new.jpg",
        "valid_until": "2026-06-04",
        "created_at": "2026-05-21T10:30:00Z"
    }
}
```

---

### 7. Delete Promotion
**DELETE** `/api/promotions/:id`

Delete a promotion.

**Parameters:**
- `id` (required): The promotion ID

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Xóa khuyến mãi thành công"
}
```

**Error (404):**
```json
{
    "success": false,
    "message": "Khuyến mãi không tồn tại"
}
```

---

## Usage Examples

### Example 1: Create a Promotion using cURL
```bash
curl -X POST http://localhost:5000/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "cafe_id": 1,
    "title": "Weekend Special",
    "title_jp": "週末スペシャル",
    "description": "Free pastry with any beverage",
    "description_jp": "任意のドリンクで無料ペストリー",
    "image_url": "https://example.com/weekend.jpg",
    "valid_until": "2026-05-25"
  }'
```

### Example 2: Get All Active Promotions
```bash
curl http://localhost:5000/api/promotions/active
```

### Example 3: Get Promotions for a Specific Cafe
```bash
curl http://localhost:5000/api/promotions/cafe/1
```

### Example 4: Get Active Promotions for a Specific Cafe
```bash
curl http://localhost:5000/api/promotions/cafe/active/1
```

### Example 5: Update a Promotion
```bash
curl -X PUT http://localhost:5000/api/promotions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "valid_until": "2026-06-01"
  }'
```

### Example 6: Delete a Promotion
```bash
curl -X DELETE http://localhost:5000/api/promotions/1
```

---

## Response Codes
- **201 Created**: Promotion created successfully
- **200 OK**: Request successful
- **400 Bad Request**: Missing or invalid required fields
- **404 Not Found**: Promotion or cafe not found
- **500 Internal Server Error**: Server error

---

## Notes
- Dates must be in `YYYY-MM-DD` format
- Both Vietnamese and Japanese versions must be provided for title and description
- `image_url` is optional but recommended
- `valid_until` date is compared with current date to determine if promotion is active
- Deleting a cafe will automatically delete all its promotions (CASCADE delete)
