// DOM Elements
const elements = {
    formTitle: document.getElementById("form-title"),
    formSubtext: document.getElementById("form-subtext"),
    usernameInput: document.getElementById("username"),
    passwordInput: document.getElementById("password"),
    authButton: document.getElementById("auth-button"),
    toggleAuth: document.getElementById("toggle-auth"),
    errorMessage: document.getElementById("error-message"),
    successMessage: document.getElementById("success-message")
};

let isLogin = true;

// redirect if logged in
if (localStorage.getItem("loggedInUser")) {
    window.location.href = "dashboard.html";
}

function clearMessages() {
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
}

function switchMode() {
    isLogin = !isLogin;
    elements.formTitle.textContent = isLogin ? "Login" : "Register";
    elements.formSubtext.textContent = isLogin ? "Please enter your details below" : "Please register your account below";
    elements.authButton.textContent = isLogin ? "Login" : "Register";
    elements.toggleAuth.textContent = isLogin
        ? "Don't have an account? Register"
        : "Already have an account? Login";
    clearMessages();
}

function authenticate() {
    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value.trim();

    if (!username || !password) {
        showMessage("error", "Please enter a username and password.");
        return;
    }

    if (isLogin) {
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser && storedUser.password === password) {
            localStorage.setItem("loggedInUser", username);
            window.location.href = "dashboard.html";
        } else {
            showMessage("error", "Invalid username or password.");
        }
    } else {
        if (localStorage.getItem(username)) {
            showMessage("error", "Username already exists!");
        } else {
            localStorage.setItem(username, JSON.stringify({ password }));
            showMessage("success", "Registration successful! Please log in.");
            setTimeout(switchMode, 1500);
        }
    }
}

function showMessage(type, message) {
    if (type === "error") {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = "block";
        elements.successMessage.style.display = "none";
    } else {
        elements.successMessage.textContent = message;
        elements.successMessage.style.display = "block";
        elements.errorMessage.style.display = "none";
    }
}

// event listeners

elements.toggleAuth.addEventListener("click", switchMode);
elements.authButton.addEventListener("click", authenticate);
