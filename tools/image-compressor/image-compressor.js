
const dropZone = document.getElementById("dropZone");
const imageInput = document.getElementById("imageInput");
const imageWorkspace = document.getElementById("imageWorkspace");
const originalPreview = document.getElementById("originalPreview");
const compressedPreview = document.getElementById("compressedPreview");
const originalInfo = document.getElementById("originalInfo");
const compressedInfo = document.getElementById("compressedInfo");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const outputFormat = document.getElementById("outputFormat");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const compressionPercent = document.getElementById("compressionPercent");
const compressButton = document.getElementById("compressButton");
const downloadButton = document.getElementById("downloadButton");
const resetButton = document.getElementById("resetButton");
const compressionStatus = document.getElementById("compressionStatus");

let originalFile = null;
let originalImage = null;
let compressedBlob = null;
let originalURL = null;
let compressedURL = null;


function setStatus(message) {
    compressionStatus.textContent = message;
}

function isSupportedImageFile(file) {
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

function formatBytes(bytes) {
    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}


function loadImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        const imageURL = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(imageURL);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(imageURL);
            reject(new Error("Unable to load this image."));
        };

        image.src = imageURL;
    });
}


async function handleImage(file) {
    if (!file) {
        return;
    }

    if (!isSupportedImageFile(file)) {
        setStatus("Please select a JPG, PNG, or WebP image.");
        return;
    }

    if (file.size === 0) {
        setStatus("The selected file is empty.");
        return;
    }

    setStatus("Loading image...");

    try {
        const image = await loadImage(file);

        if (originalURL) {
            URL.revokeObjectURL(originalURL);
        }

        if (compressedURL) {
            URL.revokeObjectURL(compressedURL);
        }

        originalFile = file;
        originalImage = image;
        compressedBlob = null;

        originalURL = URL.createObjectURL(file);
        compressedURL = null;

        originalPreview.src = originalURL;
        compressedPreview.removeAttribute("src");

        originalInfo.textContent =
            `${image.naturalWidth} × ${image.naturalHeight}`;

        compressedInfo.textContent = "-";

        originalSize.textContent = formatBytes(file.size);
        compressedSize.textContent = "-";
        compressionPercent.textContent = "-";

        downloadButton.disabled = true;

        imageWorkspace.hidden = false;

        setStatus("Image loaded. Ready to compress.");

        await compressImage();

    } catch (error) {
        console.error("Image loading error:", error);

        setStatus("Could not load the image. Try another file.");
    }
}


async function compressImage() {
    if (!originalFile || !originalImage) {
        setStatus("Please upload an image first.");
        return;
    }

    compressButton.disabled = true;
    downloadButton.disabled = true;

    setStatus("Compressing image...");

    try {
        const canvas = document.createElement("canvas");

        canvas.width = originalImage.naturalWidth;
        canvas.height = originalImage.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas is not supported by this browser.");
        }

        const format = outputFormat.value;

        if (format === "image/jpeg") {
            context.fillStyle = "#FFFFFF";

            context.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }

        context.drawImage(
            originalImage,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const qualityValueNumber =
            Number(quality.value) / 100;

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(
                            new Error("Image compression failed.")
                        );
                    }
                },
                format,
                qualityValueNumber
            );
        });

        canvas.width = 0;
        canvas.height = 0;

        if (compressedURL) {
            URL.revokeObjectURL(compressedURL);
        }

        compressedBlob = blob;
        compressedURL = URL.createObjectURL(blob);

        compressedPreview.src = compressedURL;

        compressedInfo.textContent =
            `${originalImage.naturalWidth} × ${originalImage.naturalHeight}`;

        compressedSize.textContent =
            formatBytes(blob.size);

        // Calculate size reduction
        const reduction =
            ((originalFile.size - blob.size) / originalFile.size) * 100;

        if (reduction >= 0) {
            compressionPercent.textContent =
                `${reduction.toFixed(2)}% smaller`;
        } else {
            compressionPercent.textContent =
                `${Math.abs(reduction).toFixed(2)}% larger`;
        }

        downloadButton.disabled = false;

        if (blob.size < originalFile.size) {
            setStatus("Compression complete!");
        } else if (blob.size > originalFile.size) {
            setStatus(
                "The output is larger than the original. Try a lower quality or another format."
            );
        } else {
            setStatus("Compression complete. File size is unchanged.");
        }

    } catch (error) {
        console.error("Compression error:", error);

        setStatus(
            error.message || "Unable to compress this image."
        );

    } finally {
        compressButton.disabled = false;
    }
}

quality.addEventListener("input", () => {
    qualityValue.textContent = `${quality.value}%`;
});


compressButton.addEventListener("click", () => {
    compressImage();
});


outputFormat.addEventListener("change", () => {
    if (originalFile) {
        compressImage();
    }
});


quality.addEventListener("change", () => {
    if (originalFile) {
        compressImage();
    }
});


downloadButton.addEventListener("click", () => {
    if (!compressedBlob || !compressedURL) {
        setStatus("Please compress an image first.");
        return;
    }

    const extensionMap = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
    };

    const extension =
        extensionMap[outputFormat.value];

    const originalName =
        originalFile.name.replace(/\.[^/.]+$/, "");

    const filename =
        `${originalName}-compressed.${extension}`;

    const link = document.createElement("a");

    link.href = compressedURL;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    link.remove();

    setStatus("Download started.");
});


dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();

    dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", (event) => {
    event.preventDefault();

    dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();

    dropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    handleImage(file);
});


imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    handleImage(file);

    imageInput.value = "";
});

resetButton.addEventListener("click", () => {
    if (originalURL) {
        URL.revokeObjectURL(originalURL);
    }

    if (compressedURL) {
        URL.revokeObjectURL(compressedURL);
    }

    originalFile = null;
    originalImage = null;
    compressedBlob = null;

    originalURL = null;
    compressedURL = null;

    originalPreview.removeAttribute("src");
    compressedPreview.removeAttribute("src");

    originalInfo.textContent = "-";
    compressedInfo.textContent = "-";

    originalSize.textContent = "-";
    compressedSize.textContent = "-";
    compressionPercent.textContent = "-";

    quality.value = 80;
    qualityValue.textContent = "80%";

    outputFormat.value = "image/webp";

    imageInput.value = "";

    imageWorkspace.hidden = true;

    downloadButton.disabled = true;

    setStatus("Ready. Select an image to begin.");
});


setStatus("Ready. Select an image to begin.");