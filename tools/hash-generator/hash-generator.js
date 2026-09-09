const hashInput = document.getElementById("hashInput");
const hashAlgorithm = document.getElementById("hashAlgorithm");
const hashCase = document.getElementById("hashCase");
const generateHashButton = document.getElementById("generateHash");
const clearHashButton = document.getElementById("clearHash");
const hashOutput = document.getElementById("hashOutput");
const copyHashButton = document.getElementById("copyHash");
const hashStatus = document.getElementById("hashStatus");
const hashInputLength = document.getElementById("hashInputLength");
const hashOutputLength = document.getElementById("hashOutputLength");

function updateInputLength() {
    if (!hashInputLength || !hashInput) return;
    const len = hashInput.value.length;
    hashInputLength.textContent = `${len} character${len === 1 ? "" : "s"}`;
}

function updateOutputLength(hashStr = "") {
    if (!hashOutputLength) return;
    const len = hashStr.length;
    if (len === 0) {
        hashOutputLength.textContent = "0 characters";
        return;
    }
    const bits = len * 4;
    hashOutputLength.textContent = `${len} characters (${bits}-bit)`;
}

function setStatus(message, isError = false) {
    if (!hashStatus) return;
    hashStatus.textContent = message;
    hashStatus.classList.toggle("is-error", isError);
}

async function generateHash() {
    if (!hashInput || !hashOutput || !hashAlgorithm) return;

    const text = hashInput.value;
    const algorithm = hashAlgorithm.value;

    if (!text) {
        hashOutput.value = "";
        updateOutputLength("");
        setStatus("Ready");
        return;
    }

    try {
        setStatus("Generating hash...");
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

        if (hashCase && hashCase.value === "upper") {
            hashHex = hashHex.toUpperCase();
        }

        hashOutput.value = hashHex;
        updateOutputLength(hashHex);
        setStatus(`${algorithm} hash generated successfully`);
    } catch (error) {
        console.error("Hash Generation Error:", error);
        hashOutput.value = "";
        updateOutputLength("");
        setStatus(`Unable to generate hash: ${error.message || "Unknown error"}`, true);
    }
}

if (hashInput) {
    hashInput.addEventListener("input", () => {
        updateInputLength();
        generateHash();
    });
}

if (hashAlgorithm) {
    hashAlgorithm.addEventListener("change", generateHash);
}

if (hashCase) {
    hashCase.addEventListener("change", generateHash);
}

if (generateHashButton) {
    generateHashButton.addEventListener("click", generateHash);
}

if (clearHashButton) {
    clearHashButton.addEventListener("click", () => {
        if (hashInput) hashInput.value = "";
        if (hashOutput) hashOutput.value = "";
        updateInputLength();
        updateOutputLength("");
        setStatus("Cleared");
        if (hashInput) hashInput.focus();
    });
}

if (copyHashButton) {
    copyHashButton.addEventListener("click", async () => {
        if (!hashOutput || !hashOutput.value) {
            setStatus("No hash to copy", true);
            return;
        }

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(hashOutput.value);
            } else {
                hashOutput.select();
                document.execCommand("copy");
            }

            const originalText = copyHashButton.textContent;
            copyHashButton.textContent = "Copied!";
            copyHashButton.classList.add("is-copied");
            setStatus("Hash copied to clipboard!");

            setTimeout(() => {
                copyHashButton.textContent = originalText;
                copyHashButton.classList.remove("is-copied");
            }, 1500);
        } catch (error) {
            console.error("Copy error:", error);
            setStatus("Failed to copy hash", true);
        }
    });
}

// Initial state
updateInputLength();
updateOutputLength("");
