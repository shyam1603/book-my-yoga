<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'book_my_yoga';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die("Connection failed. Please try again later.");
}

// Set charset to utf8
$conn->set_charset("utf8");
?>