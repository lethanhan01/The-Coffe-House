"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cafe_routes_1 = __importDefault(require("./routes/cafe.routes"));
const cafe_search_routes_1 = __importDefault(require("./routes/cafe.search.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const promotion_routes_1 = __importDefault(require("./routes/promotion.routes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Để đọc được dữ liệu JSON từ body (req.body)
app.use(express_1.default.urlencoded({ extended: true })); // Support form data
// Khai báo các Routes
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API của DokoCafe! Các endpoints chính nằm ở /api/cafes');
});
app.use('/api', uploadRoutes_1.default);
app.use('/api/cafes', cafe_routes_1.default);
app.use('/api/search', cafe_search_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/promotions', promotion_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map