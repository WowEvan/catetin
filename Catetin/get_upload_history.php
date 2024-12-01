<?php
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'catetin';

$conn = new mysqli($host, $user, $password, $dbname);
$response = ['data' => []];

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

$sql = "SELECT id, filename, status, total_dibeli FROM uploads";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $response['data'][] = $row;
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>