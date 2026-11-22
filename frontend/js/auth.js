const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const authMessage = document.getElementById('auth-message');

const API_BASE = "http://localhost:5000";

function showMessage(text, type) {
    authMessage.textContent = text;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
}

function hideMessage() {
    authMessage.style.display = 'none';
}

function switchAuthTab(mode) {
    hideMessage();
    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

function redirectByRole(role) {
    setTimeout(() => {
        if (role === 'seller') {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "index.html";
        }
    }, 900);
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessage();

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim().toLowerCase();
            const role = document.getElementById('reg-role').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password.length < 6) {
                showMessage("Password must be at least 6 characters long.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", "error");
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, role, password })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    showMessage(data.message || "Registration failed.", "error");
                    return;
                }

                localStorage.setItem('mm_current_user', JSON.stringify(data.user));
                showMessage("Account created in database! Redirecting...", "success");
                redirectByRole(data.user.role);
            } catch (err) {
                // Fallback to localStorage if backend server is stopped
                const users = JSON.parse(localStorage.getItem('mm_users')) || [];
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === email) {
                        showMessage("An account with this email already exists.", "error");
                        return;
                    }
                }

                const newUser = { name, email, role, password };
                users.push(newUser);
                localStorage.setItem('mm_users', JSON.stringify(users));
                localStorage.setItem('mm_current_user', JSON.stringify({ name, email, role }));

                showMessage("Account created locally! Redirecting...", "success");
                redirectByRole(role);
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessage();

            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    showMessage(data.message || "Invalid email or password.", "error");
                    return;
                }

                localStorage.setItem('mm_current_user', JSON.stringify(data.user));
                showMessage(`Welcome back, ${data.user.name}!`, "success");
                redirectByRole(data.user.role);
            } catch (err) {
                // Fallback to localStorage if backend server is stopped
                const users = JSON.parse(localStorage.getItem('mm_users')) || [];
                let matchedUser = null;

                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === email && users[i].password === password) {
                        matchedUser = users[i];
                        break;
                    }
                }

                if (!matchedUser) {
                    showMessage("Invalid email or password.", "error");
                    return;
                }

                localStorage.setItem('mm_current_user', JSON.stringify({
                    name: matchedUser.name,
                    email: matchedUser.email,
                    role: matchedUser.role
                }));

                showMessage(`Welcome back, ${matchedUser.name}!`, "success");
                redirectByRole(matchedUser.role);
            }
        });
    }
});