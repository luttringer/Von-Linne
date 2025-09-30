
(function () {
    const map =
    {
        "/": "Home",
        "/index.html": "Home",
        "/cursos": "Cursos",
        "/cursos.html": "Cursos",
        "/investigacion": "Investigación",
        "/investigacion.html": "Investigación"
    };

    const byPath = map[location.pathname];
    const byData = document.body?.dataset?.page;
    const byTitle = document.title?.split("—")[0]?.trim();
    const label = byPath || byData || byTitle || "Sección";

    const el = document.getElementById("page-label");
    if (el) el.textContent = label;
})();
