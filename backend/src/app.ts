import express from 'express';
import cors from 'cors';
import cafeRoutes from './routes/cafe.routes';
import cafeSearchRoutes from './routes/cafe.search.routes';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth.routes';
import reviewRoutes from './routes/review.routes';
import promotionRoutes from './routes/promotion.routes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/admin.routes';
const app = express();

// Middleware
const localhostOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
const allowedOrigins = process.env.FRONTEND_URL
  ? [...process.env.FRONTEND_URL.split(','), ...localhostOrigins]
  : localhostOrigins;

app.use(cors({ origin: allowedOrigins, credentials: true }));
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
app.use('/api/promotions', promotionRoutes);

export default app;
