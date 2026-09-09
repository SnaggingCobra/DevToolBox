const barcodeText = document.getElementById("barcodeText");
const barcodeFormat = document.getElementById("barcodeFormat");
const generateBarcodeButton = document.getElementById("generateBarcode");
const downloadBarcodeButton = document.getElementById("downloadBarcode");
const barcode = document.getElementById("barcode");
const barcodeStatus = document.getElementById("barcodeStatus");

let barcodeLibraryPromise;

const formatDetails = {
    CODE128: {
        help: "CODE128 supports text and numbers.",
        example: "123456789",
        inputMode: "text"
    },
    CODE39: {
        help: "CODE39 supports capital letters, numbers, spaces, and - . $ / + %.",
        example: "DEVTOOL-123",
        inputMode: "text"
    },
    EAN13: {
        help: "Enter 12 digits; the check digit is added automatically. A 13-digit value must include a valid check digit.",
        example: "590123412345",
        inputMode: "numeric"
    },
    EAN8: {
        help: "Enter 7 digits; the check digit is added automatically. An 8-digit value must include a valid check digit.",
        example: "9638507",
        inputMode: "numeric"
    },
    UPC: {
        help: "Enter 11 digits; the check digit is added automatically. A 12-digit value must include a valid check digit.",
        example: "03600029145",
        inputMode: "numeric"
    },
    ITF14: {
        help: "Enter 13 digits; the check digit is added automatically. A 14-digit value must include a valid check digit.",
        example: "1234567890123",
        inputMode: "numeric"
    }
};

function updateFormatHelp(useExample = false) {
    if (!barcodeText || !barcodeFormat) return;

    const details = formatDetails[barcodeFormat.value];
    const help = document.getElementById("barcodeFormatHelp");
    if (help) help.textContent = details.help;
    barcodeText.placeholder = details.example;
    barcodeText.inputMode = details.inputMode;
    if (useExample) barcodeText.value = details.example;
}

function validateValue(value, format) {
    if (["EAN13", "EAN8", "UPC", "ITF14"].includes(format)) {
        const digits = value.replace(/[\s-]/g, "");
        const expectedLengths = { EAN13: [12, 13], EAN8: [7, 8], UPC: [11, 12], ITF14: [13, 14] };
        if (!/^\d+$/.test(digits) || !expectedLengths[format].includes(digits.length)) {
            const lengths = expectedLengths[format];
            throw new Error(`${format} needs ${lengths[0]} digits (check digit added) or ${lengths[1]} digits including the check digit.`);
        }
        return digits;
    }

    if (format === "CODE39") {
        const code39Value = value.toUpperCase();
        if (!/^[0-9A-Z\-. $/+%]+$/.test(code39Value)) {
            throw new Error("CODE39 only supports capital letters, numbers, spaces, and - . $ / + %.");
        }
        return code39Value;
    }

    return value;
}

function setStatus(message, isError = false) {
    if (!barcodeStatus) return;
    barcodeStatus.textContent = message;
    barcodeStatus.classList.toggle("is-error", isError);
}

function loadJsBarcode() {
    if (window.JsBarcode) return Promise.resolve(window.JsBarcode);
    if (barcodeLibraryPromise) return barcodeLibraryPromise;

    barcodeLibraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";
        script.async = true;
        script.onload = () => resolve(window.JsBarcode);
        script.onerror = () => reject(new Error("The barcode library could not be loaded."));
        document.head.appendChild(script);
    });

    return barcodeLibraryPromise;
}

async function generateBarcode() {
    if (!barcodeText || !barcodeFormat || !barcode) return;

    const originalValue = barcodeText.value.trim();
    const format = barcodeFormat.value;

    if (!originalValue) {
        barcode.replaceChildren();
        setStatus("Enter a value to generate a barcode.");
        return;
    }

    setStatus("Generating barcode…");
    try {
        const value = validateValue(originalValue, format);
        if (value !== barcodeText.value) barcodeText.value = value;
        const JsBarcode = await loadJsBarcode();
        barcode.replaceChildren();
        JsBarcode(barcode, value, {
            format,
            width: 2,
            height: 100,
            displayValue: true,
            margin: 10,
            background: "#ffffff"
        });
        setStatus("Barcode generated.");
    } catch (error) {
        barcode.replaceChildren();
        setStatus(error.message || "This value is not valid for the selected format.", true);
        console.error("Barcode generation error:", error);
    }
}

function downloadBarcode() {
    if (!barcode || !barcode.querySelector("rect, path")) {
        setStatus("Generate a barcode before downloading it.", true);
        return;
    }

    const svgData = new XMLSerializer().serializeToString(barcode);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const imageUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(imageUrl);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "barcode.png";
        link.click();
        setStatus("Barcode download started.");
    };
    image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        setStatus("Unable to prepare the barcode download.", true);
    };
    image.src = imageUrl;
}

generateBarcodeButton?.addEventListener("click", generateBarcode);
barcodeText?.addEventListener("input", generateBarcode);
barcodeFormat?.addEventListener("change", () => {
    updateFormatHelp(true);
    generateBarcode();
});
downloadBarcodeButton?.addEventListener("click", downloadBarcode);

updateFormatHelp();
generateBarcode();
