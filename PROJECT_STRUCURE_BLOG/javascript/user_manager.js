document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.replace("../pages/login.html");
    }
});

import { users as defaultUsers } from "./database.js";

const tbody = document.getElementById("userTableBody");

function getAllUsers() {
    // Lấy user đăng ký từ localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Chuyển format cho khớp với defaultUsers
    const mapped = registeredUsers.map((u, index) => ({
        id: defaultUsers.length + index + 1,
        firstName: u.firstName,   
        lastName: u.lastName,     
        email: u.email,
        password: u.password,
        role: "user"
    }));

    // Gộp user mặc định + user mới đăng ký
    // Lọc trùng email để tránh duplicate
    const allUsers = [...defaultUsers];
    mapped.forEach(newUser => {
        if (!allUsers.some(u => u.email === newUser.email)) {
            allUsers.push(newUser);
        }
    });

    return allUsers;
}

function renderUsers(list = getAllUsers()) {
    tbody.innerHTML = "";

    list.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <img class="avatar" src="https://i.pravatar.cc/80?u=${user.email}">
                    <div>
                        <div class="user-name">${user.firstName} ${user.lastName}</div>
                        <div class="user-handle">@${user.firstName.toLowerCase()}</div>
                    </div>
                </div>
            </td>
            <td><span class="status-badge">hoạt động</span></td>
            <td class="email">${user.email}</td>
            <td>
                <div class="actions">
                    <button class="btn-action btn-block">block</button>
                    <button class="btn-action btn-unblock">unblock</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const userCount = document.getElementById("userCount");

function updateUserCount() {
    const total = getAllUsers().length;
    userCount.textContent = `${total} users`;
}

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = getAllUsers().filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(keyword)
    );
    renderUsers(filtered);
});

document.getElementById("btnLogout1").addEventListener("click", function () {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem("currentUser");

        // chặn quay lại
        window.location.replace("../pages/login.html");
    }
});

document.getElementById("btnLogout2").addEventListener("click", function () {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem("currentUser");

        // chặn quay lại
        window.location.replace("../pages/login.html");
    }
});

renderUsers();
updateUserCount();