import "./index.css";

const blogContent = document.getElementById("blog-content");

const slug = new URLSearchParams(window.location.search).get("slug");
const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/posts?where[slug][equals]=${slug}`,
);
const result = await response.json();
const targetBlog = result.docs[0];

console.log(targetBlog);

if (!targetBlog) {
    window.location.href = "/index.html";
}

const date = new Date(targetBlog.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
});

document.getElementById("blog-title").textContent = targetBlog.title;
document.getElementById("blog-date").textContent = date;
document.getElementById("blog-description").textContent =
    targetBlog.description;

blogContent.innerHTML = targetBlog.contentHTML;
