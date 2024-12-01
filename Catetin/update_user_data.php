<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "catetin";

header('Content-Type: application/json');

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit;
}

$current_password = $data['current_password'];
$email = $data['email'];
$new_username = isset($data['username']) ? $data['username'] : null;
$new_phone_number = isset($data['phone_number']) ? $data['phone_number'] : null;
$new_birthday = isset($data['birthday']) ? $data['birthday'] : null;

if (empty($current_password)) {
    echo json_encode(["success" => false, "message" => "Confirmation password is required."]);
    exit;
}

// Verify password based on email
$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($hashed_password);
$stmt->fetch();
$stmt->close();

if (password_verify($current_password, $hashed_password)) {
    $update_query = "UPDATE users SET ";
    $params = [];
    $types = '';
    
    if ($new_username) {
        $update_query .= "username = ?, ";
        $params[] = $new_username;
        $types .= 's';
    }
    if ($new_phone_number !== null) {
        $update_query .= "phone_number = ?, ";
        $params[] = $new_phone_number;
        $types .= 's';
    }
    if ($new_birthday !== null) {
        $update_query .= "birthday = ?, ";
        $params[] = $new_birthday;
        $types .= 's';
    }
    
    $update_query = rtrim($update_query, ", ");
    $update_query .= " WHERE email = ?";
    $params[] = $email;
    $types .= 's';

    $stmt = $conn->prepare($update_query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating profile."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Confirmation password is incorrect."]);
}

$conn->close();
?>  