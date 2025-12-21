import "./index.css";
import data from "/data.json";
import { marked } from "marked";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const blogSlug = urlParams.get("slug");
const blogContent = document.getElementById("blog-content");

const targetBlog = data.find((item) => item.slug === blogSlug);

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

blogContent.innerHTML = marked.parse(targetBlog.content);
