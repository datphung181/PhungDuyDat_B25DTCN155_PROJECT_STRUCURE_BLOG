import { getArticles } from './database.js';

// ════════════════════════════════════════════════════════════════
//  AUTH (code cũ giữ nguyên)
// ════════════════════════════════════════════════════════════════
const authButtons = document.getElementById("auth-buttons");
const userLogged  = document.getElementById("user-logged");

function checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        authButtons.style.display = "none";
        userLogged.style.display  = "block";

        document.querySelector(".user-info strong").textContent =
            currentUser.firstName + " " + currentUser.lastName;
        document.querySelector(".user-info p").textContent = currentUser.email;
    } else {
        authButtons.style.display = "block";
        userLogged.style.display  = "none";
    }
}

checkLogin();

function handleLogout() {
    const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (confirmLogout) {
        localStorage.removeItem("currentUser");
        location.reload();
    }
}

window.handleLogout = handleLogout;


// ════════════════════════════════════════════════════════════════
//  HELPER
// ════════════════════════════════════════════════════════════════
function getSortedArticles() {
    return getArticles().sort((a, b) => new Date(b.date) - new Date(a.date));
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

function getTagClass(category) {
    const map = {
        'Daily Journal'       : 'post__tag-daily',
        'Work & Career'       : 'post__tag-work-career',
        'Personal Thoughts'   : 'post__tag-work-personal',
        'Emotions & Feelings' : 'post__tag-emotions',
    };
    return map[category] || 'post__tag-daily';
}


// ════════════════════════════════════════════════════════════════
//  FEATURED SECTION — 3 bài mới nhất ở hero
// ════════════════════════════════════════════════════════════════
function renderFeaturedPosts() {
    const articles = getSortedArticles().slice(0, 3);
    if (!articles.length) return;

    [1, 2, 3].forEach((num, i) => {
        const post = document.getElementById(`post-${num}`);
        const a    = articles[i];
        if (!post || !a) return;

        const imgDiv = post.querySelector('.post__image');
        if (imgDiv && a.image) {
            imgDiv.style.backgroundImage    = `url('${a.image}')`;
            imgDiv.style.backgroundSize     = 'cover';
            imgDiv.style.backgroundPosition = 'center';
        }

        const maxLen = num === 1 ? 150 : 100;
        post.querySelector('.post__date').textContent    = `Date: ${a.date || 'N/A'}`;
        post.querySelector('.post__title').textContent   = a.title;
        post.querySelector('.post__excerpt').textContent =
            a.content ? a.content.substring(0, maxLen) + (a.content.length > maxLen ? '…' : '') : '';

        const tag = post.querySelector('[class^="post__tag"]');
        if (tag) {
            tag.textContent = a.entries || 'General';
            tag.className   = getTagClass(a.entries);
        }
    });
}


// ════════════════════════════════════════════════════════════════
//  POST GRID — hiển thị TẤT CẢ bài viết, filter theo category
// ════════════════════════════════════════════════════════════════
const PAGE_SIZE = 6;
let currentPage      = 1;
let filteredArticles = [];
let activeCategory   = 'all'; 

function createCard(article) {
    const imgSrc  = article.image || `https://picsum.photos/300/200?random=${article.id}`;
    const preview = article.content
        ? article.content.substring(0, 120) + (article.content.length > 120 ? '…' : '')
        : '';

    const card = document.createElement('div');
    card.className = 'post-card';

    card.addEventListener('click', () => {
    localStorage.setItem("currentPostId", article.id);
    window.location.href = "./pages/details_post.html";
    });
    
    card.innerHTML = `
        <img src="${imgSrc}" alt="${article.title}" loading="lazy" />
        <div class="content">
            <p class="date">Date: ${article.date || 'N/A'}</p>
            <div class="title-row">
                <h2>${article.title}</h2>
                <svg class="arrow" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"></svg>
            </div>
            <p>${preview}</p>
            <span class="badge ${getBadgeClass(article.entries)}">${article.entries || 'General'}</span>
        </div>
    `;
    return card;
}

function renderGrid(page) {
    const grid = document.querySelector('.post-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const start = (page - 1) * PAGE_SIZE;
    const slice = filteredArticles.slice(start, start + PAGE_SIZE);

    if (slice.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:#888;">
                <p>Không có bài viết nào.</p>
            </div>`;
        updatePagination(page);
        return;
    }

    slice.forEach(article => grid.appendChild(createCard(article)));
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
            dots.className   = 'dots';
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
    renderGrid(page);
    window.scrollTo({
        top: document.querySelector('.container').offsetTop - 20,
        behavior: 'smooth'
    });
}

// ── Áp dụng filter ──────────────────────────────────────────────
function applyFilter(allArticles) {
    filteredArticles = activeCategory === 'all'
        ? [...allArticles]                                          // hiển thị tất cả
        : allArticles.filter(a => a.entries === activeCategory);   // lọc theo category
    currentPage = 1;
    renderGrid(1);
}

// ── Category filter buttons ──────────────────────────────────────
function initCategoryFilter() {
    const buttons     = document.querySelectorAll('.category-filter button');
    const allArticles = getSortedArticles();

    // Bỏ active khỏi tất cả button khi load (vì mặc định hiển thị all)
    buttons.forEach(b => b.classList.remove('active'));

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isAlreadyActive = btn.classList.contains('active');

            // Click lại button đang active → reset về "all"
            if (isAlreadyActive) {
                btn.classList.remove('active');
                activeCategory = 'all';
            } else {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.textContent.trim();
            }

            applyFilter(allArticles);
        });
    });

    // Load ban đầu: hiển thị tất cả
    applyFilter(allArticles);
}

function initTopNav() {
    const allBtn = document.getElementById('allPost');

    if (!allBtn) return;

    allBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const allArticles = getSortedArticles();

        // reset filter
        activeCategory = 'all';

        // bỏ active ở category buttons
        document.querySelectorAll('.category-filter button')
            .forEach(b => b.classList.remove('active'));

        // (optional) highlight lại All blog posts
        document.querySelectorAll('.top-nav a')
            .forEach(a => a.classList.remove('active'));
        allBtn.classList.add('active');

        // render lại tất cả bài
        applyFilter(allArticles);
    });
}

// ── Search ───────────────────────────────────────────────────────
function initSearch() {
    const input       = document.querySelector('.search-box input');
    const allArticles = getSortedArticles();
    if (!input) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (q) {
            filteredArticles = allArticles.filter(a =>
                a.title.toLowerCase().includes(q) ||
                (a.content && a.content.toLowerCase().includes(q))
            );
        } else {
            // Xoá search → quay lại trạng thái filter hiện tại
            applyFilter(allArticles);
            return;
        }
        currentPage = 1;
        renderGrid(1);
    });
}

// ── Prev / Next ──────────────────────────────────────────────────
function initPagination() {
    document.querySelector('.prev-next:first-of-type')
        ?.addEventListener('click', () => {
            if (currentPage > 1) goToPage(currentPage - 1);
        });

    document.querySelector('.prev-next:last-of-type')
        ?.addEventListener('click', () => {
            const total = Math.ceil(filteredArticles.length / PAGE_SIZE);
            if (currentPage < total) goToPage(currentPage + 1);
        });
}

function renderCategories() {
    const container = document.querySelector('.category-filter');
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    if (!container) return;

    container.innerHTML = '';

    // Render từ localStorage
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.name;
        container.appendChild(btn);
    });

    // Gắn lại event
    initCategoryFilter();
}




// ════════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════════
renderFeaturedPosts();
renderCategories();
initSearch();
initPagination();
initTopNav()