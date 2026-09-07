const passwordOutput = document.getElementById("passwordOutput");
const generatePasswordButton = document.getElementById("generatePassword");
const copyPasswordButton = document.getElementById("copyPassword");
const passwordLength = document.getElementById("passwordLength");
const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const passwordStatus = document.getElementById("passwordStatus");

const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+[]{}|;:,.<>?/~`-="
};

function getRandomCharacter(characterSet) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet[randomIndex];
}

function generatePassword() {
    if (!passwordOutput || !passwordLength || !includeUppercase || !includeLowercase || !includeNumbers || !includeSymbols) {
        return;
    }

    const length = Math.max(4, parseInt(passwordLength.value) || 12);
    let characterPool = "";
    const requiredCharacters = [];

    if (includeUppercase.checked) {
        characterPool += characterSets.uppercase;
        requiredCharacters.push(getRandomCharacter(characterSets.uppercase));
    }

    if (includeLowercase.checked) {
        characterPool += characterSets.lowercase;
        requiredCharacters.push(getRandomCharacter(characterSets.lowercase));
    }

    if (includeNumbers.checked) {
        characterPool += characterSets.numbers;
        requiredCharacters.push(getRandomCharacter(characterSets.numbers));
    }

    if (includeSymbols.checked) {
        characterPool += characterSets.symbols;
        requiredCharacters.push(getRandomCharacter(characterSets.symbols));
    }

    if (!characterPool) {
        passwordOutput.value = "";
        if (passwordStatus) passwordStatus.textContent = "Select at least one character type.";
        return;
    }

    const finalLength = Math.max(length, requiredCharacters.length);
    const password = [...requiredCharacters];

    while (password.length < finalLength) {
        password.push(getRandomCharacter(characterPool));
    }

    for (let i = password.length - 1; i > 0; i--) {
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
        [password[i], password[randomIndex]] = [password[randomIndex], password[i]];
    }

    passwordOutput.value = password.join("");
    if (passwordStatus) passwordStatus.textContent = `Password ready (${passwordOutput.value.length} chars)`;
}

if (generatePasswordButton) {
    generatePasswordButton.addEventListener("click", generatePassword);
}

if (copyPasswordButton) {
    copyPasswordButton.addEventListener("click", async () => {
        if (!passwordOutput.value) return;

        try {
            await navigator.clipboard.writeText(passwordOutput.value);
            copyPasswordButton.textContent = "Copied!";
            if (passwordStatus) passwordStatus.textContent = "Password copied to clipboard.";
            setTimeout(() => {
                copyPasswordButton.textContent = "Copy Password";
            }, 2000);
        } catch {
            passwordOutput.focus();
            passwordOutput.select();
            if (passwordStatus) passwordStatus.textContent = "Copy manually from the field above.";
        }
    });
}

passwordLength.addEventListener("input", generatePassword);
includeUppercase.addEventListener("change", generatePassword);
includeLowercase.addEventListener("change", generatePassword);
includeNumbers.addEventListener("change", generatePassword);
includeSymbols.addEventListener("change", generatePassword);

generatePassword();

