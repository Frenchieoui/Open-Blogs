const id = parseInt(new URLSearchParams(document.location.search).get("id"))

axios.get(`${window.CONFIG.API_BASE}/blog?id=${id}`).then((res) => {
    $("#title").text(res.data.title)
    $("#author").text(res.data.author)


    const iframe = $("#content > iframe")[0];
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (iframeDoc.body) {
        iframeDoc.body.innerHTML = res.data.content
        resizeIframe(iframe, iframeDoc);
        const currentTheme = document.documentElement.getAttribute("data-theme");
        iframeDoc.documentElement.setAttribute("data-theme", currentTheme)
        iframeDoc.body.style.opacity = 1
    } else {
        iframe.onload = () => {
            iframeDoc.body.innerHTML = res.data.content;
            resizeIframe(iframe, iframeDoc);
            const currentTheme = document.documentElement.getAttribute("data-theme");
            iframeDoc.documentElement.setAttribute("data-theme", currentTheme)
            iframeDoc.body.style.opacity = 1
        }
    }

    $("#date").text(
        new Date(res.data.date).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
    )
})

function resizeIframe(iframe, iframeDoc) {
    const body = iframeDoc.body;
    const html = iframeDoc.documentElement;
    const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );
    iframe.style.height = height + "px";
}