/* Se carga en el <head>, antes del CSS: aplica el tema guardado o el del sistema. */
(function () {
    var theme = null;
    try { theme = localStorage.getItem("theme"); } catch (e) {}
    if (theme !== "light" && theme !== "dark") {
        theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#121211" : "#E9E8E3");
})();
