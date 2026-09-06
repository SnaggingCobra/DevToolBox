const base64Input =
    document.getElementById("base64Input");

const base64Output =
    document.getElementById("base64Output");

const encodeBase64 =
    document.getElementById("encodeBase64");

const decodeBase64 =
    document.getElementById("decodeBase64");

const clearBase64 =
    document.getElementById("clearBase64");

const copyBase64 =
    document.getElementById("copyBase64");

const base64Status = 
    document.getElementById("base64Status");

    

function encodeText(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function decodeText(value) {
    const binary = atob(value.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
    }

    base64Output.focus();
    base64Output.select();
    if (!document.execCommand("copy")) throw new Error("Copy failed");
}

encodeBase64.addEventListener("click", () => {
    const input = base64Input.value;

    if (input === "") {
        base64Status.textContent = "Please Enter Some Text";
        return;
    }

    try {
        base64Output.value = encodeText(input);
        base64Status.textContent = "Text encoded.";

    }
    catch (error) {
        base64Status.textContent = "Could not encode the text.";

    }

    });

decodeBase64.addEventListener("click", () => {

    const input =
        base64Input.value.trim();

    if (input === "") {
        base64Status.textContent = 
        "Please Enter Base64 Text";
    return;
    }

    try {
        base64Output.value = decodeText(input);
        base64Status.textContent = "Base64 decoded.";
    }

    catch (error){

        base64Output.value = "";
        base64Status.textContent = "Invalid Base64 Input";
    }
    });

clearBase64.addEventListener("click", () => {
    base64Input.value = "";
    base64Output.value = "";
    base64Status.textContent = "Ready";
});


    copyBase64.addEventListener("click", async () => {
        if (base64Output.value === "") {
            base64Status.textContent =
                "Nothing to copy";

        return;
        }

        try {
            await copyText(base64Output.value);
            base64Status.textContent = "Output copied to clipboard.";
        }
        catch (error) {
            base64Status.textContent =
                "Could not copy the output.";
        }
    });
