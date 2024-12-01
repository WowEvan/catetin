document.addEventListener("DOMContentLoaded", async () => {
    if (localStorage.getItem("loggedIn") === "true") {
        const username = localStorage.getItem("username");
        document.getElementById("username_display").textContent = username;

        const response = await fetch("get_user_data.php", {
            method: "POST",
            body: JSON.stringify({ username: username }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById("user_name").value = result.data.username;
            document.getElementById("user_email").textContent = result.data.email;
            document.getElementById("user_phone").value = result.data.phone_number;
            document.getElementById("user_birthday").value = result.data.birthday;
        } else {
            alert(result.message);
        }
    } else {
        window.location.href = "login.html";
    }

    document.getElementById("save_button").addEventListener("click", async () => {
        const updatedData = {
            username: document.getElementById("user_name").value,
            email: document.getElementById("user_email").textContent,
            phone_number: document.getElementById("user_phone").value,
            birthday: document.getElementById("user_birthday").value,
            current_password: document.getElementById("current_password").value
        };

        const response = await fetch('update_user_data.php', {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert('Error: ' + errorText);
            return;
        }

        try {
            const result = await response.json();
            if (result.success) {
                alert(result.message);
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Error parsing server response');
        }
    });

    document.getElementById("cancel_button").addEventListener("click", () => {
        document.getElementById("profile_modal").style.display = "none";
    });

    document.getElementById("profile_link").addEventListener("click", () => {
        const modal = document.getElementById("profile_modal");
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
    });

    document.getElementById("close_modal").addEventListener("click", () => {
        document.getElementById("profile_modal").style.display = "none";
    });

    document.getElementById("logout_button").addEventListener("click", function() {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
});

const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    if (window.location.href.indexOf(link.getAttribute('href')) !== -1) {
        link.classList.add('active');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = "";
    });
});