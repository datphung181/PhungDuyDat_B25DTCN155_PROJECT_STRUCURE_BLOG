const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const registerForm = document.getElementById('registerForm');


const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');


registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    register();
});

function validForm() {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const users = JSON.parse(localStorage.getItem('users')) || [];


    if (firstName.value.trim() === '' || lastName.value.trim() === '' || email.value.trim() === '' || password.value.trim() === '' || confirmPassword.value.trim() === '') {
        firstNameError.textContent = 'Không được để trống';
        lastNameError.textContent = 'Không được để trống';
        emailError.textContent = 'Không được để trống';
        passwordError.textContent = 'Không được để trống';
        confirmPasswordError.textContent = 'Không được để trống';

        firstName.classList.add('input-error');
        lastName.classList.add('input-error');
        email.classList.add('input-error');
        password.classList.add('input-error');
        confirmPassword.classList.add('input-error');

        isValid = false;
    }

    if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = 'Mật khẩu không khớp';
        confirmPassword.classList.add('input-error');
        isValid = false;
    }

    if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Email không hợp lệ';
        email.classList.add('input-error');
        isValid = false;
    }
    
    if (password.value.length < 6) {
        passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        password.classList.add('input-error');
        isValid = false;
    }

    if (users.some(user => user.email === email.value.trim())) {
        emailError.textContent = 'Email đã tồn tại';
        email.classList.add('input-error');
        isValid = false;
    }
    return isValid;
};

function register() {
    if (validForm()) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            password: password.value.trim()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Đăng ký thành công!');
        window.location.href = './login.html';
        registerForm.reset();
    }
}

firstName.addEventListener('input', function () {
    firstNameError.textContent = '';
    firstName.classList.remove('input-error');
});

lastName.addEventListener('input', function () {
    lastNameError.textContent = '';
    lastName.classList.remove('input-error');
});

email.addEventListener('input', function () {
    emailError.textContent = '';
    email.classList.remove('input-error');
});

password.addEventListener('input', function () {
    passwordError.textContent = '';
    password.classList.remove('input-error');
}); 

confirmPassword.addEventListener('input', function () {
    confirmPasswordError.textContent = '';
    confirmPassword.classList.remove('input-error');
});


