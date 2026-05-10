import express from 'express';
import cors from 'cors';
import cafeRoutes from './routes/cafe.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Để đọc được dữ liệu JSON từ body (req.body)

// Khai báo các Routes
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API của DokoCafe! Các endpoints chính nằm ở /api/cafes');
});
app.use('/api/cafes', cafeRoutes);

export default app;
