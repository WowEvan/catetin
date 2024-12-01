const signInBtn = document.getElementById("sign_in_btn");
const signUpBtn = document.getElementById("sign_up_btn");
const loginContainer = document.querySelector(".login_container");
const closeModalBtn = document.querySelector(".close_modal");

const loginForm = document.querySelector(".signin_form");
const registerForm = document.querySelector(".signup_form");

signInBtn.addEventListener("click", () => switchToLogin());
signUpBtn.addEventListener("click", () => switchToRegister());

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    
    try {
        const response = await fetch("login.php", {
            method: "POST",
            body: formData,
        });
        const result = await response.text();

        if (result.includes("Login successful")) {
            const email = formData.get("email");
            const usernameResponse = await fetch("get_username.php", {
                method: "POST",
                body: JSON.stringify({ email: email }),
                headers: { "Content-Type": "application/json" }
            });
            const userData = await usernameResponse.json();

            if (userData.success) {
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("username", userData.username);
                alert("Login successful! Redirecting to home...");
                window.location.href = "home.html";
            } else {
                alert("Unable to retrieve user details.");
            }
        } else {
            alert(result);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Unable to connect to the server. Please try again.");
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    
    try {
        const response = await fetch("register.php", {
            method: "POST",
            body: formData,
        });
        const result = await response.text();

        if (result.includes("Registration successful")) {
            alert("Registration successful! Redirecting to login...");
            loginContainer.classList.remove("sign_up_mode");
        } else {
            alert(result);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Unable to connect to the server. Please try again.");
    }
});

const forgotPasswordModal = document.getElementById("forgot_password_modal");
const forgotForm = document.getElementById("forgot_password_form");

document.getElementById("forgot_password_link").addEventListener("click", () => {
    forgotPasswordModal.classList.add("show");
});

document.getElementById("close_forgot_password_modal").addEventListener("click", () => {
    forgotPasswordModal.classList.remove("show");
});

forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot_email").value;
    const newPassword = document.getElementById("forgot_new_password").value;
    const confirmPassword = document.getElementById("forgot_confirm_password").value;

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    const response = await fetch("forgot_password.php", {
        method: "POST",
        body: JSON.stringify({ email, new_password: newPassword, confirm_password: confirmPassword }),
        headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) {
        forgotPasswordModal.classList.remove("show");
    }
});

function switchToLogin() {
    loginContainer.classList.remove("sign_up_mode");
}

function switchToRegister() {
    loginContainer.classList.add("sign_up_mode");
}

window.addEventListener("click", (e) => {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove("show");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = "";
    });
});