<?php
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'catetin';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['noteFile']) && $_FILES['noteFile']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($_FILES['noteFile']['name']);

        if (file_exists($uploadFile)) {
            $response['message'] = "File sudah ada. Silakan pilih file lain.";
        } else {
            if (move_uploaded_file($_FILES['noteFile']['tmp_name'], $uploadFile)) {
                $stmt = $conn->prepare("INSERT INTO uploads (filename, status, total_dibeli) VALUES (?, 'Pending', 0)");
                $stmt->bind_param("s", $_FILES['noteFile']['name']);

                if ($stmt->execute()) {
                    $response['success'] = true;
                    $response['message'] = "File berhasil diunggah.";
                } else {
                    $response['message'] = "Kesalahan database: " . $stmt->error;
                }

                $stmt->close();
            } else {
                $response['message'] = "Gagal memindahkan file yang diupload.";
            }
        }
    } else {
        $response['message'] = "Kesalahan pada file yang diupload: " . $_FILES['noteFile']['error'];
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);