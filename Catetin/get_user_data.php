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

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

$stmt = $conn->prepare("SELECT username, email, phone_number, birthday FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($fetched_username, $fetched_email, $fetched_phone, $fetched_birthday);
$stmt->fetch();

if ($stmt->num_rows > 0) {
    $response = [
        "success" => true,
        "data" => [
            "username" => $fetched_username,
            "email" => $fetched_email,
            "phone_number" => $fetched_phone,
            "birthday" => $fetched_birthday
        ]
    ];
} else {
    $response = [
        "success" => false,
        "message" => "User not found."
    ];
}

$stmt->close();
$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>