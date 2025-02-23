const formTitle = document.getElementById("form-title");
const formSubtext = document.getElementById("form-subtext");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const authButton = document.getElementById("auth-button");
const toggleAuth = document.getElementById("toggle-auth");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

let isLogin = true;

// Auto redirect if logged in
if (localStorage.getItem("loggedInUser")) {
    window.location.href = "dashboard.html";
}

function showMessage(type, message) {
    if (type === "error") {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
    } else {
        successMessage.textContent = message;
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
    }
}

function clearMessages() {
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
}

function switchMode() {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    formSubtext.textContent = isLogin ? "Please enter your details below" : "Please register your account below";
    authButton.textContent = isLogin ? "Login" : "Register";
    toggleAuth.textContent = isLogin
        ? "Don't have an account? Register"
        : "Already have an account? Login";
    clearMessages(); // Clear messages when switching modes
}

function authenticate() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        showMessage("error", "Please enter a username and password.");
        return;
    }

    if (isLogin) {
        // Login logic
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser && storedUser.password === password) {
            localStorage.setItem("loggedInUser", username);
            window.location.href = "dashboard.html";
        } else {
            showMessage("error", "Invalid username or password.");
        }
    } else {
        // Register logic
        if (localStorage.getItem(username)) {
            showMessage("error", "Username already exists!");
        } else {
            localStorage.setItem(username, JSON.stringify({ password }));
            showMessage("success", "Registration successful! Please log in.");
            setTimeout(switchMode, 1500); // Auto switch to login after success
        }
    }
}

toggleAuth.addEventListener("click", switchMode);
authButton.addEventListener("click", authenticate);
