const blogTemplate = document.getElementById("blog-template").content;
const blogContainer = $("#blog-container");

function createBlogElement(blog) {
    const blogElement = $(blogTemplate.cloneNode(true));
    blogElement.find("a").attr("href", `/blogs/read?id=${blog.id}`);
    blogElement.find(".blog-title").text(blog.title);
    blogElement.find(".blog-author").text(`By: ${blog.author}`);
    blogElement.find(".blog-date").text(
        new Date(blog.date).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
    );
    blogContainer.append(blogElement);
}

axios.get(`${window.CONFIG.API_BASE}/all-blogs`).then((res) => {
    for (const blog of res.data) {
        createBlogElement(blog)
    }
})