-- ========== USERS & AUTHENTICATION ==========
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    gender ENUM('male', 'female', 'other') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,
    image_profile_path VARCHAR(2048),
    phone_number VARCHAR(20) UNIQUE,
    CONSTRAINT chk_phone_number_account CHECK (phone_number REGEXP '^[0-9]{10,15}$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);


-- ========== USER ROLES ==========

CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- ========== CUSTOMER ==========

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ========== PRODUCT ==========

CREATE TABLE manufacturers (
    manufacturer_id CHAR(8) PRIMARY KEY,
    manufacturer_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE products (
    product_id CHAR(8) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    description TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    
    manufacturer_id CHAR(8),
    category_id INT,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(manufacturer_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admins(admin_id)
);

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id CHAR(8) NOT NULL,
    image_path VARCHAR(2048) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========== CART & ORDERS ==========

CREATE TABLE cart_items (
    customer_id INT NOT NULL,
    product_id CHAR(8) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),

    PRIMARY KEY (customer_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,

    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_statuses (
    status_code INT PRIMARY KEY,
    status_description VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
    payment_method_id INT PRIMARY KEY,
    method_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_method_id INT,
    total_amount DECIMAL(10, 2),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id) ON DELETE SET NULL
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_id INT,
    status_code INT DEFAULT 1,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (status_code) REFERENCES order_statuses(status_code) ON DELETE SET NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_id INT,
    product_id CHAR(8),
    quantity INT NOT NULL CHECK (quantity > 0),

    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========== REVIEWS ==========

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    reply_comment TEXT,

    product_id CHAR(8) NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_by INT,
    FOREIGN KEY (replied_by) REFERENCES admins(admin_id)
);

-- ========== PROMOTIONS ==========

CREATE TABLE promotions (
    promotion_id CHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    release_date DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    banner_path VARCHAR(2048),
    discount_percent INT NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    CONSTRAINT chk_promotion_dates CHECK (release_date < expiry_date),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admins(admin_id)
);

CREATE TABLE promotion_products (
    promotion_id CHAR(8),
    product_id CHAR(8),
    PRIMARY KEY (promotion_id, product_id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========== ADDRESSES ==========

CREATE TABLE addresses (
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15),
    CONSTRAINT chk_phone_number_address CHECK (phone_number REGEXP '^[0-9]{10,15}$'),

    address_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    address_text TEXT,
    country VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- ========== INSERT ==========

-- Insert 10 users into the users table with hashed passwords
INSERT INTO users (gender, first_name, last_name, email, is_email_verified, password, image_profile_path, phone_number) 
VALUES 
('male', 'Phoorin', 'Chinphuad', 'phoorin.chin@mail.kmutt.ac.th', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0956934807'),
('female', 'Skibidi', 'Toilet', 'skibidi_Toilet@gmail.com', FALSE, '$correctpassword', 'https://i.pravatar.cc/300', '0951234567'),
('other', 'Moodeng', 'Auan', 'moodengDUSIT@gmail.com', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0953948591'),
('male', 'Mooham', 'Zamlam', 'moohamZL@gmail.com', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0953948501'),
('female', 'Drop', 'Database', 'database.hard@mail.kmutt.ac.th', FALSE, 'correctpassword', 'https://i.pravatar.cc/300', '0954859295'),
('male', 'Mooham', 'Chugra', 'moohamChugra@gmail.com', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0954059382'),
('female', 'Feen', 'Badboy', 'feenBadboy@gmail.com', FALSE, 'correctpassword', 'https://i.pravatar.cc/300', '0950495032'),
('male', 'Muay', 'Kill', 'muayKill@gmail.com', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0954059281'),
('female', 'Pee', 'Group', 'peeLQ@gmail.com', TRUE, 'correctpassword', 'https://i.pravatar.cc/300', '0950593813'),
('male', 'Database', 'Drop', 'database.ez@mail.kmutt.ac.th', FALSE, 'correctpassword', 'https://i.pravatar.cc/300', '0952945943');

-- Insert Roles
INSERT INTO roles (role_name) VALUES 
('Super Admin'),
('Staff Admin');

-- Insert Admins
INSERT INTO admins (user_id, role_id) VALUES
(6, 1),  -- UserID 6 is Super Admin
(7, 2),  -- UserID 7 is Staff Admin
(8, 1),  -- UserID 8 is Super Admin
(9, 1),  -- UserID 9 is Super Admin
(10, 2); -- UserID 10 is Staff Admin

-- Customer Table: Stores registered customers
INSERT INTO customers (user_id)
VALUES
(1),
(2),
(3),
(4),
(5);

-- Manufacturer Table: Stores manufacturer details
INSERT INTO manufacturers (manufacturer_id, manufacturer_name)  
VALUES  
('TCP-0001', 'บริษัท ที.ซี.ฟาร์มาซูติคอล อุตสาหกรรม จำกัด');

-- Category Table: Stores product categories
INSERT INTO categories (category_name)
VALUES
('Beverage'),
('Accessories'),
('Merchandise');

-- Product Table: Stores product details
INSERT INTO products (product_id, name, price, description, is_available,stock_quantity, manufacturer_id, category_id, created_by, updated_by)
VALUES
('PRK-0001', 'เพียวริคุ องุ่นเคียวโฮ', 15.00, 'น้ำชาเพียวริคุผสมกับน้ำองุ่นเคียวโฮรสชาติหวานหอม สดชื่น ขนาด 350 มิลลิลิตร', TRUE, 150, 'TCP-0001', 1, 1, 1),
('PRK-0002', 'เพียวริคุ ทับทิม', 15.00, 'น้ำชาเพียวริคุผสมกับน้ำทับทิมรสชาติเปรี้ยวหวาน สดชื่น ขนาด 350 มิลลิลิตร', TRUE, 120, 'TCP-0001', 1, 1, 1),
('PRK-0003', 'เพียวริคุ ลิ้นจี่ ไลจิโกะ', 15.00, 'น้ำชาเพียวริคุผสมกับลิ้นจี่และน้ำผลไม้ไลจิโกะ หอมหวานสดชื่น ขนาด 350 มิลลิลิตร', TRUE, 100, 'TCP-0001', 1, 1, 1),
('PRK-0004', 'เพียวริคุ พิงค์กุ สตรอเบอร์รี่', 15.00, 'น้ำชาเพียวริคุผสมกับสตรอเบอร์รี่รสชาติหวานหอมและสดชื่น ขนาด 350 มิลลิลิตร', TRUE, 130, 'TCP-0001', 1, 1, 1),
('PRK-0005', 'เพียวริคุ ฮอกไกโดเมล่อน', 15.00, 'น้ำชาเพียวริคุผสมกับน้ำเมล่อนฮอกไกโด หอมหวานละมุน ขนาด 350 มิลลิลิตร', TRUE, 110, 'TCP-0001', 1, 1, 1),
('PRK-0006', 'เพียวริคุ ฮันนี่เลมอน', 15.00, 'น้ำชาเพียวริคุผสมกับน้ำมะนาวและน้ำผึ้ง สดชื่นและมีรสหวานอมเปรี้ยว ขนาด 350 มิลลิลิตร', TRUE, 150, 'TCP-0001', 1, 1, 1),
('PRK-0007', 'เพียวริคุ มิกซ์เบอร์รี่', 15.00, 'น้ำชาเพียวริคุผสมกับผลไม้เบอร์รี่หลากหลายชนิด รสชาติหวานสดชื่น ขนาด 350 มิลลิลิตร', TRUE, 120, 'TCP-0001', 1, 1, 1),
('PRK-0008', 'เพียวริคุ เก๊กฮวยขาว', 15.00, 'น้ำชาเพียวริคุผสมกับดอกเก๊กฮวยขาว กลิ่นหอมและรสชาติสดชื่น ขนาด 350 มิลลิลิตร', TRUE, 100, 'TCP-0001', 1, 1, 1),
('DPK-0001', 'ตุ๊กตา เพียวริคุ ฮันนี่เลมอน', 299.00, 'ตุ๊กตาน่ารักลายเพียวริคุ ฮันนี่เลมอน ขนาดกลาง', TRUE, 50, 'TCP-0001', 3, 1, 1),
('DPK-0002', 'ตุ๊กตา เพียวริคุ มิกซ์เบอร์รี่', 299.00, 'ตุ๊กตาน่ารักลายเพียวริคุ มิกซ์เบอร์รี่ ขนาดกลาง', TRUE, 50, 'TCP-0001', 3, 1, 1),
('GPK-0001', 'แก้วน้ำ เพียวริคุ เก๊กฮวยขาว', 199.00, 'แก้วน้ำลายพิเศษจากเพียวริคุ รสเก๊กฮวยขาว ความจุ 500 มล.', TRUE, 70, 'TCP-0001', 2, 1, 1),
('GPK-0002', 'แก้วน้ำ เพียวริคุ มิกซ์เบอร์รี่', 199.00, 'แก้วน้ำลายพิเศษจากเพียวริคุ รสมิกซ์เบอร์รี่ ความจุ 500 มล.', TRUE, 70, 'TCP-0001', 2, 1, 1);

-- Product images
INSERT INTO product_images (product_id, image_path)
VALUES
('PRK-0001', 'https://i.pravatar.cc/300'),
('PRK-0001', 'https://i.pravatar.cc/300'),
('PRK-0001', 'https://i.pravatar.cc/300'),
('DPK-0001', 'https://i.pravatar.cc/300'),
('DPK-0001', 'https://i.pravatar.cc/300'),
('DPK-0001', 'https://i.pravatar.cc/300'),
('GPK-0001', 'https://i.pravatar.cc/300'),
('GPK-0001', 'https://i.pravatar.cc/300'),
('GPK-0001', 'https://i.pravatar.cc/300');


-- Customer 1 adds 2 bottles of grape tea and 1 merchandise item (cup)
INSERT INTO cart_items (customer_id, product_id, quantity)
VALUES
(1, 'PRK-0001', 2),       
(1, 'PRK-0005', 1),    
(1, 'GPK-0001', 1),       
(2, 'DPK-0001', 3),         
(2, 'PRK-0006', 2),      
(2, 'GPK-0002', 1),         
(3, 'PRK-0003', 1),         
(3, 'PRK-0008', 1),     
(3, 'DPK-0002', 2),        
(4, 'PRK-0004', 2),      
(4, 'PRK-0007', 3),        
(4, 'GPK-0001', 1),       
(5, 'PRK-0002', 1),         
(5, 'GPK-0002', 1),         
(5, 'DPK-0001', 1);         

-- Insert default status into the order_statuses table
INSERT INTO order_statuses (status_code, status_description)
VALUES
(1, 'Pending Payment'), -- Order is pending payment
(2, 'Processing'), -- Order is processing
(3, 'Shipped'), -- Order has been shipped
(4, 'Delivered'); -- Order has been delivered

-- Insert default payment method into the payment_methods table
INSERT INTO payment_methods (payment_method_id, method_name)
VALUES
(1, 'Credit Card'),       -- Payment by Credit Card
(2, 'PayPal'),            -- Payment via PayPal
(3, 'Bank Transfer'),     -- Payment via Bank Transfer
(4, 'Cash on Delivery'),  -- Payment by Cash on Delivery
(5, 'Apple Pay');         -- Payment via Apple Pay

-- Insert additional payment records
INSERT INTO payments (payment_method_id, total_amount, payment_date)
VALUES 
(1, 30.00, '2024-05-15 10:23:45'),
(2, 299.00, '2024-05-20 14:45:23'),   
(3, 45.00, '2024-06-05 09:15:00'),    
(4, 30.00, '2024-06-21 13:30:12'),    
(5, 199.00,  '2024-07-10 11:05:50'),  
(1, 796.00, '2024-07-18 17:50:34'),  
(2, 30.00, '2024-08-12 16:30:02'),  
(3, 299.00, '2024-08-25 12:12:12'),    
(4, 398.00,  '2024-09-03 10:01:01'),  
(5, 45.00, '2024-09-29 08:20:10'),   
(1, 15.00, '2024-10-11 15:35:45'),   
(2, 199.00,  '2024-10-22 19:55:33'), 
(3, 45.00, '2024-11-07 14:40:50'),    
(4, 598.00, '2024-11-19 11:55:12'),   
(5, 15.00, '2024-12-04 16:45:34'),   
(1, 15.00,  '2024-12-28 10:12:01'),  
(2, 398.00, '2025-01-09 13:01:59'), 
(3, 15.00, '2025-01-27 18:25:03'),    
(4, 199.00, '2025-02-06 11:10:20'),    
(5, 15.00,  '2025-02-23 09:45:12'),  
(1, 45.00, '2025-03-05 14:15:22'),   
(2, 30.00, '2025-03-16 16:35:17'), 
(3, 105.00, '2025-04-01 08:50:45'),   
(4, 299.00,  '2025-04-13 12:12:12');   

-- Insert some example orders
INSERT INTO orders (customer_id, payment_id, status_code, order_date, updated_at)
VALUES
(1, 1, 3, '2024-05-15 10:30:00', '2024-05-15 10:30:00'),  
(3, 2, 3, '2024-06-05 09:20:30', '2024-06-05 09:20:30'),  
(2, 3, 1, '2024-05-20 14:55:00', '2024-05-20 14:55:00'), 
(4, 4, 4, '2024-06-21 13:35:45', '2024-06-21 13:35:45'), 
(5, 5, 1, '2024-07-10 11:10:50', '2024-07-10 11:10:50'), 
(1, 6, 3, '2024-07-18 17:55:00', '2024-07-18 17:55:00'),  
(2, 7, 4, '2024-08-12 16:40:20', '2024-08-12 16:40:20'), 
(3, 8, 3, '2024-08-25 12:20:30', '2024-08-25 12:20:30'),  
(4, 9, 1, '2024-09-03 10:05:10', '2024-09-03 10:05:10'), 
(5, 10, 3, '2024-09-29 08:30:30', '2024-09-29 08:30:30'), 
(1, 11, 3, '2024-10-11 15:40:30', '2024-10-11 15:40:30'), 
(2, 12, 1, '2024-10-22 20:00:45', '2024-10-22 20:00:45'),
(3, 13, 3, '2024-11-07 14:50:10', '2024-11-07 14:50:10'), 
(4, 14, 4, '2024-11-19 12:00:00', '2024-11-19 12:00:00'), 
(5, 15, 3, '2024-12-04 16:50:10', '2024-12-04 16:50:10'), 
(1, 16, 1, '2024-12-28 10:15:00', '2024-12-28 10:15:00'),
(2, 17, 3, '2025-01-09 13:10:00', '2025-01-09 13:10:00'), 
(3, 18, 4, '2025-01-27 18:30:30', '2025-01-27 18:30:30'), 
(4, 19, 3, '2025-02-06 11:15:20', '2025-02-06 11:15:20'), 
(5, 20, 1, '2025-02-23 09:50:40', '2025-02-23 09:50:40'),
(1, 21, 3, '2025-03-05 14:20:30', '2025-03-05 14:20:30'), 
(2, 22, 4, '2025-03-16 16:40:50', '2025-03-16 16:40:50'), 
(3, 23, 3, '2025-04-01 08:55:00', '2025-04-01 08:55:00'), 
(4, 24, 1, '2025-04-13 12:15:00', '2025-04-13 12:15:00');


-- Insert example data into order_items (for 10 orders)
INSERT INTO order_items (order_id, product_id, quantity)
VALUES
(1, 'PRK-0001', 2),
(2, 'DPK-0001', 1),  
(3, 'PRK-0002', 3),   
(4, 'PRK-0004', 2),   
(5, 'GPK-0001', 1),  
(6, 'GPK-0002', 4),   
(7, 'PRK-0003', 2),   
(8, 'DPK-0001', 1),  
(9, 'GPK-0001', 2),   
(10, 'PRK-0002', 3),  
(11, 'PRK-0003', 1),  
(12, 'PRK-0004', 2),  
(13, 'GPK-0002', 1),  
(14, 'PRK-0001', 3),  
(15, 'DPK-0001', 2),  
(16, 'PRK-0003', 1),  
(17, 'PRK-0002', 1),  
(18, 'GPK-0002', 2),  
(19, 'PRK-0004', 1),  
(20, 'GPK-0001', 2),  
(21, 'PRK-0002', 1),  
(22, 'PRK-0003', 3),  
(23, 'PRK-0001', 2),  
(24, 'DPK-0001', 1);  

-- Insert example data into reviews
INSERT INTO reviews (rating, comment, product_id, customer_id)
VALUES
(5, 'Great product, really loved the taste!', 'PRK-0001', 1),  -- Review for product 1 by customer 1
(4, 'Good quality but a bit too sweet for my liking.', 'GPK-0001', 2),  -- Review for product 2 by customer 2
(3, 'It was okay, not the best flavor.', 'DPK-0001', 3),  -- Review for product 3 by customer 3
(5, 'Excellent quality and very fresh!', 'PRK-0003', 4);  -- Review for product 4 by customer 4

INSERT INTO reviews (rating, comment, reply_comment, product_id, customer_id, replied_by)
VALUES
(2, 'Not worth the price, disappointing taste.', 'Thank you for your feedback, We will fix it.', 'PRK-0004', 5, 2);  -- Review for product 5 by customer 5

-- Promotion Table: Stores details about promotional offers, including the discount percentage and validity period
INSERT INTO promotions (promotion_id, name, release_date, expiry_date, banner_path, discount_percent, created_by, updated_by)
VALUES
('PROM0001', 'พี่แฮมสั่งลด', '2050-06-01 00:00:00', '2050-06-16 23:59:59','/images/promotion/PROM0001_banner.jpg', 10, 1, 1),  -- Promotion created and updated by admin 1
('PROM0002', 'พี่แฮมถูกหวย', '2025-02-16 00:00:00', '2025-02-23 23:59:59','/images/promotion/PROM0002_banner.jpg', 20, 2, 2),  -- Promotion created and updated by admin 2
('PROM0003', 'เพียวริคุสักหน่อยมั้ย', '2025-12-01 00:00:00', '2025-12-25 23:59:59', '/images/promotion/PROM0003_banner.jpg', 10, 3, 3);  -- Promotion created and updated by admin 3

-- Inserting product associations for promotions
INSERT INTO promotion_products (promotion_id, product_id)
VALUES
('PROM0001', 'PRK-0001'),  -- Associating product PRK-0001 with promotion PROM0001
('PROM0001', 'PRK-0002'),  -- Associating product PRK-0002 with promotion PROM0001
('PROM0002', 'PRK-0003'),  -- Associating product PRK-0003 with promotion PROM0002
('PROM0002', 'GPK-0001'),  -- Associating product GPK-0001 with promotion PROM0002
('PROM0003', 'PRK-0004'),  -- Associating product PRK-0004 with promotion PROM0003
('PROM0003', 'GPK-0002');  -- Associating product GPK-0002 with promotion PROM0003

-- address (may be optimize ?)
INSERT INTO addresses (first_name, last_name, phone_number, customer_id, address_text, country, province, district, postal_code, is_default)
VALUES
('Phoorin', 'Chinphuad', '0956934807', 1, '123/1 ถนนพหลโยธิน ลาดยาว', 'ไทย', 'กรุงเทพมหานคร', 'จตุจักร', '10900', TRUE),
('Phoorin', 'Chinphuad', '0956934807', 1, '456/2 ถนนสุขุมวิท คลองตัน', 'ไทย', 'กรุงเทพมหานคร', 'คลองเตย', '10110', FALSE),
('Skibidi', 'Toilet', '0951234567', 2, '789/3 ถนนพระราม 2 มหาชัย', 'ไทย', 'สมุทรสาคร', 'เมืองสมุทรสาคร', '74000', TRUE),
('Skibidi', 'Toilet', '0951234567', 2, '101/4 ถนนสีลม สีลม', 'ไทย', 'กรุงเทพมหานคร', 'บางรัก', '10500', FALSE),
('Moodeng', 'Auan', '0953948591', 3, '321/5 ถนนเพลินจิต ลุมพินี', 'ไทย', 'กรุงเทพมหานคร', 'ปทุมวัน', '10330', TRUE),
('Moodeng', 'Auan', '0953948591', 3, '654/6 ถนนราชพฤกษ์ บางรักพัฒนา', 'ไทย', 'นนทบุรี', 'บางบัวทอง', '11110', FALSE),
('Mooham', 'Zamlam', '0953948501', 4, '234/7 ถนนศรีนครินทร์ หนองบอน', 'ไทย', 'กรุงเทพมหานคร', 'ประเวศ', '10250', TRUE),
('Mooham', 'Zamlam', '0953948501', 4, '567/8 ถนนลาดพร้าว โชคชัย 4', 'ไทย', 'กรุงเทพมหานคร', 'วังทองหลาง', '10310', FALSE),
('Drop', 'Database', '0954859295', 5, '890/9 ถนนธนบุรี คลองสาน', 'ไทย', 'กรุงเทพมหานคร', 'คลองสาน', '10600', TRUE),
('Drop', 'Database', '0954859295', 5, '112/10 ถนนบางนา-ตราด บางนาเหนือ', 'ไทย', 'กรุงเทพมหานคร', 'บางนา', '10260', FALSE);