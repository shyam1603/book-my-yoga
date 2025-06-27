<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $yoga_type = $_POST['yoga_type'];
    $instructor = $_POST['instructor'];
    $notes = $_POST['notes'] ?? '';

    // Validate inputs
    if (empty($date) || empty($time) || empty($yoga_type) || empty($instructor)) {
        header("Location: ../booking.html?error=emptyfields");
        exit();
    }

    // Insert booking
    $sql = "INSERT INTO bookings (user_id, date, time, yoga_type, instructor, notes) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssss", $user_id, $date, $time, $yoga_type, $instructor, $notes);

    if ($stmt->execute()) {
        header("Location: ../dashboard.html?booking=success");
        exit();
    } else {
        header("Location: ../booking.html?error=sqlerror");
        exit();
    }

    $stmt->close();
    $conn->close();
} else {
    // Not a POST request
    header("Location: ../booking.html");
    exit();
}
?>