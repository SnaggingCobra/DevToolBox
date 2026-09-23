const aesMode = document.getElementById("aesMode");
const aesKey = document.getElementById("aesKey");
const aesInput = document.getElementById("aesInput");
const aesOutput = document.getElementById("aesOutput");
const aesCopy = document.getElementById("aesCopy");
const aesProcess = document.getElementById("aesProcess");
const aesClear = document.getElementById("aesClear");
const aesStatus = document.getElementById("aesStatus");

function setStatus(message) {
    if (aesStatus) {
        aesStatus.textContent = message;
    }
}

function updateMode() {
    if (!aesMode || !aesProcess || !aesInput) return;

    const encrypting = aesMode.value === "encrypt";
    aesProcess.textContent = encrypting ? "Encrypt" : "Decrypt";
    aesInput.placeholder = encrypting
        ? "Enter text to encrypt..."
        : "Paste encrypted text here...";

    if (aesOutput) {
        aesOutput.value = "";
    }

    setStatus("Ready");
}

async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"]
    );
}

function combineData(salt, iv, encrypted) {
    const combined = new Uint8Array(salt.length + iv.length + encrypted.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encrypted, salt.length + iv.length);
    return combined;
}

function splitData(data) {
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);
    return { salt, iv, encrypted };
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}

function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

async function encryptText(text, password) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(text)
    );

    return arrayBufferToBase64(combineData(salt, iv, new Uint8Array(encrypted)));
}

async function decryptText(encryptedText, password) {
    const data = base64ToUint8Array(encryptedText);

    if (data.length < 29) {
        throw new Error("Invalid encrypted data.");
    }

    const { salt, iv, encrypted } = splitData(data);
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted
    );

    return new TextDecoder().decode(decrypted);
}

async function processAES() {
    if (!aesInput || !aesKey || !aesOutput || !aesMode || !aesProcess) return;

    const text = aesInput.value;
    const password = aesKey.value;

    if (!text.trim()) {
        setStatus("Enter some text first.");
        return;
    }

    if (!password) {
        setStatus("Enter a password first.");
        return;
    }

    aesProcess.disabled = true;

    try {
        if (aesMode.value === "encrypt") {
            setStatus("Encrypting...");
            aesOutput.value = await encryptText(text, password);
            setStatus("Text encrypted successfully.");
        } else {
            setStatus("Decrypting...");
            aesOutput.value = await decryptText(text.trim(), password);
            setStatus("Text decrypted successfully.");
        }
    } catch (error) {
        console.error("AES Error:", error);
        aesOutput.value = "";

        if (aesMode.value === "decrypt") {
            setStatus("Decryption failed. Check the password and encrypted text.");
        } else {
            setStatus("Unable to encrypt the text.");
        }
    } finally {
        aesProcess.disabled = false;
    }
}

async function copyAESOutput() {
    if (!aesOutput) return;

    const output = aesOutput.value;
    if (!output) {
        setStatus("Nothing to copy.");
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        setStatus("Result copied.");
    } catch (error) {
        console.error("Copy Error:", error);
        setStatus("Unable to copy the result.");
    }
}

function clearAES() {
    if (!aesInput || !aesOutput || !aesKey) return;

    aesInput.value = "";
    aesOutput.value = "";
    aesKey.value = "";
    setStatus("Ready");
    aesInput.focus();
}

if (aesMode) {
    aesMode.addEventListener("change", updateMode);
}

if (aesProcess) {
    aesProcess.addEventListener("click", processAES);
}

if (aesCopy) {
    aesCopy.addEventListener("click", copyAESOutput);
}

if (aesClear) {
    aesClear.addEventListener("click", clearAES);
}

updateMode();
setStatus("Ready");









                                     









