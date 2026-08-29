document.addEventListener("DOMContentLoaded", () => {
    const workspace = document.getElementById("Workspace");
    const themeButton = document.getElementById("themeButton");
    const searchInput = document.getElementById("toolSearch");
    const toolButtons = document.querySelectorAll(".tool-category button");

    const tools = {
        jsonFormatterTool: "json-formatter",
        ValidatorTool: "json-validator",
        RegexTesterTool: "regex-tester",
        DiffCheakerTool: "diff-checker",
        ColorConverterTool: "color-converter",
        GradientGeneratorTool: "gradient-generator",
        BoxShadowTool: "box-shadow",
        FlexboxGeneratorTool: "flexbox-generator"
    };

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        toolButtons.forEach((button) => {
            button.hidden = !button.textContent.toLowerCase().includes(searchText);
        });
    });

    async function loadTool(toolName) {
        workspace.setAttribute("aria-busy", "true");

        try {
            const response = await fetch(`tools/${toolName}/${toolName}.html`);
            if (!response.ok) throw new Error(`Could not load ${toolName}`);

            workspace.innerHTML = await response.text();

            let stylesheet = document.getElementById("active-tool-styles");
            if (!stylesheet) {
                stylesheet = document.createElement("link");
                stylesheet.id = "active-tool-styles";
                stylesheet.rel = "stylesheet";
                document.head.appendChild(stylesheet);
            }
            stylesheet.href = `tools/${toolName}/${toolName}.css`;

            const oldScript = document.getElementById("active-tool-script");
            if (oldScript) oldScript.remove();

            const toolScript = document.createElement("script");
            toolScript.id = "active-tool-script";
            toolScript.type = "module";
            toolScript.src = `tools/${toolName}/${toolName}.js?reload=${Date.now()}`;
            toolScript.onerror = () => {
                workspace.innerHTML = "<p class=\"tool-load-error\">This tool could not be started. Please try again.</p>";
            };
            document.body.appendChild(toolScript);
        } catch (error) {
            workspace.innerHTML = "<p class=\"tool-load-error\">This tool could not be loaded. Please try again.</p>";
            console.error(error);
        } finally {
            workspace.removeAttribute("aria-busy");
        }
    }

    Object.entries(tools).forEach(([buttonId, toolName]) => {
        document.getElementById(buttonId).addEventListener("click", () => loadTool(toolName));
    });
});
