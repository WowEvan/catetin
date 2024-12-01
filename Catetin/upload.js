document.getElementById('uploadSquare').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const plus = document.querySelector('.plus');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName.textContent = file.name;
        fileInfo.style.display = 'block';
        plus.style.display = 'none';
        uploadButton.disabled = false;
    } else {
        uploadButton.disabled = true;
        fileInfo.style.display = 'none';
        plus.style.display = 'block';
    }
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file sebelum mengupload.");
        return;
    }

    const formData = new FormData(this);
    fetch('upload.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("File berhasil diunggah!");
            uploadButton.disabled = true;
            document.getElementById('uploadSquare').style.pointerEvents = 'none';
        } else {
            alert("Gagal mengunggah file.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat mengunggah file.");
    });
});

function loadUploadHistory() {
    fetch('get_upload_history.php')
    .then(response => response.json())
    .then(data => {
        const historyContainer = document.getElementById('uploadHistory');
        historyContainer.innerHTML = '';
        data.data.forEach((upload, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${upload.filename}</td>
                <td>${upload.status}</td>
                <td>${upload.total_dibeli}</td>
            `;
            historyContainer.appendChild(row);
        });
    })
    .catch(error => console.error("Error:", error));
}

document.addEventListener('DOMContentLoaded', loadUploadHistory);