const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");

const formatJson = document.getElementById("formatJson");
const minifyJson = document.getElementById("minifyJson");
const clearJson = document.getElementById("clearJson");
const copyJson = document.getElementById("copyJson");

const jsonStatus = document.getElementById("jsonStatus");


formatJson.addEventListener("click", () => {

    try {

        const parsedJson =
            JSON.parse(jsonInput.value);

        jsonOutput.value =
            JSON.stringify(parsedJson, null, 2);

        jsonStatus.textContent =
            "✓ Valid JSON";

    } catch (error) {

        jsonOutput.value = "";

        jsonStatus.textContent =
            "✕ Invalid JSON: " + error.message;

    }

});


minifyJson.addEventListener("click", () => {

    try {

        const parsedJson =
            JSON.parse(jsonInput.value);
        jsonOutput.value =
            JSON.stringify(parsedJson);
        jsonStatus.textContent =
            "✓ JSON minified";

    } catch (error) {

        jsonOutput.value = "";
        jsonStatus.textContent =
            "✕ Invalid JSON: " + error.message;

    }

});

clearJson.addEventListener("click", () => {

    jsonInput.value = "";
    jsonOutput.value = "";

    jsonStatus.textContent = "Ready";

});

copyJson.addEventListener("click", async () => {

    if (!jsonOutput.value) {

        jsonStatus.textContent =
            "Nothing to copy.";

        return;

    }

    try {

        await navigator.clipboard.writeText(
            jsonOutput.value
        );

        jsonStatus.textContent =
            "✓ Copied to clipboard";

    } catch (error) {

        jsonStatus.textContent =
            "✕ Could not copy.";
    }
});