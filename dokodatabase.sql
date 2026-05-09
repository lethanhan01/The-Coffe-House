CREATE DATABASE IF NOT EXISTS doko_cafe
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE doko_cafe;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    avatar_url TEXT, 
    role_id INT NOT NULL CHECK (role_id IN (1, 2, 3, 4)) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cafes (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE amenities (
    cafe_id INT PRIMARY KEY,
    has_wifi BOOLEAN DEFAULT FALSE,        
    has_outlets BOOLEAN DEFAULT FALSE,     
    has_snacks BOOLEAN DEFAULT FALSE,      
    has_ac BOOLEAN DEFAULT FALSE,          
    is_non_smoking BOOLEAN DEFAULT FALSE,  
    has_high_tables BOOLEAN DEFAULT FALSE, 
    is_quiet BOOLEAN DEFAULT FALSE,        
    CONSTRAINT fk_amenities_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL, 
    price INT NOT NULL,              
    CONSTRAINT fk_menu_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
    comment VARCHAR(100), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_cafe FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE review_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    image_url TEXT NOT NULL,
    CONSTRAINT fk_image_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;