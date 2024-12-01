document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(this);
    
    fetch('submit_contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('responseMessage').innerHTML = data;
        this.reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});