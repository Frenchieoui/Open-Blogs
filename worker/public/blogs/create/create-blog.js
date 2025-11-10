const quill = new Quill('#editor', {
    theme: 'snow'
});

$('#publish').on('click', async () => {
    const title = $('#title').val();
    if (!title || title.trim() === "") {
        alert("Title cannot be empty");
        return;
    }
    const author = $('#author').val();
    if (!author || author.trim() === "") {
        alert("Author cannot be empty");
        return;
    }
    const content = quill.getSemanticHTML(0)

    const response = await axios.post(`${CONFIG.API_BASE}/create-blog`, { title, author, content })

    window.location.href = `/blogs/read?id=${response.data.id}`;
})