<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate inputs
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        header("Location: ../signup.html?error=emptyfields");
        exit();
    }

    if ($password !== $confirm_password) {
        header("Location: ../signup.html?error=passwordmismatch");
        exit();
    }

    // Check if email already exists
    $sql = "SELECT email FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        header("Location: ../signup.html?error=emailtaken");
        exit();
    }

    // Hash the password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $hashed_password);

    if ($stmt->execute()) {
        // Get the new user's ID
        $user_id = $stmt->insert_id;
        
        // Start session
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        
        header("Location: ../dashboard.html");
        exit();
    } else {
        header("Location: ../signup.html?error=sqlerror");
        exit();
    }

    $stmt->close();
    $conn->close();
} else {
    // Not a POST request
    header("Location: ../signup.html");
    exit();
}
?>