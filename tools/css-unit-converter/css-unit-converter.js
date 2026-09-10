const unitValue = document.getElementById("unitValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const baseFontSize = document.getElementById("baseFontSize");
const referenceValue = document.getElementById("referenceValue");
const conversionResult = document.getElementById("conversionResult");
const copyConversion = document.getElementById("copyConversion");
const swapUnits = document.getElementById("swapUnits");
const viewportSize = document.getElementById("viewportSize");

function getViewportInfo() {
    viewportSize.textContent = `${window.innerWidth}px x ${window.innerHeight}px`;

}

function toPixels(value, unit) {
    const base = Number(baseFontSize.value) || 16;
    const reference = Number(referenceValue.value) || 100;

    switch (unit) {
        case "px":
            return value;

        case "rem":
            return value * base;

        case "em":
            return value * base;

        case "%":
            return (value / 100) * reference;
        
        case "vw":
            return (value / 100) * window.innerWidth;

        case "vh":
            return (value / 100) * window.innerHeight;

        case "vmin":
            return (value / 100) * Math.min(window.innerWidth, window.innerHeight);

        case "vmax":
            return (value / 100) * Math.max(window.innerWidth, window.innerHeight);

        case "pt":
            return value * (96 / 72);
        
        default:
            return value;

    }

}

function fromPixels(value, unit) {
    const base = Number(baseFontSize.value) || 16;
    const reference = Number(referenceValue.value) || 100;

    switch (unit) {
        case "px":
            return value;

        case "rem":
            return value / base;

        case "em":
            return value * (72 / 96);

        default:
            return value;

        case "%":
            return (value / reference) * 100;

        case "vw":
            return (value / window.innerWidth) * 100;

        case "vh":
            return (value / window.innerHeight) * 100;
        
        case "vmin":
            return (value / Math.min(window.innerWidth, window.innerHeight)) * 100;

        case "vmax":
            return (value / Math.max(window.innerWidth, window.innerHeight)) * 100;
            
        case "pt":
            return value;


    }

}

function formatResult(value) {
    if(!Number.isFinite(value)) {
        return "Invalid Value";

    }

    return Number(value.toFixed(6)).toString();

}

function convertUnits() {
    const value = Number(unitValue.value);
   
    if (!Number.isFinite(value)) {
        conversionResult.value = "";
        return;

    }

    const pixels = toPixels(value, fromUnit.value);
    const result = fromPixels(pixels, toUnit.value);

        conversionResult.value = `${formatResult(result)} ${toUnit.value}`;

}

  swapUnits.addEventListener("click", () => {
    const currentFrom = fromUnit.value;

        fromUnit.value = toUnit.value;
        toUnit.value = currentFrom;

    convertUnits();
  });

  unitValue.addEventListener("input", convertUnits);
  fromUnit.addEventListener("change", convertUnits);
    toUnit.addEventListener("change", convertUnits);
  baseFontSize.addEventListener("input", convertUnits);
  referenceValue.addEventListener("input", convertUnits);

  copyConversion.addEventListener("click", async () => {
    if (!conversionResult.value) return;

    try {
        await navigator.clipboard.writeText(conversionResult.value);
        copyConversion.textContent = "copied";

        setTimeout(() => {
            copyConversion.textContent = "copy";

        }, 1000);

    } catch (error) {
        console.error("copy error", error);

    }

  });

  window.addEventListener("resize", () => {
    getViewportInfo();
    convertUnits();
  });

  getViewportInfo();
  convertUnits();
  