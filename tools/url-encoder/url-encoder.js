const urlInput = document.getElementById("urlInput");
const urlOutput = document.getElementById("urlOutput");
const encodeUrl = document.getElementById("encodeUrl");
const decodeUrl = document.getElementById("decodeUrl");
const clearUrl = document.getElementById("clearUrl");
const copyUrl = document.getElementById("copyUrl");
const urlStatus = document.getElementById("urlStatus");

if (urlInput && urlOutput && encodeUrl && decodeUrl && clearUrl && copyUrl && urlStatus) {
    const setStatus = (message) => {
        urlStatus.textContent = message;
    };

    encodeUrl.addEventListener("click", () => {
        const input = urlInput.value;
        if (!input.trim()) {
            urlOutput.value = "";
            setStatus("Please enter some text to encode.");
            return;
        }

        try {
            urlOutput.value = encodeURIComponent(input);
            setStatus("URL encoded successfully.");
        } catch {
            urlOutput.value = "";
            setStatus("Could not encode the input.");
        }
    });

    decodeUrl.addEventListener("click", () => {
        const input = urlInput.value;
        if (!input.trim()) {
            urlOutput.value = "";
            setStatus("Please enter an encoded URL to decode.");
            return;
        }

        try {
            urlOutput.value = decodeURIComponent(input);
            setStatus("URL decoded successfully.");
        } catch {
            urlOutput.value = "";
            setStatus("Invalid URL encoding.");
        }
    });

    clearUrl.addEventListener("click", () => {
        urlInput.value = "";
        urlOutput.value = "";
        setStatus("Ready");
        urlInput.focus();
    });

    copyUrl.addEventListener("click", async () => {
        if (!urlOutput.value) {
            setStatus("Nothing to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(urlOutput.value);
            setStatus("Output copied to clipboard.");
        } catch {
            // Clipboard access can be unavailable outside a secure browser context.
            urlOutput.focus();
            urlOutput.select();
            setStatus("Select the output and copy it manually.");
        }
    });
}
