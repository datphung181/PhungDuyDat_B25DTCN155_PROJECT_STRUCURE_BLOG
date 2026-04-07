import { getArticles, saveArticles, entries } from './database.js';

const title       = document.getElementById('title');
const category    = document.getElementById('category');
const mood        = document.getElementById('mood');
const content     = document.getElementById('content');
const imageInput  = document.getElementById('imageInput');
const addBtn      = document.getElementById('addBtn');

const titleError    = document.getElementById('titleError');
const contentError  = document.getElementById('contentError');
const moodError     = document.getElementById('moodError');
const categoryError = document.getElementById('categoryError');

function getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
}

const role = getCurrentUser()?.role || 'user';

const validMoods = [
    "😊 Happy", "😢 Sad", "🤩 Excited", "😰 Anxious", "😌 Calm",
    "😠 Angry", "😲 Surprised", "😑 Bored", "😴 Tired", "🥹 Grateful",
    "🌟 Hopeful", "😕 Confused", "🥺 Lonely", "😤 Proud", "🥰 In Love"
];

addBtn.addEventListener('click', function () {
    addArticle();
});

function validForm() {
    let isValid = true;

    if (title.value.trim() === '') {
        titleError.textContent = 'Vui lòng nhập tiêu đề';
        title.classList.add('input-error');
        isValid = false;
    }

    if (content.value.trim() === '') {
        contentError.textContent = 'Vui lòng nhập nội dung';
        content.classList.add('input-error');
        isValid = false;
    }

    if (mood.value.trim() === '') {
        moodError.textContent = 'Vui lòng chọn tâm trạng';
        mood.classList.add('input-error');
        isValid = false;
    } else if (!validMoods.includes(mood.value.trim())) {
        moodError.textContent = 'Vui lòng chọn tâm trạng từ danh sách có sẵn';
        mood.classList.add('input-error');
        isValid = false;
    }

    if (category.value.trim() === 'select a category') {
        categoryError.textContent = 'Vui lòng chọn thể loại';
        category.classList.add('input-error');
        isValid = false;
    }

    return isValid;
}

async function addArticle() {
    if (!validForm()) return;

    let image = null;
    const file = imageInput.files[0];
    if (file) {
        image = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    } else {
        const randomId = Math.floor(Math.random() * 100) + 1;
        image = `https://picsum.photos/300/200?random=${randomId}`;
    }

    const articles    = getArticles();
    const currentUser = getCurrentUser();

    const newArticle = {
        id          : articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        title       : title.value.trim(),
        entries     : category.value.trim(),
        mood        : mood.value.trim(),
        content     : content.value.trim(),
        status      : document.querySelector('input[name="status"]:checked').value,
        image       : image,
        date        : new Date().toISOString().split('T')[0],
        authorEmail : currentUser ? currentUser.email : null,  // ← lưu email thay vì id
    };

    articles.unshift(newArticle);
    saveArticles(articles);

    if (role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = '../pages/all_post.html';
    }
}

title.addEventListener('input', function () {
    titleError.textContent = '';
    title.classList.remove('input-error');
});

content.addEventListener('input', function () {
    contentError.textContent = '';
    content.classList.remove('input-error');
});

mood.addEventListener('input', function () {
    moodError.textContent = '';
    mood.classList.remove('input-error');
});

category.addEventListener('input', function () {
    categoryError.textContent = '';
    category.classList.remove('input-error');
});

function loadCategories() {
    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const newFromDB = entries.filter(dbCategory => {
        return !savedCategories.some(saved => saved.id === dbCategory.id);
    });
    const allCategories = [...newFromDB, ...savedCategories];

    category.innerHTML = '<option value="select a category">Select a category</option>';

    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        category.appendChild(option);
    });
}

loadCategories();