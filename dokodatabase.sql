-- Supabase / PostgreSQL Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    avatar_url TEXT, 
    role_id INT NOT NULL CHECK (role_id IN (1, 2, 3, 4)) 
);

CREATE TABLE IF NOT EXISTS cafes (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    name_jp VARCHAR(255) NOT NULL, 
    name_vn VARCHAR(255) NOT NULL, 
    address TEXT NOT NULL,         
    phone_number VARCHAR(20),      
    open_hours VARCHAR(100),       
    is_open BOOLEAN DEFAULT TRUE,  
    is_crowded BOOLEAN DEFAULT FALSE, 
    average_rating DECIMAL(3,2) DEFAULT 0.00, 
    review_count INT DEFAULT 0,
    cover_image_url TEXT,          
    CONSTRAINT fk_cafe_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS amenities (
    cafe_id INT PRIMARY KEY,
    has_wifi BOOLEAN DEFAULT FALSE,        
    has_outlets BOOLEAN DEFAULT FALSE,     
    has_snacks BOOLEAN DEFAULT FALSE,      
    has_ac BOOLEAN DEFAULT FALSE,          
    is_non_smoking BOOLEAN DEFAULT FALSE,  
    has_high_tables BOOLEAN DEFAULT FALSE, 
    is_quiet BOOLEAN DEFAULT FALSE,        
    CONSTRAINT fk_amenities_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL, 
    price INT NOT NULL,              
    CONSTRAINT fk_menu_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
    comment VARCHAR(100), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_images (
    id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_image_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Fields used by the current account/profile and cafe setup screens
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

ALTER TABLE amenities
    ADD COLUMN IF NOT EXISTS has_coffee BOOLEAN DEFAULT FALSE;

-- Current owner module: booking management
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    number_of_people INT NOT NULL CHECK (number_of_people > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);

-- Current owner module: cafe promotions
CREATE TABLE IF NOT EXISTS promotions (
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

-- Current owner module: staff list for each cafe
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    position VARCHAR(100) NOT NULL,
    position_jp VARCHAR(100) NOT NULL,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
);

-- Current owner/admin module: reports and cafe delete requests
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('review_complaint', 'cafe_delete')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'resolved', 'rejected')),
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    description_jp TEXT NOT NULL,
    cafe_id INT,
    reporter_id INT,
    cafe_name VARCHAR(255),
    cafe_name_jp VARCHAR(255),
    reporter_name VARCHAR(255),
    target_info TEXT,
    target_info_jp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE SET NULL,
    CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Data
INSERT INTO users (full_name, email, password_hash, avatar_url, role_id) VALUES
('Tagashira', 'tagashira.kimura@example.jp', 'hashed_pw_123', 'https://example.com/avatar/tanaka.jpg', 1),
('Nguyen Thanh Duy', 'nguyenthanhduy.owner@example.vn', 'hashed_pw_456', 'https://example.com/avatar/nva.jpg', 2),
('Nguyen Binh Minh', 'binhminh@dokocafe.com', 'hashed_pw_789', NULL, 3),
('Trần Thị A', 'tranthib.staff@example.vn', 'hashed_pw_101', 'https://example.com/avatar/ttb.jpg', 4);

INSERT INTO cafes (owner_id, name_jp, name_vn, address, phone_number, open_hours, is_open, is_crowded, average_rating, review_count, cover_image_url) VALUES
(2, 'ハノイロースタリー', 'Hanoi Roastery', '123 Phố Cổ, Hoàn Kiếm, Hà Nội', '0901234567', '08:00 - 22:00', TRUE, FALSE, 4.50, 1, 'https://example.com/cafes/hanoi_roastery.jpg'),
(2, '静かなカフェ', 'Cà phê Yên Tĩnh', '456 Tây Hồ, Hà Nội', '0912345678', '07:00 - 23:00', TRUE, TRUE, 0.00, 0, 'https://example.com/cafes/yen_tinh.jpg');

INSERT INTO amenities (cafe_id, has_wifi, has_outlets, has_snacks, has_ac, is_non_smoking, has_high_tables, is_quiet) VALUES
(1, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE),
(2, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE);

INSERT INTO menus (cafe_id, item_name, price) VALUES
(1, 'Cà phê đen (ブラックコーヒー)', 35000),
(1, 'Bạc xỉu (ベトナム練乳コーヒー)', 45000),
(1, 'Bánh sừng bò (クロワッサン)', 30000),
(2, 'Trà sen (ハス茶)', 40000),
(2, 'Nước ép cam (オレンジジュース)', 50000);

INSERT INTO reviews (cafe_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Wi-Fiが速くて、仕事に最適なカフェです！ (Wi-Fi nhanh, rất hợp để làm việc!)');

INSERT INTO review_images (review_id, image_url) VALUES
(1, 'https://example.com/reviews/photo1.jpg'),
(1, 'https://example.com/reviews/photo2.jpg');
