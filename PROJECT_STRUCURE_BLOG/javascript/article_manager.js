document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.replace("../pages/login.html");
    }
});

import { getArticles, saveArticles } from "./database.js";

const articleList = document.getElementById('article-list');
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

// ---------- RENDER BẢNG ----------
function renderArticles() {
    const articles = getArticles();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = articles.slice(start, start + ITEMS_PER_PAGE);

    articleList.innerHTML = '';
    pageItems.forEach(article => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${article.image}" alt=""></td>
            <td class="one-line">${article.title}</td>
            <td class="one-line">${article.entries}</td>
            <td class="one-line">${article.content}</td>
            <td><span class="status ${article.status.toLowerCase()}">${article.status}</span></td>
            <td>
                <select class="status-select" data-id="${article.id}">
                    <option value="Public" ${article.status === 'Public' ? 'selected' : ''}>Public</option>
                    <option value="Private" ${article.status === 'Private' ? 'selected' : ''}>Private</option>
                </select>
            </td>
            <td>
                <button class="edit-btn" data-id="${article.id}">Sửa</button>
                <button class="delete-btn" data-id="${article.id}">Xóa</button>
            </td>
        `;
        articleList.appendChild(row);
    });
}

// ---------- RENDER PHÂN TRANG ----------
function renderPagination() {
    const totalPages = Math.ceil(getArticles().length / ITEMS_PER_PAGE);
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-next:first-child');
    const nextBtn = document.querySelector('.prev-next:last-child');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderAll();
        });
        pageNumbers.appendChild(btn);
    }
}

function renderAll() {
    renderArticles();
    renderPagination();
}

// ---------- XÓA ----------
articleList.addEventListener('click', function (e) {
    if (!e.target.classList.contains('delete-btn')) return;

    const id = Number(e.target.dataset.id);
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    const articles = getArticles().filter(a => a.id !== id);
    saveArticles(articles);

    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    renderAll();
});

// ---------- ĐỔI STATUS ----------
articleList.addEventListener('change', function (e) {
    if (!e.target.classList.contains('status-select')) return;

    const id = Number(e.target.dataset.id);
    const articles = getArticles();
    const article = articles.find(a => a.id === id);
    if (!article) return;

    article.status = e.target.value;
    saveArticles(articles);
    renderAll();
});

// ---------- SỬA ----------
articleList.addEventListener('click', function (e) {
    if (!e.target.classList.contains('edit-btn')) return;

    const id = Number(e.target.dataset.id);
    localStorage.setItem('editArticleId', id);
    window.location.href = '../pages/edit_article.html';
});

// ---------- NÚT PREVIOUS / NEXT ----------
document.querySelector('.prev-next:first-child').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderAll(); }
});
document.querySelector('.prev-next:last-child').addEventListener('click', () => {
    const totalPages = Math.ceil(getArticles().length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderAll(); }
});

renderAll();

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