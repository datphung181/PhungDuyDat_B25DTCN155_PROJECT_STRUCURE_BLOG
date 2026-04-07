import { users } from "./database.js";

const email     = document.getElementById('email');
const password  = document.getElementById('password');
const loginForm = document.getElementById('login-form');

const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    login();
});

function login() {
    const emailValue    = email.value.trim();
    const passwordValue = password.value.trim();

    // ── Reset lỗi cũ ──────────────────────────────────────────
    emailError.textContent    = '';
    passwordError.textContent = '';
    email.classList.remove('input-error');
    password.classList.remove('input-error');

    // ── Validate rỗng ─────────────────────────────────────────
    if (!emailValue) {
        emailError.textContent = 'Không được để trống';
        email.classList.add('input-error');
        return;
    }

    if (!passwordValue) {
        passwordError.textContent = 'Không được để trống';
        password.classList.add('input-error');
        return;
    }

    // ── Tìm user ──────────────────────────────────────────────
    // Ưu tiên 1: tìm trong localStorage (user mới đăng ký)
    // Ưu tiên 2: tìm trong danh sách hardcode của database.js
    const localUsers  = JSON.parse(localStorage.getItem('users')) || [];
    const allUsers    = [...users, ...localUsers];

    const user = allUsers.find(u => u.email === emailValue);

    if (!user) {
        emailError.textContent = 'Email không tồn tại';
        email.classList.add('input-error');
        return;
    }

    if (user.password !== passwordValue) {
        passwordError.textContent = 'Mật khẩu không đúng';
        password.classList.add('input-error');
        return;
    }

    // ── Lưu session và chuyển trang ───────────────────────────
    localStorage.setItem('currentUser', JSON.stringify(user));

    if (user.role === 'admin') {
        window.location.href = './user_manager.html';
    } else {
        window.location.href = '../index.html';
    }
}

// ── Xoá lỗi khi user gõ lại ──────────────────────────────────
email.addEventListener('input', function () {
    emailError.textContent = '';
    email.classList.remove('input-error');
});

password.addEventListener('input', function () {
    passwordError.textContent = '';
    password.classList.remove('input-error');
});