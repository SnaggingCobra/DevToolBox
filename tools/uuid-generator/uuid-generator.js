const uuidOutput = document.getElementById("uuidOutput");
const generateUUIDButton = document.getElementById("generateUUIDButton");
const copyUUIDButton = document.getElementById("copyUUIDButton");
const uuidStatus = document.getElementById("uuidStatus");

function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();

    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function updateUUID() {
    uuidOutput.value = generateUUID();
    uuidStatus.textContent = "A new UUID is ready.";
}

if (uuidOutput && generateUUIDButton && copyUUIDButton && uuidStatus) {
generateUUIDButton.addEventListener("click", updateUUID);

copyUUIDButton.addEventListener("click", async () => {
    if (!uuidOutput.value) {
        uuidStatus.textContent = "Generate a UUID first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(uuidOutput.value);
        copyUUIDButton.textContent = "Copied!";
        uuidStatus.textContent = "UUID copied to your clipboard.";

        setTimeout(() => {
            copyUUIDButton.textContent = "Copy UUID";
        }, 2000);
    } catch {
        uuidOutput.focus();
        uuidOutput.select();
        uuidStatus.textContent = "Select the UUID and copy it manually.";
    }

});

updateUUID();
}
