INSERT INTO users (gender, first_name, last_name, email, is_email_verified, password, image_profile_path, phone_number) 
VALUES 
('male', 'Phoorin', 'Chinphuad', 'phoorin.chin@mail.kmutt.ac.th', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD1', '/images/profile/user1.jpg', '0956934807'),
('female', 'Skibidi', 'Toilet', 'skibidi_Toilet@gmail.com', FALSE, '$2y$10$EXAMPLEHASHEDPASSWORD2', '/images/profile/user2.jpg', '0951234567'),
('other', 'Moodeng', 'Auan', 'moodengDUSIT@gmail.com', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD3', '/images/profile/user3.jpg', '0953948591'),
('male', 'Mooham', 'Zamlam', 'moohamZL@gmail.com', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD4', '/images/profile/user4.jpg', '0953948501'),
('female', 'Drop', 'Database', 'database.hard@mail.kmutt.ac.th', FALSE, '$2y$10$EXAMPLEHASHEDPASSWORD5', '/images/profile/user5.jpg', '0954859295'),
('male', 'Mooham', 'Chugra', 'moohamChugra@gmail.com', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD6', '/images/profile/user6.jpg', '0954059382'),
('female', 'Feen', 'Badboy', 'feenBadboy@gmail.com', FALSE, '$2y$10$EXAMPLEHASHEDPASSWORD7', '/images/profile/user7.jpg', '0950495032'),
('male', 'Muay', 'Kill', 'muayKill@gmail.com', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD8', '/images/profile/user8.jpg', '0954059281'),
('female', 'Pee', 'Group', 'peeLQ@gmail.com', TRUE, '$2y$10$EXAMPLEHASHEDPASSWORD9', '/images/profile/user9.jpg', '0950593813'),
('male', 'Database', 'Drop', 'database.ez@mail.kmutt.ac.th', FALSE, '$2y$10$EXAMPLEHASHEDPASSWORD10', '/images/profile/user10.jpg', '0952945943');

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