<?php
session_start();
$servername = "localhost";
$db_username = "root";
$db_password = "";
$dbname = "catetin";

$conn = new mysqli($servername, $db_username, $db_password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = $_POST['username'];
$current_password = $_POST['current_password'];
$new_password = $_POST['new_password'];

$sql = "SELECT password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($current_password, $user['password'])) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        $update_sql = "UPDATE users SET password = ? WHERE username = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ss", $hashed_password, $username);
        $update_stmt->execute();
        
        if ($update_stmt->affected_rows > 0) {
            echo "success";
        } else {
            echo "Failed to change password.";
        }
    } else {
        echo "Current password is incorrect.";
    }
} else {
    echo "User not found.";
}

$stmt->close();
$conn->close();
?>