(() => {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) i(e);
    new MutationObserver((e) => {
        for (const o of e)
            if (o.type === "childList")
                for (const s of o.addedNodes)
                    s.tagName === "LINK" && s.rel === "modulepreload" && i(s);
    }).observe(document, { childList: !0, subtree: !0 });
    function n(e) {
        const o = {};
        return (
            e.integrity && (o.integrity = e.integrity),
            e.referrerPolicy && (o.referrerPolicy = e.referrerPolicy),
            e.crossOrigin === "use-credentials"
                ? (o.credentials = "include")
                : e.crossOrigin === "anonymous"
                  ? (o.credentials = "omit")
                  : (o.credentials = "same-origin"),
            o
        );
    }
    function i(e) {
        if (e.ep) return;
        e.ep = !0;
        const o = n(e);
        fetch(e.href, o);
    }
})();
const l = await fetch("undefined/api/posts"),
    a = await l.json(),
    d = a.docs,
    c = document.getElementById("blog-list");
d.forEach((r) => {
    const t = document.createElement("li"),
        n = new Date(r.publishedAt).toLocaleDateString(void 0, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    (t.innerHTML = `
        <a class="blog-item" data-id="${r.slug}">
            <h3 class="blog-title" >${r.title}</h3>
            <p class="blog-date">${n}</p>
        </a>
    `),
        c.append(t);
});
c.addEventListener("click", (r) => {
    const t = r.target.closest(".blog-item");
    t && u(t.dataset.id);
});
function u(r) {
    const t = r;
    window.location.href = `/blog-detail.html?slug=${t}`;
}
