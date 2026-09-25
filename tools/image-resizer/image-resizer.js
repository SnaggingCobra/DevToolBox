
const resizeDropZone = document.getElementById("resizeDropZone");
const resizeImageInput = document.getElementById("resizeImageInput");
const resizeWorkspace = document.getElementById("resizeWorkspace");
const resizeOriginalPreview = document.getElementById("resizeOriginalPreview");
const resizeOutputPreview = document.getElementById("resizeOutputPreview");
const resizeOriginalInfo = document.getElementById("resizeOriginalInfo");
const resizeOutputInfo = document.getElementById("resizeOutputInfo");
const resizePreset = document.getElementById("resizePreset");
const resizeWidth = document.getElementById("resizeWidth");
const resizeHeight = document.getElementById("resizeHeight");
const resizeAspectLock = document.getElementById("resizeAspectLock");
const resizeAspectStatus = document.getElementById("resizeAspectStatus");
const resizeFitMode = document.getElementById("resizeFitMode");
const resizePercentage = document.getElementById("resizePercentage");
const resizePercentageValue = document.getElementById("resizePercentageValue");
const resizeOutputFormat = document.getElementById("resizeOutputFormat");
const resizeQuality = document.getElementById("resizeQuality");
const resizeQualityValue = document.getElementById("resizeQualityValue");
const resizeOriginalSize = document.getElementById("resizeOriginalSize");
const resizeOutputSize = document.getElementById("resizeOutputSize");
const resizeSizeChange = document.getElementById("resizeSizeChange");
const resizeButton = document.getElementById("resizeButton");
const resizeDownloadButton = document.getElementById("resizeDownloadButton");
const resizeResetButton = document.getElementById("resizeResetButton");
const resizeStatus = document.getElementById("resizeStatus");

let resizeFile = null;
let resizeImage = null;
let resizeBlob = null;
let resizeOriginalURL = null;
let resizeResultURL = null;
let resizeRatio = 1;
let resizeLocked = true;


function setResizeStatus(message) {
    resizeStatus.textContent = message;
}

function isSupportedResizeImageFile(file) {
    if (!file) return false;

    const mime = (file.type || "").toLowerCase();
    const extension = (file.name || "").split(".").pop()?.toLowerCase();

    const supportedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    return supportedTypes.includes(mime) ||
        ["jpg", "jpeg", "png", "webp"].includes(extension);
}

function formatResizeBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}


function loadResizeImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not load this image."));
        };

        image.src = url;
    });
}


async function handleResizeImage(file) {
    if (!file) return;

    if (!isSupportedResizeImageFile(file)) {
        setResizeStatus("Please select a JPG, PNG, or WebP image.");
        return;
    }

    if (file.size === 0) {
        setResizeStatus("The selected file is empty.");
        return;
    }

    setResizeStatus("Loading image...");

    try {
        const image = await loadResizeImage(file);

        clearResizeURLs();

        resizeFile = file;
        resizeImage = image;
        resizeBlob = null;

        resizeRatio = image.naturalWidth / image.naturalHeight;

        resizeOriginalURL = URL.createObjectURL(file);

        resizeOriginalPreview.src = resizeOriginalURL;
        resizeOutputPreview.removeAttribute("src");

        resizeWidth.value = image.naturalWidth;
        resizeHeight.value = image.naturalHeight;

        resizeOriginalInfo.textContent =
            `${image.naturalWidth} × ${image.naturalHeight} px`;

        resizeOutputInfo.textContent = "-";

        resizeOriginalSize.textContent =
            formatResizeBytes(file.size);

        resizeOutputSize.textContent = "-";
        resizeSizeChange.textContent = "-";

        resizePreset.value = "custom";
        resizePercentage.value = 100;
        resizePercentageValue.textContent = "100%";

        resizeWorkspace.hidden = false;
        resizeDownloadButton.disabled = true;

        setResizeStatus("Image loaded. Ready to resize.");

        await performResize();

    } catch (error) {
        console.error("Image loading error:", error);

        setResizeStatus("Unable to load this image.");
    }
}


function clampDimension(value) {
    return Math.min(
        12000,
        Math.max(1, Math.round(value))
    );
}


function updatePercentageDimensions() {
    if (!resizeImage) return;

    const percentage = Number(resizePercentage.value) / 100;

    resizeWidth.value = clampDimension(
        resizeImage.naturalWidth * percentage
    );

    resizeHeight.value = clampDimension(
        resizeImage.naturalHeight * percentage
    );

    resizePercentageValue.textContent =
        `${resizePercentage.value}%`;

    resizePreset.value = "custom";
}


