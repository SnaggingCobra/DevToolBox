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
    HTTPRequestBuilderTool: "http-request-builder",
    ColorConverterTool: "color-converter",
    GradientGeneratorTool: "gradient-generator",
    BoxShadowTool: "box-shadow",
    FlexboxGeneratorTool: "flexbox-generator",
    CSSUnitConverterTool: "css-unit-converter",
    Base64Tool: "base64",
    urlEncoderTool: "url-encoder",
    jwtDecoderTool: "jwt-decoder",
    HashGeneratorTool: "hash-generator",
    UUIDGeneratorTool: "uuid-generator",
    PasswordGeneratorTool: "password-generator",
    QRCodeGeneratorTool: "qr-code",
    BarcodeGeneratorTool: "barcode-generator",

};

Object.values(tools).forEach((toolName) => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "prefetch";
    stylesheet.as = "style";
    stylesheet.href = `tools/${toolName}/${toolName}.css`;
    document.head.appendChild(stylesheet);
});

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

        const cssPath = `${toolPath}.css`;
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = cssPath;

        const stylesheetReady = new Promise((resolve, reject) => {
            stylesheet.onload = resolve;
            stylesheet.onerror = () => reject(new Error(`Failed to load styles for ${toolName}`));
            document.head.appendChild(stylesheet);
        });

        const [html] = await Promise.all([
            response.text(),
            stylesheetReady
        ]);

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

