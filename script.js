document.addEventListener("DOMContentLoaded", () => {


    const themeButton = document.getElementById("themeButton");

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });


    const searchInput = document.getElementById("toolSearch");

    const toolButtons = document.querySelectorAll(
        ".tool-category button"
    );

    searchInput.addEventListener("input", () => {

        const searchText = searchInput.value.toLowerCase();

        toolButtons.forEach((button) => {

            const toolName = button.textContent.toLowerCase();

            if (toolName.includes(searchText)) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }

        });

    });



    const workspace = document.getElementById("Workspace");

// JSON FORMATTER

document.getElementById("jsonFormatterTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/json-formatter/json-formatter.html"
        );

        const html = await response.text();

        workspace.innerHTML = html;

        // Load the tool CSS
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "tools/json-formatter/json-formatter.css";

        document.head.appendChild(css);

        // Load the tool JavaScript
        const script = document.createElement("script");
        script.src = "tools/json-formatter/json-formatter.js";
        document.body.appendChild(script);

    });

// JSON VALIDATOR

document.getElementById("ValidatorTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/json-validator/json-validator.html"
        );

        const html = await response.text();
        workspace.innerHTML = html;

        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "tools/json-validator/json-validator.css";

        document.head.appendChild(css);

        const script = document.createElement("script");
        script.src =
            "tools/json-validator/json-validator.js";

        document.body.appendChild(script);

    });




document.getElementById("RegexTesterTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/regex-tester/regex-tester.html"
        );
        const html = await response.text();

        workspace.innerHTML = html;
        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "tools/regex-tester/regex-tester.css";
        document.head.appendChild(css);
        const script = document.createElement("script");
        script.src =
            "tools/regex-tester/regex-tester.js";
        document.body.appendChild(script);
    });

document.getElementById("DiffCheakerTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/diff-checker/diff-checker.html"
        );
        const html = await response.text();

        workspace.innerHTML = html;

        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "tools/diff-checker/diff-checker.css";
        document.head.appendChild(css);

        const script = document.createElement("script");

        script.src =
            "tools/diff-checker/diff-checker.js";
        document.body.appendChild(script);

    });

document.getElementById("ColorConverterTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/color-converter/color-converter.html"
        );
        const html = await response.text();
        workspace.innerHTML = html;

        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "tools/color-converter/color-converter.css";
        document.head.appendChild(css);

        const script = document.createElement("script");
        script.src =
            "tools/color-converter/color-converter.js";
        document.body.appendChild(script);
    });


document.getElementById("GradientGeneratorTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/gradient-generator/gradient-generator.html"
        );
        const html = await response.text();
        workspace.innerHTML = html;

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href =
            "tools/gradient-generator/gradient-generator.css";
        document.head.appendChild(css);


        const script = document.createElement("script");
        script.src =
            "tools/gradient-generator/gradient-generator.js";
        document.body.appendChild(script);

    });

    document.getElementById("BoxShadowTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/box-shadow/box-shadow.html"
        );

        const html = await response.text();
        workspace.innerHTML = html;

        const css = document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "tools/box-shadow/box-shadow.css";

        document.head.appendChild(css);

        const script = document.createElement("script");

        script.src =
            "tools/box-shadow/box-shadow.js";
        document.body.appendChild(script);

            });

    
document.getElementById("FlexboxGeneratorTool")
    .addEventListener("click", async () => {

        const response = await fetch(
            "tools/flexbox-generator/flexbox-generator.html"
        );
        const html = await response.text();

        workspace.innerHTML = html;


        const css = document.createElement("link");
        css.rel = "stylesheet";

        css.href =
            "tools/flexbox-generator/flexbox-generator.css";

        document.head.appendChild(css);

        const script = document.createElement("script");

        script.src =
            "tools/flexbox-generator/flexbox-generator.js";
        document.body.appendChild(script);

    });
})
