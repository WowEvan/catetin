<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "catetin";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $new_password = $data['new_password'];
    $confirm_password = $data['confirm_password'];

    if ($new_password !== $confirm_password) {
        echo json_encode(["success" => false, "message" => "New passwords do not match."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $new_hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
        $update_stmt->bind_param("ss", $new_hashed_password, $email);

        if ($update_stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Password updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating password."]);
        }

        $update_stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Email not found."]);
    }

    $stmt->close();
}
$conn->close();
?>