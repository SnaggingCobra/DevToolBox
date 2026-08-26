const colorPicker =
    document.getElementById("colorPicker");

const hexColor =
    document.getElementById("hexColor");

const rgbColor =
    document.getElementById("rgbColor");

const hslColor =
    document.getElementById("hslColor");

const colorPreview =
    document.getElementById("colorPreview");

const convertColor =
    document.getElementById("convertColor");

const copyHex =
    document.getElementById("copyHex");

const copyRgb =
    document.getElementById("copyRgb");

const copyHsl =
    document.getElementById("copyHsl");

const colorStatus =
    document.getElementById("colorStatus");


function hexToRgb(hex) {

    hex = hex.replace("#", "");

    if (hex.length === 3) {

        hex =
            hex[0] + hex[0] +
            hex[1] + hex[1] +
            hex[2] + hex[2];

    }

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return null;
    }

    const r =
        parseInt(hex.substring(0, 2), 16);

    const g =
        parseInt(hex.substring(2, 4), 16);

    const b =
        parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const max =
        Math.max(r, g, b);

    const min =
        Math.min(r, g, b);

    let h;
    let s;

    const l =
        (max + min) / 2;

    if (max === min) {
        h = 0;
        s = 0;

    } else {

        const difference =
            max - min;
        s =
            l > 0.5
                ? difference / (2 - max - min)
                : difference / (max + min);

        switch (max) {

            case r:

                h =
                    (g - b) /
                    difference +
                    (g < b ? 6 : 0);
                break;

            case g:

                h =
                    (b - r) /
                    difference +
                    2;
                break;

            case b:
                h =
                    (r - g) /
                    difference +
                    4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}
function updateColor() {

    const hex =
        hexColor.value.trim();

    const rgb =
        hexToRgb(hex);

    if (!rgb) {

        colorStatus.textContent =
            "✕ Invalid HEX color.";
        return;
    }

    const hsl =
        rgbToHsl(
            rgb.r,
            rgb.g,
            rgb.b
        );

    rgbColor.value =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    hslColor.value =
        `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    colorPreview.style.backgroundColor =
        "#" + hex.replace("#", "");

    colorPicker.value =
        "#" + hex.replace("#", "");

    colorStatus.textContent =
        "✓ Color converted successfully.";

}

colorPicker.addEventListener(
    "input",
    () => {
        hexColor.value =
            colorPicker.value;
        updateColor();
    }
);

convertColor.addEventListener(
    "click",
    updateColor
);

// COPY

copyHex.addEventListener(
    "click",
    () => {
        navigator.clipboard.writeText(
            hexColor.value
        );
        colorStatus.textContent =
            "✓ HEX copied.";
    }
);

copyRgb.addEventListener(
    "click",
    () => {
        navigator.clipboard.writeText(
            rgbColor.value
        );
        colorStatus.textContent =
            "✓ RGB copied.";
    }
);

copyHsl.addEventListener(
    "click",
    () => {
        navigator.clipboard.writeText(
            hslColor.value
        );
        colorStatus.textContent =
            "✓ HSL copied.";
    }
);

updateColor();