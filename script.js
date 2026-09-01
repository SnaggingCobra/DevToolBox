const workspace = document.getElementById('Workspace');
const themeButton = document.getElementById('themeButton');
const searchInput = document.getElementById('toolSearch');
const searchEmpty = document.getElementById('searchEmpty');

const toolButtons = document.querySelectorAll(".tool-category button");
const toolCategories = document.querySelectorAll(".tool-category");


const tools = {
    jsonFormatterTool: "json-formatter",
    ValidatorTool: "json-validator",
    RegexTesterTool: "regex-tester",
    DiffCheakerTool: "diff-checker",
    ColorConverterTool: "color-converter",
    GradientGeneratorTool: "gradient-generator",
    BoxShadowTool: "box-shadow",
    FlexboxGeneratorTool: "flexbox-generator",
    Base64Tool: "base64",
    urlEncoderTool: "url-encoder",
    jwtDecoderTool: "jwt-decoder"
};

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.trim().toLowerCase();
        let matches = 0;

        toolButtons.forEach(button => {
            const toolName = button.textContent.trim().toLowerCase();
            const isMatch = toolName.includes(searchText);
            button.classList.toggle("search-hidden", !isMatch);
            if (isMatch) matches++;
        });

        toolCategories.forEach((category) => {
            const hasVisibleTool = category.querySelector("button:not(.search-hidden)");
            category.classList.toggle("search-hidden", !hasVisibleTool);
        });

        searchEmpty.hidden = matches !== 0 || searchText === "";
    });
}

async function loadTool(toolName) {
    if (!workspace) return;
    workspace.setAttribute("aria-busy", "true");
    try {
        const response = await fetch(`tools/${toolName}/${toolName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load tool: ${toolName}`);
        }

        const html = await response.text();

        let stylesheet = document.getElementById("active-tool-style");
        if (!stylesheet) {
            stylesheet = document.createElement("link");
            stylesheet.id = "active-tool-style";
            stylesheet.rel = "stylesheet";
            document.head.appendChild(stylesheet);
        }

        const cssPath = `tools/${toolName}/${toolName}.css`;
        await new Promise((resolve) => {
            stylesheet.onload = resolve;
            stylesheet.onerror = resolve;
            stylesheet.href = cssPath;
        });

        workspace.innerHTML = html;

        const oldScript = document.getElementById("active-tool-script");
        if (oldScript) oldScript.remove();

        const toolScript = document.createElement("script");
        toolScript.id = "active-tool-script";
        toolScript.type = "module";
        toolScript.src = `tools/${toolName}/${toolName}.js`;
        toolScript.onerror = () => {
            workspace.innerHTML = `
                <p class="tool-load-error">
                    This tool could not be started.
                    Please try again.
                </p>`;
        };
        document.body.appendChild(toolScript);
    } catch (error) {
        workspace.innerHTML = `
            <p class="tool-load-error">
                This tool could not be loaded.
                Please try again.
            </p>
        `;
        console.error("Tool loading error:", error);
    } finally {
        workspace.removeAttribute("aria-busy");
    }
}

Object.entries(tools).forEach(([buttonId, toolName]) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener("click", () => loadTool(toolName));
    }
});