resizePreset.addEventListener("change", () => {
    if (!resizeImage) return;

    if (resizePreset.value === "custom") {
        return;
    }

    const [width, height] =
        resizePreset.value.split("x").map(Number);

    resizeWidth.value = width;
    resizeHeight.value = height;

    resizePercentage.value = 100;
    resizePercentageValue.textContent = "100%";

    resizeRatio = width / height;

    performResize();
});

resizeWidth.addEventListener("input", () => {
    if (!resizeImage) return;

    const width = Number(resizeWidth.value);

    if (!Number.isFinite(width) || width <= 0) return;

    if (resizeLocked) {
        resizeHeight.value = clampDimension(width / resizeRatio);
    }

    resizePreset.value = "custom";
});

resizeWidth.addEventListener("change", () => {
    if (!resizeImage) return;

    const width = clampDimension(Number(resizeWidth.value));

    resizeWidth.value = width;

    if (resizeLocked) {
        resizeHeight.value = clampDimension(width / resizeRatio);
    }

    resizePercentage.value = 100;
    resizePercentageValue.textContent = "100%";

    performResize();
});


resizeHeight.addEventListener("input", () => {
    if (!resizeImage) return;

    const height = Number(resizeHeight.value);

    if (!Number.isFinite(height) || height <= 0) return;

    if (resizeLocked) {
        resizeWidth.value = clampDimension(height * resizeRatio);
    }

    resizePreset.value = "custom";
});

resizeHeight.addEventListener("change", () => {
    if (!resizeImage) return;

    const height = clampDimension(Number(resizeHeight.value));

    resizeHeight.value = height;

    if (resizeLocked) {
        resizeWidth.value = clampDimension(height * resizeRatio);
    }

    resizePercentage.value = 100;
    resizePercentageValue.textContent = "100%";

    performResize();
});


resizeAspectLock.addEventListener("click", () => {
    resizeLocked = !resizeLocked;

    resizeAspectLock.textContent =
        resizeLocked ? "🔒" : "🔓";

    resizeAspectLock.classList.toggle(
        "unlocked",
        !resizeLocked
    );

    resizeAspectLock.setAttribute(
        "aria-pressed",
        String(resizeLocked)
    );

    resizeAspectLock.title =
        resizeLocked ? "Unlock aspect ratio" : "Lock aspect ratio";

    resizeAspectStatus.textContent =
        resizeLocked ? "Aspect ratio locked" : "Aspect ratio unlocked";

    if (resizeLocked && resizeImage) {
        resizeRatio =
            Number(resizeWidth.value) / Number(resizeHeight.value);
    }
});


resizePercentage.addEventListener("input", () => {
    resizePercentageValue.textContent =
        `${resizePercentage.value}%`;

    updatePercentageDimensions();
});

resizePercentage.addEventListener("change", () => {
    if (resizeImage) {
        performResize();
    }
});


function getOutputDimensions() {
    let width = Number(resizeWidth.value);
    let height = Number(resizeHeight.value);

    if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width < 1 ||
        height < 1
    ) {
        throw new Error("Enter valid width and height values.");
    }

    width = clampDimension(width);
    height = clampDimension(height);

    const mode = resizeFitMode.value;

    if (mode === "fit") {
        const scale = Math.min(
            width / resizeImage.naturalWidth,
            height / resizeImage.naturalHeight
        );

        width = Math.max(
            1,
            Math.round(resizeImage.naturalWidth * scale)
        );

        height = Math.max(
            1,
            Math.round(resizeImage.naturalHeight * scale)
        );
    }

    return { width, height };
}


