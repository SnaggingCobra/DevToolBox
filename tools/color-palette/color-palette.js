const paletteType =
    document.getElementById("paletteType");

const colorPalette =
    document.getElementById("colorPalette");

const generatePalette =
    document.getElementById("generatePalette");

const copyPalette =
    document.getElementById("copyPalette");

const paletteStatus =
    document.getElementById("paletteStatus");


let colors = [];
let lockedColors = [false, false, false, false, false];


function setStatus(message) {
    paletteStatus.textContent = message;
}


function randomHue() {
    return Math.floor(Math.random() * 360);
}


function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;

    const a =
        s * Math.min(l, 1 - l);

    const f = (n) =>
        l -
        a *
        Math.max(
            -1,
            Math.min(
                k(n) - 3,
                Math.min(
                    9 - k(n),
                    1
                )
            )
        );

    const toHex = (value) =>
        Math.round(value * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}


function generateRandomColor() {
    return hslToHex(
        randomHue(),
        65,
        55
    );
}


function generatePaletteColors() {
    const type =
        paletteType.value;

    const baseHue =
        randomHue();

    const result = [];

    if (type === "monochromatic") {

        const lightnessValues = [
            25,
            40,
            55,
            70,
            85
        ];

        lightnessValues.forEach(
            (lightness) => {
                result.push(
                    hslToHex(
                        baseHue,
                        65,
                        lightness
                    )
                );
            }
        );

    } else if (type === "complementary") {

        const hues = [
            baseHue,
            baseHue,
            baseHue + 180,
            baseHue + 180,
            baseHue
        ];

        const lightness = [
            40,
            60,
            40,
            60,
            75
        ];

        for (let i = 0; i < 5; i++) {
            result.push(
                hslToHex(
                    hues[i],
                    65,
                    lightness[i]
                )
            );
        }

    } else if (type === "analogous") {

        const hues = [
            baseHue - 30,
            baseHue - 15,
            baseHue,
            baseHue + 15,
            baseHue + 30
        ];

        hues.forEach((hue) => {
            result.push(
                hslToHex(
                    hue,
                    65,
                    55
                )
            );
        });

    } else if (type === "triadic") {

        const hues = [
            baseHue,
            baseHue + 120,
            baseHue + 240,
            baseHue + 120,
            baseHue
        ];

        const lightness = [
            45,
            55,
            55,
            70,
            75
        ];

        for (let i = 0; i < 5; i++) {
            result.push(
                hslToHex(
                    hues[i],
                    65,
                    lightness[i]
                )
            );
        }

    } else {

        for (let i = 0; i < 5; i++) {
            result.push(
                generateRandomColor()
            );
        }
    }

    return result;
}


function renderPalette() {
    colorPalette.innerHTML = "";

    colors.forEach(
        (color, index) => {

            const card =
                document.createElement("div");

            card.className =
                "color-card";

            const preview =
                document.createElement("div");

            preview.className =
                "color-preview";

            preview.style.backgroundColor =
                color;

            const info =
                document.createElement("div");

            info.className =
                "color-info";

            const value =
                document.createElement("span");

            value.className =
                "color-value";

            value.textContent =
                color;

            const buttons =
                document.createElement("div");

            buttons.className =
                "color-buttons";

            const copyButton =
                document.createElement("button");

            copyButton.className =
                "color-copy";

            copyButton.textContent =
                "Copy";

            copyButton.type =
                "button";

            copyButton.addEventListener(
                "click",
                () => copyColor(color)
            );

            const lockButton =
                document.createElement("button");

            lockButton.className =
                "color-lock";

            lockButton.type =
                "button";

            lockButton.textContent =
                lockedColors[index]
                    ? "🔒"
                    : "🔓";

            if (lockedColors[index]) {
                lockButton.classList.add(
                    "locked"
                );
            }

            lockButton.addEventListener(
                "click",
                () => {
                    lockedColors[index] =
                        !lockedColors[index];

                    renderPalette();
                }
            );

            buttons.appendChild(
                copyButton
            );

            buttons.appendChild(
                lockButton
            );

            info.appendChild(value);
            info.appendChild(buttons);

            card.appendChild(preview);
            card.appendChild(info);

            colorPalette.appendChild(card);
        }
    );
}


function generateNewPalette() {
    const newColors =
        generatePaletteColors();

    colors =
        newColors.map(
            (newColor, index) =>
                lockedColors[index]
                    ? colors[index]
                    : newColor
        );

    renderPalette();

    setStatus(
        "New palette generated."
    );
}


async function copyColor(color) {
    try {
        await navigator.clipboard.writeText(
            color
        );

        setStatus(
            `${color} copied.`
        );

    } catch (error) {
        console.error(
            "Copy Error:",
            error
        );

        setStatus(
            "Unable to copy the color."
        );
    }
}


async function copyAllColors() {
    if (!colors.length) {
        setStatus(
            "No palette to copy."
        );

        return;
    }

    try {
        await navigator.clipboard.writeText(
            colors.join(" ")
        );

        setStatus(
            "Palette copied."
        );

    } catch (error) {
        console.error(
            "Copy Palette Error:",
            error
        );

        setStatus(
            "Unable to copy the palette."
        );
    }
}


paletteType.addEventListener(
    "change",
    generateNewPalette
);

generatePalette.addEventListener(
    "click",
    generateNewPalette
);

copyPalette.addEventListener(
    "click",
    copyAllColors
);


colors =
    generatePaletteColors();

renderPalette();