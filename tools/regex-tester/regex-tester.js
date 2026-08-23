const regexPattern =
    document.getElementById("regexPattern");

const regexFlags =
    document.getElementById("regexFlags");

const regexText =
    document.getElementById("regexText");

const testRegex =
    document.getElementById("testRegex");

const clearRegex =
    document.getElementById("clearRegex");

const regexResult =
    document.getElementById("regexResult");


    
// TEST REGEX
testRegex.addEventListener("click", () => {

    const pattern =
        regexPattern.value;

    const flags =
        regexFlags.value;

    const text =
        regexText.value;


    if (!pattern) {

        regexResult.textContent =
            "Please enter a regular expression.";
        return;
    }

    try {

        const regex =
            new RegExp(pattern, flags);

        const matches =
            text.match(regex);

        if (!matches) {
            regexResult.textContent =
                "No matches found.";

            return;
        }

        let result =
            `Found ${matches.length} match(es):\n\n`;

        matches.forEach((match, index) => {
            result +=
                `${index + 1}. ${match}\n`;

        });
        regexResult.textContent = result;

    } catch (error) {

        regexResult.textContent =
            "Invalid regular expression:\n\n" +
            error.message;
    }

});
// CLEAR

clearRegex.addEventListener("click", () => {

    regexPattern.value = "";
    regexFlags.value = "";
    regexText.value = "";
    regexResult.textContent =
        "Enter a regex and some text to begin.";

});