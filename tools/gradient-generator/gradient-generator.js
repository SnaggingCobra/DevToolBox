const gradientPreview =
    document.getElementById("gradientPreview");

const gradientType =
    document.getElementById("gradientType");

const gradientAngle =
    document.getElementById("gradientAngle");

const angleValue =
    document.getElementById("angleValue");

const gradientColor1 =
    document.getElementById("gradientColor1");

const gradientColor2 =
    document.getElementById("gradientColor2");

const gradientHex1 =
    document.getElementById("gradientHex1");

const gradientHex2 =
    document.getElementById("gradientHex2");

const generateGradient =
    document.getElementById("generateGradient");

const randomGradient =
    document.getElementById("randomGradient");

const gradientCSS =
    document.getElementById("gradientCSS");

const copyGradientCSS =
    document.getElementById("copyGradientCSS");

const gradientStatus =
    document.getElementById("gradientStatus");

function updateGradient() {

    const type =
        gradientType.value;

    const angle =
        gradientAngle.value;

    const color1 =
        gradientColor1.value;

    const color2 =
        gradientColor2.value;

    angleValue.textContent =
        `${angle}°`;

    let gradient;

    if (type === "linear") {

        gradient =
            `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    } else {
        gradient =
            `radial-gradient(circle, ${color1}, ${color2})`;

    }

    gradientPreview.style.background =
        gradient;

    gradientCSS.textContent =
        `background: ${gradient};`;

    gradientStatus.textContent =
        "✓ Gradient updated.";

}

gradientColor1.addEventListener(
    "input",
    () => {

        gradientHex1.value =
            gradientColor1.value;
        updateGradient();
    }
);

gradientColor2.addEventListener(
    "input",
    () => {
        gradientHex2.value =
            gradientColor2.value;

        updateGradient();
    }
);

gradientHex1.addEventListener(
    "change",
    () => {

        const value =
            gradientHex1.value.trim();

        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {

            gradientColor1.value =
                value;
            updateGradient();

        } else {
            gradientStatus.textContent =
                "✕ Invalid Color 1.";
        }
    }
);

gradientHex2.addEventListener(
    "change",
    () => {
        const value =
            gradientHex2.value.trim();

        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {

            gradientColor2.value =
                value;
            updateGradient();

        } else {
            gradientStatus.textContent =
                "✕ Invalid Color 2.";
        }
    }
);

gradientAngle.addEventListener(
    "input",
    updateGradient
);

gradientType.addEventListener(
    "change",
    () => {

        updateGradient();
    }
);

generateGradient.addEventListener(
    "click",
    updateGradient
);


randomGradient.addEventListener(
    "click",
    () => {

        const randomColor = () => {
            return "#" +
                Math.floor(
                    Math.random() * 16777215
                )
                .toString(16)
                .padStart(6, "0");
        };

        const color1 =
            randomColor();

        const color2 =
            randomColor();

        gradientColor1.value =
            color1;

        gradientColor2.value =
            color2;

        gradientHex1.value =
            color1;

        gradientHex2.value =
            color2;

        gradientAngle.value =
            Math.floor(
                Math.random() * 361
            );

        updateGradient();

        gradientStatus.textContent =
            " Random gradient generated.";
    }
);

copyGradientCSS.addEventListener(
    "click",
    async () => {

        try {
            await navigator.clipboard.writeText(
                gradientCSS.textContent
            );

            gradientStatus.textContent =
                "CSS copied to clipboard.";

        } catch (error) {
            gradientStatus.textContent =
                "Could not copy CSS.";
        }
    }
);

updateGradient();

updateGradient();