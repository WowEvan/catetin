<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "catetin";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];

$stmt = $conn->prepare("SELECT username FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username);
$stmt->fetch();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => true, "username" => $username]);
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>