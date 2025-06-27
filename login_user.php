<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate inputs
    if (empty($email) || empty($password)) {
        header("Location: ../login.html?error=emptyfields");
        exit();
    }

    // Check if user exists
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Verify password using password_verify for hashed passwords
        if (password_verify($password, $user['password'])) {
            // Password is correct, start session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            
            header("Location: ../dashboard.html");
            exit();
        } else {
            // Invalid password
            header("Location: ../login.html?error=invalidcredentials");
            exit();
        }
    } else {
        // User doesn't exist
        header("Location: ../login.html?error=nouser");
        exit();
    }

    $stmt->close();
    $conn->close();
} else {
    // Not a POST request
    header("Location: ../login.html");
    exit();
}
?>