async function performResize() {
    if (!resizeImage || !resizeFile) {
        setResizeStatus("Please upload an image first.");
        return;
    }

    resizeButton.disabled = true;
    resizeDownloadButton.disabled = true;

    setResizeStatus("Resizing image...");

    try {
        const { width, height } = getOutputDimensions();

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas is not supported.");
        }

        const format = resizeOutputFormat.value;

        // Fill JPG background with white
        if (format === "image/jpeg") {
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, width, height);
        }

        if (resizeFitMode.value === "fill") {
            // Crop image to fill the requested dimensions
            const sourceWidth = resizeImage.naturalWidth;
            const sourceHeight = resizeImage.naturalHeight;

            const sourceRatio = sourceWidth / sourceHeight;
            const targetRatio = width / height;

            let sx = 0;
            let sy = 0;
            let sw = sourceWidth;
            let sh = sourceHeight;

            if (sourceRatio > targetRatio) {
                sw = sourceHeight * targetRatio;
                sx = (sourceWidth - sw) / 2;
            } else {
                sh = sourceWidth / targetRatio;
                sy = (sourceHeight - sh) / 2;
            }

            context.drawImage(
                resizeImage,
                sx, sy, sw, sh,
                0, 0, width, height
            );

        } else {
            // Stretch or fit
            context.drawImage(
                resizeImage,
                0,
                0,
                width,
                height
            );
        }

        const quality = Number(resizeQuality.value) / 100;

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                result => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(new Error("Image resizing failed."));
                    }
                },
                format,
                quality
            );
        });

        canvas.width = 0;
        canvas.height = 0;

        if (resizeResultURL) {
            URL.revokeObjectURL(resizeResultURL);
        }

        resizeBlob = blob;
        resizeResultURL = URL.createObjectURL(blob);

        resizeOutputPreview.src = resizeResultURL;

        resizeOutputInfo.textContent =
            `${width} × ${height} px`;

        resizeOutputSize.textContent =
            formatResizeBytes(blob.size);

        const difference =
            ((blob.size - resizeFile.size) / resizeFile.size) * 100;

        if (difference < 0) {
            resizeSizeChange.textContent =
                `${Math.abs(difference).toFixed(2)}% smaller`;
        } else if (difference > 0) {
            resizeSizeChange.textContent =
                `${difference.toFixed(2)}% larger`;
        } else {
            resizeSizeChange.textContent = "No size change";
        }

        resizeDownloadButton.disabled = false;

        setResizeStatus("Image resized successfully.");

    } catch (error) {
        console.error("Resize error:", error);

        setResizeStatus(
            error.message || "Unable to resize image."
        );

    } finally {
        resizeButton.disabled = false;
    }
}

resizeOutputFormat.addEventListener("change", () => {
    if (resizeImage) {
        performResize();
    }
});

resizeQuality.addEventListener("input", () => {
    resizeQualityValue.textContent =
        `${resizeQuality.value}%`;
});

resizeQuality.addEventListener("change", () => {
    if (resizeImage) {
        performResize();
    }
});


resizeFitMode.addEventListener("change", () => {
    if (resizeImage) {
        performResize();
    }
});


resizeButton.addEventListener("click", () => {
    performResize();
});


resizeDownloadButton.addEventListener("click", () => {
    if (!resizeBlob || !resizeResultURL) {
        setResizeStatus("Please resize the image first.");
        return;
    }

    const extensions = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp"
    };

    const originalName =
        resizeFile.name.replace(/\.[^/.]+$/, "");

    const filename =
        `${originalName}-resized.${extensions[resizeOutputFormat.value]}`;

    const link = document.createElement("a");

    link.href = resizeResultURL;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setResizeStatus("Download started.");
});


function clearResizeURLs() {
    if (resizeOriginalURL) {
        URL.revokeObjectURL(resizeOriginalURL);
        resizeOriginalURL = null;
    }

    if (resizeResultURL) {
        URL.revokeObjectURL(resizeResultURL);
        resizeResultURL = null;
    }
}

resizeResetButton.addEventListener("click", () => {
    clearResizeURLs();

    resizeFile = null;
    resizeImage = null;
    resizeBlob = null;

    resizeOriginalPreview.removeAttribute("src");
    resizeOutputPreview.removeAttribute("src");

    resizeOriginalInfo.textContent = "-";
    resizeOutputInfo.textContent = "-";

    resizeOriginalSize.textContent = "-";
    resizeOutputSize.textContent = "-";
    resizeSizeChange.textContent = "-";

    resizeWidth.value = "";
    resizeHeight.value = "";

    resizePreset.value = "custom";

    resizePercentage.value = 100;
    resizePercentageValue.textContent = "100%";

    resizeQuality.value = 90;
    resizeQualityValue.textContent = "90%";

    resizeOutputFormat.value = "image/png";
    resizeFitMode.value = "stretch";

    resizeLocked = true;
    resizeRatio = 1;

    resizeAspectLock.textContent = "🔒";
    resizeAspectLock.classList.remove("unlocked");
    resizeAspectLock.setAttribute("aria-pressed", "true");

    resizeAspectStatus.textContent = "Aspect ratio locked";

    resizeWorkspace.hidden = true;
    resizeDownloadButton.disabled = true;

    resizeImageInput.value = "";

    setResizeStatus("Ready. Select an image to begin.");
});

resizeImageInput.addEventListener("change", event => {
    const file = event.target.files[0];

    handleResizeImage(file);

    resizeImageInput.value = "";
});


resizeDropZone.addEventListener("dragover", event => {
    event.preventDefault();

    resizeDropZone.classList.add("drag-over");
});

resizeDropZone.addEventListener("dragleave", event => {
    event.preventDefault();

    resizeDropZone.classList.remove("drag-over");
});

resizeDropZone.addEventListener("drop", event => {
    event.preventDefault();

    resizeDropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    handleResizeImage(file);
});

setResizeStatus("Ready. Select an image to begin.");