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

$data = json_decode(file_get_contents("php://input"));
if (!$data || !isset($data->noteId)) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit;
}

$noteId = $data->noteId;

$query = "UPDATE uploads SET total_dibeli = total_dibeli + 1 WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $noteId);

if ($stmt->execute()) {
    $result = $conn->query("SELECT total_dibeli FROM uploads WHERE id = $noteId");

    if ($result) {
        $note = $result->fetch_assoc();
        echo json_encode(['success' => true, 'newTotalDibeli' => $note['total_dibeli']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error fetching updated data.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating the database.']);
}

$conn->close();
?>