const originalText =
    document.getElementById("originalText");

const changedText =
    document.getElementById("changedText");

const compareText =
    document.getElementById("compareText");

const clearDiff =
    document.getElementById("clearDiff");

const diffResult =
    document.getElementById("diffResult");


    
compareText.addEventListener("click", () => {

    const original =
        originalText.value.split("\n");

    const changed =
        changedText.value.split("\n");


    if (originalText.value === changedText.value) {
        diffResult.innerHTML = `
            <div class="diff-same">
                ✓ The two texts are identical.
            </div>
        `;
        return;
    }

    let result = "";

    const maxLines =
        Math.max(original.length, changed.length);

    for (let i = 0; i < maxLines; i++) {
        const oldLine = original[i];
        const newLine = changed[i];

        if (oldLine === newLine) {
            if (oldLine !== undefined) {
                result +=
                    `  ${escapeHtml(oldLine)}\n`;
            }
            continue;
        }

        if (oldLine !== undefined) {
            result +=
                `<span class="diff-removed">- ${escapeHtml(oldLine)}</span>\n`;
        }
        if (newLine !== undefined) {
            result +=
                `<span class="diff-added">+ ${escapeHtml(newLine)}</span>\n`;
        }
    }

    diffResult.innerHTML = result;

});

clearDiff.addEventListener("click", () => {

    originalText.value = "";
    changedText.value = "";
    diffResult.textContent =
        "Enter two texts and click Compare.";

});

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}