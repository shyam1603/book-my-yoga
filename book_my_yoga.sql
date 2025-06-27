-- Create database
CREATE DATABASE IF NOT EXISTS book_my_yoga;
USE book_my_yoga;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    yoga_type VARCHAR(50) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', 'password123'),
('Jane Smith', 'jane@example.com', 'password123'),
('Admin User', 'admin@example.com', 'admin123');

-- Insert sample bookings
INSERT INTO bookings (user_id, date, time, yoga_type, instructor, notes) VALUES 
(1, '2023-06-25', 'morning', 'hatha', 'Sarah Johnson', 'First session'),
(2, '2023-06-26', 'evening', 'vinyasa', 'Michael Chen', 'Bring my own mat'),
(1, '2023-06-28', 'afternoon', 'yin', 'Priya Patel', '');