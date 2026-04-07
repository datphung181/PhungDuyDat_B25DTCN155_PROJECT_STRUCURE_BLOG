import { getArticles } from './database.js';

const PAGE_SIZE = 6;
let currentPage      = 1;
let filteredArticles = [];

function getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
}

// ── Lọc bài theo email của user đang đăng nhập ──────────────────
function getMyArticles() {
    const user = getCurrentUser();
    const all  = getArticles();

    if (!user) return [];
    if (user.role === 'admin') return all;

    // So sánh email — chính xác 100%, không lo lỗi kiểu dữ liệu
    return all.filter(a => a.authorEmail === user.email);
}

function getBadgeClass(category) {
    const map = {
        'Daily Journal'       : 'daily-journal',
        'Work & Career'       : 'work-career',
        'Personal Thoughts'   : 'personal-thoughts',
        'Emotions & Feelings' : 'emotions-feelings',
    };
    return map[category] || 'daily-journal';
}

function createCard(article, animIndex) {
    const badgeClass = getBadgeClass(article.entries);
    const imgSrc     = article.image || `https://picsum.photos/300/200?random=${article.id}`;
    const detailUrl  = `../pages/details_post.html?id=${article.id}`;
    const editUrl    = `../pages/edit_article.html?id=${article.id}`;
    const preview    = article.content
        ? article.content.substring(0, 120) + (article.content.length > 120 ? '…' : '')
        : '';

    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.animationDelay = `${animIndex * 80}ms`;

    card.innerHTML = `
        <img src="${imgSrc}" alt="${article.title}" loading="lazy" />
        <div class="content">
            <p class="date">Date: ${article.date || 'N/A'}</p>
            <div class="title-row">
                <h2><a href="${detailUrl}">${article.title}</a></h2>
                <svg class="arrow" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"></svg>
            </div>
            <p>${preview}</p>
            <div class="card-footer">
                <span class="badge ${badgeClass}">${article.entries || 'General'}</span>
                <button class="btn-edit"
                        onclick="location.href='${editUrl}'">Edit your post</button>
            </div>
        </div>
    `;
    return card;
}

function renderPage(page) {
    const grid = document.querySelector('.post-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const start = (page - 1) * PAGE_SIZE;
    const slice = filteredArticles.slice(start, start + PAGE_SIZE);

    if (slice.length === 0) {
        grid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #888;
            ">
                <p style="font-size: 1.2rem; margin-bottom: 12px;">📭 Bạn chưa có bài viết nào.</p>
                <a href="../pages/add_new_article.html"
                   style="color: #4a90e2; text-decoration: none; font-weight: 600;">
                    ✏️ Viết bài đầu tiên →
                </a>
            </div>`;
        updatePagination(page);
        return;
    }

    slice.forEach((article, i) => {
        grid.appendChild(createCard(article, i));
    });

    updatePagination(page);
}

function updatePagination(page) {
    const total     = Math.ceil(filteredArticles.length / PAGE_SIZE);
    const container = document.querySelector('.page-numbers');
    const prevBtn   = document.querySelector('.prev-next:first-of-type');
    const nextBtn   = document.querySelector('.prev-next:last-of-type');

    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= total || total === 0;

    if (!container) return;
    container.innerHTML = '';

    buildPageRange(page, total).forEach(p => {
        if (p === '…') {
            const dots = document.createElement('span');
            dots.className = 'dots';
            dots.textContent = '...';
            container.appendChild(dots);
        } else {
            const btn = document.createElement('button');
            btn.textContent = p;
            if (p === page) btn.classList.add('active');
            btn.addEventListener('click', () => goToPage(p));
            container.appendChild(btn);
        }
    });
}

function buildPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4)         return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
    return [1, '…', current - 1, current, current + 1, '…', total];
}

function goToPage(page) {
    currentPage = page;
    renderPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initSearch(sourceArticles) {
    const input = document.querySelector('.search-box input');
    if (!input) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        filteredArticles = q
            ? sourceArticles.filter(a =>
                a.title.toLowerCase().includes(q) ||
                (a.content && a.content.toLowerCase().includes(q))
              )
            : [...sourceArticles];
        currentPage = 1;
        renderPage(1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const myArticles = getMyArticles().sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    filteredArticles = [...myArticles];
    renderPage(1);
    initSearch(myArticles);

    document.querySelector('.prev-next:first-of-type')
        ?.addEventListener('click', () => {
            if (currentPage > 1) goToPage(currentPage - 1);
        });

    document.querySelector('.prev-next:last-of-type')
        ?.addEventListener('click', () => {
            const total = Math.ceil(filteredArticles.length / PAGE_SIZE);
            if (currentPage < total) goToPage(currentPage + 1);
        });
});