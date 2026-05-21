import express from 'express';
import cors from 'cors';
import cafeRoutes from './routes/cafe.routes';
import cafeSearchRoutes from './routes/cafe.search.routes';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth.routes';
import reviewRoutes from './routes/review.routes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/admin.routes';
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Để đọc được dữ liệu JSON từ body (req.body)
app.use(express.urlencoded({ extended: true })); // Support form data

// Khai báo các Routes
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API của DokoCafe! Các endpoints chính nằm ở /api/cafes');
});
app.use('/api', uploadRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/search', cafeSearchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

export default app;
