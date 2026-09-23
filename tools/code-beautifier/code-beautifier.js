const beautifierInput = document.getElementById("beautifierInput");
const beautifierOutput = document.getElementById("beautifierOutput");
const beautifierLanguage = document.getElementById("beautifierLanguage");
const beautifyCode = document.getElementById("beautifyCode");
const copyBeautified = document.getElementById("copyBeautified");
const beautifierStatus = document.getElementById("beautifierStatus");
const clearBeautifier = document.getElementById("clearBeautifier");

function setStatus(message) {   
    if (beautifierStatus) {
        beautifierStatus.textContent = message;
    }
}

async function loadPrettier () {
    if (
        window.prettier &&
        window.prettierPlugins
    )
    {
        return;
    }

const prettierScript = document.createElement("script");

prettierScript.src = "https://unpkg.com/prettier@3.6.2/standalone.js";

prettierScript.onload = () => {
    loadPrettierPlugins();
};

prettierScript.onerror = () => {
    setStatus("Unable to Load the Formatter");

};

document.head.appendChild(
    prettierScript
);

}

function loadPrettierPlugins() {
    if (!window.prettier) {
        return;

    }

     const babelPlugin =
        document.createElement("script");

    babelPlugin.src =
        "https://unpkg.com/prettier@3.6.2/plugins/babel.js";

    babelPlugin.onload = () => {

        const htmlPlugin =
            document.createElement("script");

        htmlPlugin.src =
            "https://unpkg.com/prettier@3.6.2/plugins/html.js";

        htmlPlugin.onload = () => {

            const postcssPlugin =
                document.createElement("script");

            postcssPlugin.src =
                "https://unpkg.com/prettier@3.6.2/plugins/postcss.js";

            postcssPlugin.onload = () => {

                const estreePlugin =
                    document.createElement("script");

                estreePlugin.src =
                    "https://unpkg.com/prettier@3.6.2/plugins/estree.js";

                estreePlugin.onload = () => {
                    setStatus("Ready");
                };

                document.head.appendChild(
                    estreePlugin
                );
            };

            document.head.appendChild(
                postcssPlugin
            );
        };

        document.head.appendChild(
            htmlPlugin
        );
    };

    document.head.appendChild(
        babelPlugin
    );
}


async function beautify() {
    if (!beautifierInput || !beautifierOutput || !beautifierLanguage || !beautifyCode) {
        return;
    }

    const code = beautifierInput.value.trim();

    if (!code) {
        beautifierOutput.value = "";
        setStatus("Paste some code first.");
        return;
    }

    if (!window.prettier || !window.prettierPlugins) {
        setStatus("Formatter is still loading...");
        return;
    }

    beautifyCode.disabled = true;
    setStatus("Formatting...");

    try {
        const language = beautifierLanguage.value;
        const parser =
            language === "javascript"
                ? "babel"
                : language === "json"
                    ? "json"
                    : language === "html"
                        ? "html"
                        : language === "css"
                            ? "css"
                            : language;

        const plugins = Object.values(window.prettierPlugins || {});

        const formatted = await window.prettier.format(code, {
            parser,
            plugins,
            printWidth: 100,
            semi: true,
            singleQuote: false,
            trailingComma: "es5"
        });

        beautifierOutput.value = formatted;
        setStatus("Code formatted successfully.");
    } catch (error) {
        console.error("Beautifier Error:", error);
        beautifierOutput.value = "";
        setStatus(error.message || "Unable to format the code.");
    } finally {
        beautifyCode.disabled = false;
    }
}

async function copyFormattedCode() {
    if (!beautifierOutput) return;

    const code = beautifierOutput.value;

    if (!code) {
        setStatus("Nothing to copy");
        return;
    }

    try {
        await navigator.clipboard.writeText(code);
        setStatus("Formatted code copied");
    } catch (error) {
        console.error("Copy Error", error);
        setStatus("Unable to copy the code");
    }
}


function clearBeautifierTool() {
    if (!beautifierInput || !beautifierOutput) return;

    beautifierInput.value = "";
    beautifierOutput.value = "";
    setStatus("Ready");
    beautifierInput.focus();
}


if (beautifyCode) {
    beautifyCode.addEventListener("click", beautify);
}

if (copyBeautified) {
    copyBeautified.addEventListener("click", copyFormattedCode);
}

if (clearBeautifier) {
    clearBeautifier.addEventListener("click", clearBeautifierTool);
}

loadPrettier();






confirm.bind ( history)

{


}



































