const quickLinkCatalog = [
    ["AI Assistant", ["ChatGPT", "https://chatgpt.com"], ["Gemini", "https://gemini.google.com"], ["Claude Pro", "https://claude.ai"], ["ChatGPT Plus", "https://chatgpt.com"]],
    ["AI Search / Research", ["Perplexity", "https://www.perplexity.ai"], ["Google AI Mode", "https://www.google.com"], ["Perplexity Pro", "https://www.perplexity.ai"], ["ChatGPT Plus", "https://chatgpt.com"]],
    ["AI Writing", ["ChatGPT", "https://chatgpt.com"], ["Gemini", "https://gemini.google.com"], ["Claude Pro", "https://claude.ai"], ["Jasper", "https://www.jasper.ai"]],
    ["AI Image Generation", ["Microsoft Designer", "https://designer.microsoft.com"], ["Leonardo AI", "https://leonardo.ai"], ["Midjourney", "https://www.midjourney.com"], ["Adobe Firefly", "https://firefly.adobe.com"]],
    ["AI Video Generation", ["Kling AI", "https://klingai.com"], ["Runway free tier", "https://runwayml.com"], ["Runway", "https://runwayml.com"], ["Kling AI Pro", "https://klingai.com"]],
    ["AI Voice / TTS", ["ElevenLabs free", "https://elevenlabs.io"], ["Microsoft Azure TTS", "https://azure.microsoft.com/products/ai-services/text-to-speech"], ["ElevenLabs", "https://elevenlabs.io"], ["PlayHT", "https://play.ht"]],
    ["AI Coding", ["Gemini", "https://gemini.google.com"], ["ChatGPT free", "https://chatgpt.com"], ["Cursor Pro", "https://www.cursor.com"], ["Claude Code", "https://www.anthropic.com/claude-code"]],
    ["AI Data Analysis", ["ChatGPT free", "https://chatgpt.com"], ["Google Sheets + Gemini", "https://sheets.google.com"], ["ChatGPT Plus", "https://chatgpt.com"], ["Claude Pro", "https://claude.ai"]],
    ["Presentation", ["Gamma", "https://gamma.app"], ["Canva", "https://www.canva.com"], ["Pitch", "https://pitch.com"], ["Beautiful.ai", "https://www.beautiful.ai"]],
    ["Pitch Deck", ["Canva", "https://www.canva.com"], ["Gamma", "https://gamma.app"], ["Pitch", "https://pitch.com"], ["Beautiful.ai", "https://www.beautiful.ai"]],
    ["Documents", ["Google Docs", "https://docs.google.com"], ["Microsoft Word Online", "https://www.office.com/launch/word"], ["Microsoft 365", "https://www.microsoft.com/microsoft-365"], ["Google Workspace", "https://workspace.google.com"]],
    ["Notes / Knowledge Base", ["Notion", "https://www.notion.so"], ["Obsidian", "https://obsidian.md"], ["Notion Plus", "https://www.notion.so"], ["Evernote", "https://evernote.com"]],
    ["Task Management", ["Trello", "https://trello.com"], ["Todoist", "https://todoist.com"], ["ClickUp", "https://clickup.com"], ["Asana", "https://asana.com"]],
    ["Project Management", ["Trello", "https://trello.com"], ["Notion", "https://www.notion.so"], ["Linear", "https://linear.app"], ["ClickUp", "https://clickup.com"]],
    ["Calendar", ["Google Calendar", "https://calendar.google.com"], ["Apple Calendar", "https://www.icloud.com/calendar"], ["Motion", "https://www.usemotion.com"], ["Reclaim AI", "https://reclaim.ai"]],
    ["Time Tracking", ["Toggl Track", "https://toggl.com/track"], ["Clockify", "https://clockify.me"], ["Timely", "https://timelyapp.com"], ["Harvest", "https://www.getharvest.com"]],
    ["Email", ["Gmail", "https://mail.google.com"], ["Outlook", "https://outlook.live.com"], ["Superhuman", "https://superhuman.com"], ["Shortwave", "https://www.shortwave.com"]],
    ["Email Marketing", ["Mailchimp free", "https://mailchimp.com"], ["Brevo free", "https://www.brevo.com"], ["ConvertKit", "https://convertkit.com"], ["Mailchimp Premium", "https://mailchimp.com"]],
    ["Forms", ["Google Forms", "https://forms.google.com"], ["Tally", "https://tally.so"], ["Typeform", "https://www.typeform.com"], ["Jotform", "https://www.jotform.com"]],
    ["Surveys", ["Google Forms", "https://forms.google.com"], ["Tally", "https://tally.so"], ["Typeform", "https://www.typeform.com"], ["SurveyMonkey", "https://www.surveymonkey.com"]],
    ["Automation", ["Zapier free", "https://zapier.com"], ["Make free", "https://www.make.com"], ["Zapier", "https://zapier.com"], ["Make", "https://www.make.com"]],
    ["Password Manager", ["Bitwarden", "https://bitwarden.com"], ["Proton Pass", "https://proton.me/pass"], ["1Password", "https://1password.com"], ["Bitwarden Premium", "https://bitwarden.com"]],
    ["Cloud Storage", ["Google Drive", "https://drive.google.com"], ["OneDrive", "https://onedrive.live.com"], ["Dropbox", "https://www.dropbox.com"], ["Google One", "https://one.google.com"]],
    ["Large File Transfer", ["WeTransfer free", "https://wetransfer.com"], ["SwissTransfer", "https://www.swisstransfer.com"], ["WeTransfer Pro", "https://wetransfer.com"], ["Dropbox Transfer", "https://www.dropbox.com/transfer"]],
    ["PDF Tools", ["Adobe Acrobat online", "https://www.adobe.com/acrobat/online.html"], ["PDF24", "https://tools.pdf24.org"], ["Adobe Acrobat Pro", "https://www.adobe.com/acrobat.html"], ["Foxit PDF Editor", "https://www.foxit.com/pdf-editor"]],
    ["E-Signatures", ["DocuSign free", "https://www.docusign.com"], ["Dropbox Sign free", "https://sign.dropbox.com"], ["DocuSign", "https://www.docusign.com"], ["Adobe Acrobat Pro", "https://www.adobe.com/acrobat.html"]],
    ["Translation", ["DeepL free", "https://www.deepl.com/translator"], ["Google Translate", "https://translate.google.com"], ["DeepL Pro", "https://www.deepl.com/pro"], ["Google Cloud Translation", "https://cloud.google.com/translate"]],
    ["Grammar / Writing Correction", ["Grammarly free", "https://www.grammarly.com"], ["LanguageTool", "https://languagetool.org"], ["Grammarly Pro", "https://www.grammarly.com"], ["ProWritingAid", "https://prowritingaid.com"]],
    ["Paraphrasing", ["QuillBot free", "https://quillbot.com"], ["Grammarly", "https://www.grammarly.com"], ["QuillBot Premium", "https://quillbot.com"], ["Wordtune", "https://www.wordtune.com"]],
    ["Code Editor / IDE", ["VS Code", "https://code.visualstudio.com"], ["Zed", "https://zed.dev"], ["JetBrains IDEs", "https://www.jetbrains.com"], ["Cursor", "https://www.cursor.com"]],
    ["Git / Code Hosting", ["GitHub", "https://github.com"], ["GitLab", "https://gitlab.com"], ["GitHub Enterprise", "https://github.com/enterprise"], ["GitLab Premium", "https://about.gitlab.com/pricing"]],
    ["API Testing", ["Postman free", "https://www.postman.com"], ["Insomnia", "https://insomnia.rest"], ["Postman Pro", "https://www.postman.com"], ["RapidAPI", "https://rapidapi.com"]],
    ["Database", ["Supabase free", "https://supabase.com"], ["Neon free", "https://neon.tech"], ["Supabase Pro", "https://supabase.com"], ["PlanetScale", "https://planetscale.com"]],
    ["Website Builder", ["Google Sites", "https://sites.google.com"], ["Carrd free", "https://carrd.co"], ["Webflow", "https://webflow.com"], ["Framer", "https://www.framer.com"]],
    ["App Builder / No-Code", ["Glide", "https://www.glideapps.com"], ["AppSheet", "https://about.appsheet.com"], ["Bubble", "https://bubble.io"], ["FlutterFlow", "https://flutterflow.io"]],
    ["Online Store", ["WooCommerce", "https://woocommerce.com"], ["Ecwid free", "https://www.ecwid.com"], ["Shopify", "https://www.shopify.com"], ["BigCommerce", "https://www.bigcommerce.com"]],
    ["Graphic Design", ["Canva", "https://www.canva.com"], ["Adobe Express", "https://www.adobe.com/express"], ["Canva Pro", "https://www.canva.com"], ["Adobe Creative Cloud", "https://www.adobe.com/creativecloud.html"]],
    ["UI/UX Design", ["Figma free", "https://www.figma.com"], ["Penpot", "https://penpot.app"], ["Figma Professional", "https://www.figma.com"], ["Framer Pro", "https://www.framer.com"]],
    ["Photo Editing", ["Photopea", "https://www.photopea.com"], ["Pixlr", "https://pixlr.com"], ["Adobe Photoshop", "https://www.adobe.com/products/photoshop.html"], ["Affinity Photo", "https://affinity.serif.com/photo"]],
    ["Video Editing", ["DaVinci Resolve", "https://www.blackmagicdesign.com/products/davinciresolve"], ["CapCut", "https://www.capcut.com"], ["Adobe Premiere Pro", "https://www.adobe.com/products/premiere.html"], ["Final Cut Pro", "https://www.apple.com/final-cut-pro"]],
    ["Short-form Video", ["CapCut", "https://www.capcut.com"], ["Canva", "https://www.canva.com"], ["CapCut Pro", "https://www.capcut.com"], ["Adobe Premiere Pro", "https://www.adobe.com/products/premiere.html"]],
    ["Screen Recording", ["OBS Studio", "https://obsproject.com"], ["Loom free", "https://www.loom.com"], ["Screen Studio", "https://screen.studio"], ["Loom Business", "https://www.loom.com"]],
    ["Live Streaming", ["OBS Studio", "https://obsproject.com"], ["Streamlabs free", "https://streamlabs.com"], ["Streamlabs Ultra", "https://streamlabs.com"], ["Restream", "https://restream.io"]],
    ["Audio Editing", ["Audacity", "https://www.audacityteam.org"], ["BandLab", "https://www.bandlab.com"], ["Adobe Audition", "https://www.adobe.com/products/audition.html"], ["Logic Pro", "https://www.apple.com/logic-pro"]],
    ["AI Music Generation", ["Suno free", "https://suno.com"], ["Udio free", "https://www.udio.com"], ["Suno Pro", "https://suno.com"], ["Udio paid", "https://www.udio.com"]],
    ["Podcast Creation", ["Spotify for Creators", "https://podcasters.spotify.com"], ["Buzzsprout free", "https://www.buzzsprout.com"], ["Riverside", "https://riverside.fm"], ["Descript", "https://www.descript.com"]],
    ["Transcription", ["Otter free", "https://otter.ai"], ["Notta free", "https://www.notta.ai"], ["Otter Pro", "https://otter.ai"], ["Rev", "https://www.rev.com"]],
    ["Social Media Management", ["Buffer free", "https://buffer.com"], ["Later free", "https://later.com"], ["Hootsuite", "https://www.hootsuite.com"], ["Sprout Social", "https://sproutsocial.com"]],
    ["SEO", ["Google Search Console", "https://search.google.com/search-console"], ["Ahrefs Webmaster Tools", "https://ahrefs.com/webmaster-tools"], ["Ahrefs", "https://ahrefs.com"], ["Semrush", "https://www.semrush.com"]],
    ["Website Analytics", ["Google Analytics", "https://analytics.google.com"], ["Microsoft Clarity", "https://clarity.microsoft.com"], ["Hotjar", "https://www.hotjar.com"], ["Mixpanel", "https://mixpanel.com"]]
];

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
                ${renderQuickLinkColumn("Free", [1, 2])}
                ${renderQuickLinkColumn("Paid", [3, 4])}
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

function renderQuickLinkColumn(title, optionIndexes) {
    const links = quickLinkCatalog.map((item, index) => {
        const category = item[0];
        const options = optionIndexes.map((optionIndex) => item[optionIndex]);
        const optionLinks = options.map(([name, url]) => `
                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                        ${name} - ${category}
                    </a>
                `).join("");

        return `
            <li class="quick-link-card">
                <span class="quick-link-number">${index + 1}.</span>
                <div class="quick-link-items">
                    ${optionLinks}
                </div>
            </li>
        `;
    }).join("");

    return `
        <div class="quick-links-column">
            <h3>${title}</h3>
            <ol class="quick-links-list">
                ${links}
            </ol>
        </div>
    `;
}

if (quickLinksButton) {
    quickLinksButton.addEventListener('click', showQuickLinksWorkspace);
}
