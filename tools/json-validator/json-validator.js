const validatorInput =
    document.getElementById("validatorInput");

const validateJson =
    document.getElementById("validateJson");

const clearValidator =
    document.getElementById("clearValidator");

const validatorResult =
    document.getElementById("validatorResult");


validateJson.addEventListener("click", () => {

    const input =
        validatorInput.value.trim();

    if (!input) {

        validatorResult.textContent =
            "Please enter some JSON to validate.";

        return;

    }
    try {

        JSON.parse(input);

        validatorResult.textContent =
            "✓ Valid JSON";

    } catch (error) {

        validatorResult.textContent =
            "✕ Invalid JSON\n\n" + error.message;

    }

});

clearValidator.addEventListener("click", () => {

    validatorInput.value = ""
    validatorResult.textContent =
        "Ready to validate your JSON.";

});
