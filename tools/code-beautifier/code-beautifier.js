const beautifierInput = document.getElementById("beautifierInput");
const beautifierOutput = document.getElementById("beautifierOutput");
const beautifierLanguage = document.getElementById("beautifierLanguage");
const beautifyCode = document.getElementById("beautifyCode");
const copyBeautified = document.getElementById("copyBeautified");
const beautifierStatus = document.getElementById("beautifierStatus");
const clearBeatifier = document.getElementById("clearBeautifier");


function setStatus(message) {
    beautifierStatus.textContent = message;

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

    const babelPlugin = document.createElement("script");


    babelPlugin.src =
        "https://unpkg.com/prettier@3.6.2/plugins/babel.js";

        babelPlugin.onload = () => {
        }

    babelPlugin.src =
        "https://unpkg.com/prettier@3.6.2/plugins/babel.js";











        