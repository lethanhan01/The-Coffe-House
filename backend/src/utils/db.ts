import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Tạo kết nối đến database MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'doko_cafe', // Khớp với tên DB trong file dokodatabase.sql
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
