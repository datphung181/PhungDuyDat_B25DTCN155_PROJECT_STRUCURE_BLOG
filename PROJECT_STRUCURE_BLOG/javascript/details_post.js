import { getArticles } from './database.js';

function renderDetail() {
    const id = Number(localStorage.getItem("currentPostId"));
    const articles = getArticles();

    const article = articles.find(a => a.id === id);

    if (!article) return;

    document.getElementById("post-title").textContent = article.title;
    document.getElementById("post-content").textContent = article.content;
}

renderDetail();