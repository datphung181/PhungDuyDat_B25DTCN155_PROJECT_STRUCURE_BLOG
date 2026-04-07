document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.replace("../pages/login.html");
    }
});

import { entries } from './database.js';
const categoryInput = document.getElementById('categoryInput');
const addBtn        = document.getElementById('addBtn');
const tbody         = document.getElementById('tbody');
const searchInput   = document.getElementById('searchInput');

let editingId = null;  

// ---------- localStorage ----------
function getCategories() {
    const local = JSON.parse(localStorage.getItem('categories')) || [];
    const dbOnly = entries.filter(d => !local.some(l => l.id === d.id));
    return [...dbOnly, ...local];
}

function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// ---------- Render ----------
function renderCategories(list) {
    tbody.innerHTML = '';
    list.forEach((cat, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${cat.name}</td>
            <td>
                <button class="edit-btn" data-id="${cat.id}">Sửa</button>
                <button class="delete-btn" data-id="${cat.id}">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ---------- Thêm / Lưu sửa ----------
addBtn.addEventListener('click', function () {
    const name = categoryInput.value.trim();

    if (name === '') {
        alert('Vui lòng nhập tên danh mục');
        return;
    }

    const categories = getCategories();

    if (editingId === null) {
        // --- Thêm mới ---
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            alert('Danh mục này đã tồn tại');
            return;
        }

        const newCategory = {
            id  : categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: name,
        };
        categories.push(newCategory);

    } else {
        const oldName = categories.find(c => c.id === editingId)?.name;  // lưu tên cũ
        const cat = categories.find(c => c.id === editingId);
        if (cat) cat.name = name;
        editingId = null;
        addBtn.textContent = 'Add Category';

        if (oldName && oldName !== name) {
            const articles = JSON.parse(localStorage.getItem('articles')) || [];
            articles.forEach(article => {
                if (article.entries === oldName) {
                    article.entries = name;
                }
            });
            localStorage.setItem('articles', JSON.stringify(articles));
        }
    }

    saveCategories(categories);
    categoryInput.value = '';
    renderCategories(categories);
});

// ---------- Xóa ----------
tbody.addEventListener('click', function (e) {
    if (!e.target.classList.contains('delete-btn')) return;

    const id = Number(e.target.dataset.id);
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    const updated = getCategories().filter(cat => cat.id !== id);
    saveCategories(updated);
    renderCategories(updated);
});

// ---------- Sửa → fill vào input ----------
tbody.addEventListener('click', function (e) {
    if (!e.target.classList.contains('edit-btn')) return;

    const id = Number(e.target.dataset.id);
    const cat = getCategories().find(c => c.id === id);
    if (!cat) return;

    editingId = id;
    categoryInput.value = cat.name;
    addBtn.textContent  = 'Save';
    categoryInput.focus();
});

// ---------- Tìm kiếm ----------
searchInput.addEventListener('input', function () {
    const keyword    = searchInput.value.trim().toLowerCase();
    const categories = getCategories();
    const filtered   = categories.filter(cat => cat.name.toLowerCase().includes(keyword));
    renderCategories(filtered);
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

// ---------- Khởi động ----------
renderCategories(getCategories());