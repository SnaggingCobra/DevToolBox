const shadowBox = document.getElementById("shadowBox");
const shadowX = document.getElementById("shadowX");
const shadowY = document.getElementById("shadowY");
const shadowBlur = document.getElementById("shadowBlur");
const shadowSpread = document.getElementById("shadowSpread");
const shadowColor = document.getElementById("shadowColor");
const shadowColorHex = document.getElementById("shadowColorHex");
const shadowOpacity = document.getElementById("shadowOpacity");
const shadowInset = document.getElementById("shadowInset");
const shadowCSS = document.getElementById("shadowCSS");
const shadowStatus = document.getElementById("shadowStatus");
const copyShadow = document.getElementById("copyShadow");
const resetShadow = document.getElementById("resetShadow");

const shadowXValue = document.getElementById("shadowXValue");
const shadowYValue = document.getElementById("shadowYValue");
const shadowBlurValue = document.getElementById("shadowBlurValue");
const shadowSpreadValue = document.getElementById("shadowSpreadValue");
const shadowOpacityValue = document.getElementById("shadowOpacityValue");

function hexToRgb(hex) {
    const normalized = hex.replace("#", "");

    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        return null;
    }

    return {
        r: parseInt(normalized.substring(0, 2), 16),
        g: parseInt(normalized.substring(2, 4), 16),
        b: parseInt(normalized.substring(4, 6), 16)
    };
}

function updateShadow() {
    const x = Number(shadowX.value);
    const y = Number(shadowY.value);
    const blur = Number(shadowBlur.value);
    const spread = Number(shadowSpread.value);
    const opacity = Number(shadowOpacity.value) / 100;
    const rgb = hexToRgb(shadowColor.value);

    if (!rgb) {
        shadowStatus.textContent = "✕ Invalid color.";
        return;
    }

    const inset = shadowInset.checked ? "inset " : "";
    const shadow = `${inset}${x}px ${y}px ${blur}px ${spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

    shadowBox.style.boxShadow = shadow;
    shadowXValue.textContent = `${x}px`;
    shadowYValue.textContent = `${y}px`;
    shadowBlurValue.textContent = `${blur}px`;
    shadowSpreadValue.textContent = `${spread}px`;
    shadowOpacityValue.textContent = `${shadowOpacity.value}%`;
    shadowCSS.textContent = `box-shadow: ${shadow};`;
    shadowStatus.textContent = "Shadow Updated";
}

shadowX.addEventListener("input", updateShadow);
shadowY.addEventListener("input", updateShadow);
shadowBlur.addEventListener("input", updateShadow);
shadowSpread.addEventListener("input", updateShadow);
shadowOpacity.addEventListener("input", updateShadow);
shadowInset.addEventListener("change", updateShadow);

shadowColor.addEventListener("input", () => {
    shadowColorHex.value = shadowColor.value;
    updateShadow();
});

shadowColorHex.addEventListener("change", () => {
    const value = shadowColorHex.value.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        shadowColor.value = value;
        shadowColorHex.value = value;
        updateShadow();
    } else {
        shadowStatus.textContent = "✕ Invalid HEX color.";
    }
});

copyShadow.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(shadowCSS.textContent);
        shadowStatus.textContent = "✓ CSS copied to clipboard.";
    } catch (error) {
        shadowStatus.textContent = "✕ Could not copy CSS.";
    }
});

resetShadow.addEventListener("click", () => {
    shadowX.value = 10;
    shadowY.value = 10;
    shadowBlur.value = 15;
    shadowSpread.value = 0;
    shadowOpacity.value = 50;
    shadowColor.value = "#000000";
    shadowColorHex.value = "#000000";
    shadowInset.checked = false;
    updateShadow();
});

updateShadow();
        shadowColorHex.value =
            "#000000";

        shadowInset.checked = false;

        updateShadow();

        shadowStatus.textContent =
            "✓ Shadow reset.";

    }
);

updateShadow();

}