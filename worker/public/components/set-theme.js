if (localStorage.getItem("theme") === "dark") {
    document.querySelector("html").setAttribute("data-theme", "dark");
} else {
    document.querySelector("html").setAttribute("data-theme", "light");
}