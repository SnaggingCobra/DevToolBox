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
    DiffCheckerTool: "diff-checker",
    ColorConverterTool: "color-converter",
    GradientGeneratorTool: "gradient-generator",
    BoxShadowTool: "box-shadow",
    FlexboxGeneratorTool: "flexbox-generator",
    Base64Tool: "base64",
    urlEncoderTool: "url-encoder",
    jwtDecoderTool: "jwt-decoder",
    HashGeneratorTool: "hash-generator",
    UUIDGeneratorTool: "uuid-generator",
    PasswordGeneratorTool: "password-generator",
    QRCodeGeneratorTool: "qr-code",
    BarcodeGeneratorTool: "barcode-generator",

};

let loadVersion = 0;

function setActiveTool(buttonId) {
    toolButtons.forEach((button) => {
        const isActive = button.id === buttonId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

if (themeButton) {
    const savedTheme = localStorage.getItem("devtoolbox-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    document.body.classList.toggle("light-mode", savedTheme === "light" || (!savedTheme && prefersLight));

    themeButton.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        localStorage.setItem("devtoolbox-theme", isLight ? "light" : "dark");
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

async function loadTool(toolName, buttonId) {
    if (!workspace) return;
    const currentLoad = ++loadVersion;
    setActiveTool(buttonId);
    workspace.setAttribute("aria-busy", "true");
    try {
        const toolPath = `tools/${toolName}/${toolName}`;
        const response = await fetch(`${toolPath}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load tool: ${toolName}`);
        }

        const html = await response.text();
        if (currentLoad !== loadVersion) return;

        const cssPath = `${toolPath}.css`;
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = cssPath;

        await new Promise((resolve, reject) => {
            stylesheet.onload = resolve;
            stylesheet.onerror = () => reject(new Error(`Failed to load styles for ${toolName}`));
            document.head.appendChild(stylesheet);
        });
        if (currentLoad !== loadVersion) {
            stylesheet.remove();
            return;
        }

        const oldStylesheet = document.getElementById("active-tool-style");
        if (oldStylesheet) oldStylesheet.remove();
        stylesheet.id = "active-tool-style";

        workspace.innerHTML = html;
        if (workspace.scrollTop !== undefined) workspace.scrollTop = 0;
        try { window.scrollTo(0,0); } catch (e) {}

        const oldScript = document.getElementById("active-tool-script");
        if (oldScript) oldScript.remove();

        const toolScript = document.createElement("script");
        toolScript.id = "active-tool-script";
        toolScript.type = "module";
        toolScript.src = `${toolPath}.js`;
        toolScript.onerror = () => {
            if (currentLoad !== loadVersion) return;
            workspace.innerHTML = `
                <p class="tool-load-error">
                    This tool could not be started.
                    Please try again.
                </p>`;
        };
        document.body.appendChild(toolScript);
    } catch (error) {
        if (currentLoad !== loadVersion) return;
        workspace.innerHTML = `
            <p class="tool-load-error">
                This tool could not be loaded.
                Please try again.
            </p>
        `;
        console.error("Tool loading error:", error);
    } finally {
        if (currentLoad === loadVersion) workspace.removeAttribute("aria-busy");
    }
}

Object.entries(tools).forEach(([buttonId, toolName]) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => loadTool(toolName, buttonId));
    }


});

const quickLinksButton = document.getElementById('quickLinksButton');

function renderWelcomeScreen() {
    loadVersion++;
    setActiveTool("");
    workspace.removeAttribute("aria-busy");
    workspace.innerHTML = `
    <div class="welcome-screen">
        <div class="welcome-icon">🧰</div>
        <h2>DevToolBox</h2>
        <p>Developer tools, all in one place.</p>
        <span>Select a tool from the sidebar to get started.</span>
        <button class="quick-links-button" id="quickLinksButton" type="button">Quick Links</button>
    </div>`;

    // re-wire the quick links button in the welcome screen
    const qbtn = document.getElementById('quickLinksButton');
    if (qbtn) qbtn.addEventListener('click', showQuickLinksWorkspace);
}

function showQuickLinksWorkspace() {
    loadVersion++;
    setActiveTool("");
    workspace.removeAttribute("aria-busy");
    workspace.innerHTML = `
        <div class="quick-links-workspace">
            <div class="tool-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div>
                    <h2>Quick Links</h2>
                    <p style="margin:0;color:var(--muted,#6e7681);">Search and open external tools (opens in new tab)</p>
                </div>
                <div>
                    <button id="backToWelcome" class="header-button" type="button" title="Back" aria-label="Back to welcome screen">◀</button>
                </div>
            </div>
            <div class="quick-links-search">
                <input id="quickLinksSearch" type="search" placeholder="Search links..." aria-label="Search quick links" />
            </div>
            <div class="quick-links-columns">
                <div class="quick-links-column">
                    <h3>Free</h3>
                    <ul class="quick-links-list">
                        <li class="quick-link-card"><a href="https://gamma.app" target="_blank" rel="noopener">Gamma — Presentations</a></li>
                    </ul>
                </div>
                <div class="quick-links-column">
                    <h3>Paid</h3>
                    <ul class="quick-links-list">
                        <li class="quick-link-card"><a href="https://pitch.com" target="_blank" rel="noopener">Pitch — Presentation alternative</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;


    const back = document.getElementById('backToWelcome');
    if (back) back.addEventListener('click', renderWelcomeScreen);

    const search = document.getElementById('quickLinksSearch');
    if (search) {
        search.addEventListener('input', () => {
            const q = search.value.trim().toLowerCase();
            document.querySelectorAll('.quick-link-card').forEach(li => {
                const text = li.textContent.trim().toLowerCase();
                li.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }
}

if (quickLinksButton) {
    quickLinksButton.addEventListener('click', showQuickLinksWorkspace);
}
