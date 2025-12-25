import "./index.css";
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);
const result = await response.json();
const blogs = result.docs;
const blogContainer = document.getElementById("blog-list");

// Toggle theme

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
let savedTheme = localStorage.getItem("theme");

if (!savedTheme) {
    savedTheme = systemTheme;
    localStorage.setItem("theme", systemTheme);
}
document.documentElement.style.colorScheme = savedTheme || systemTheme;

document.getElementById("toggle-theme").addEventListener("click", () => {
    const current = document.documentElement.style.colorScheme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("theme", next);
});

// Render blog List
for (const article of blogs) {
    const item = document.createElement("li");
    const date = new Date(article.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    item.innerHTML = `
        <a class="blog-item" data-id="${article.slug}">
            <h3 class="blog-title" >${article.title}</h3>
            <p class="blog-date">${date}</p>
        </a>
    `;
    blogContainer.append(item);
}
blogContainer.addEventListener("click", (e) => {
    const blogItem = e.target.closest(".blog-item");
    if (!blogItem) return;
    goToPage(blogItem.dataset.id);
});

function goToPage(articleId) {
    const slug = articleId;
    window.location.href = `/blog-detail.html?slug=${slug}`;
}
