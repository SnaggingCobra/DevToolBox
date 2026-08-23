document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("toolSearch");
    const toolButtons = document.querySelectorAll(".tool-category button");
    const themeButton = document.getElementById("themeButton");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.toLowerCase();

            toolButtons.forEach(function (button) {
                const toolName = button.textContent.toLowerCase();
                button.style.display = toolName.includes(searchText) ? "block" : "none";
            });
        });
    }
});


const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

});

const jsonFormatterTool =
    document.getElementById("jsonFormatterTool");

const workspace =
    document.getElementById("workspace");


jsonFormatterTool.addEventListener("click", function () {

    workspace.innerHTML = `
        <h2>JSON Formatter</h2>
    `;

});