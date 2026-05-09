import db from '../utils/db'; // Đường dẫn tới file cấu hình MySQL của dự án
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// 1. READ: Lấy danh sách quán (Có hỗ trợ Tìm kiếm & Lọc theo P_ID 3)
export const getAllCafes = async (filters: any) => {
    let query = `
        SELECT c.*, a.has_wifi, a.has_outlets, a.has_snacks, a.has_ac, a.is_non_smoking, a.has_high_tables, a.is_quiet 
        FROM cafes c
        LEFT JOIN amenities a ON c.id = a.cafe_id
        WHERE 1=1
    `;
    const params: any[] = [];

    // Logic tìm kiếm theo tên hoặc khu vực
    if (filters.keyword) {
        query += ` AND (c.name_jp LIKE ? OR c.name_vn LIKE ? OR c.address LIKE ?)`;
        const keyword = `%${filters.keyword}%`;
        params.push(keyword, keyword, keyword);
    }

    // Logic lọc theo tiện ích (Màn hình ID 8)
    if (filters.has_wifi === 'true') { query += ` AND a.has_wifi = TRUE`; }
    if (filters.is_quiet === 'true') { query += ` AND a.is_quiet = TRUE`; }
    if (filters.has_ac === 'true') { query += ` AND a.has_ac = TRUE`; }
    if (filters.has_outlets === 'true') { query += ` AND a.has_outlets = TRUE`; }

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows;
};

// 2. READ: Lấy chi tiết 1 quán kèm Menu và Amenities (Phục vụ P_ID 4 và Màn hình ID 10)
export const getCafeById = async (cafeId: number) => {
    // Lấy thông tin cơ bản và tiện ích
    const [cafeRows] = await db.query<RowDataPacket[]>(
        `SELECT c.*, a.has_wifi, a.has_outlets, a.has_snacks, a.has_ac, a.is_non_smoking, a.has_high_tables, a.is_quiet 
         FROM cafes c LEFT JOIN amenities a ON c.id = a.cafe_id WHERE c.id = ?`, [cafeId]
    );

    if (cafeRows.length === 0) return null;
    const cafeData = cafeRows[0];

    // Lấy thêm thực đơn của quán
    const [menuRows] = await db.query<RowDataPacket[]>(
        `SELECT id, item_name, price FROM menus WHERE cafe_id = ?`, [cafeId]
    );
    (cafeData as any).menus = menuRows;

    return cafeData;
};

// 3. CREATE: Thêm quán mới (Kèm tiện ích mặc định)
export const createCafe = async (data: any) => {
    const { owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url } = data;

    // Bắt đầu Insert vào bảng cafes
    const [cafeResult] = await db.query<ResultSetHeader>(
        `INSERT INTO cafes (owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url]
    );

    const newCafeId = cafeResult.insertId;

    // Tạo dòng tiện ích mặc định cho quán đó
    await db.query(`INSERT INTO amenities (cafe_id) VALUES (?)`, [newCafeId]);

    return newCafeId;
};


export const updateCafe = async (cafeId: number, updateData: any) => {
    const { is_open, is_crowded } = updateData;
    const [result] = await db.query<ResultSetHeader>(
        `UPDATE cafes SET is_open = COALESCE(?, is_open), is_crowded = COALESCE(?, is_crowded) WHERE id = ?`,
        [is_open, is_crowded, cafeId]
    );
    return result.affectedRows > 0;
};


export const deleteCafe = async (cafeId: number) => {
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM cafes WHERE id = ?`, [cafeId]);
    return result.affectedRows > 0;
};