const ocrFileInput = document.getElementById("ocrFileInput");
const ocrBrowseBtn = document.getElementById("ocrBrowseBtn");
const ocrUploadArea = document.getElementById("ocrUploadArea");
const ocrPreviewSection = document.getElementById("ocrPreviewSection");
const ocrImagePreview = document.getElementById("ocrImagePreview");
const ocrRemoveImage = document.getElementById("ocrRemoveImage");
const ocrExtractBtn = document.getElementById("ocrExtractBtn");
const ocrProgress = document.getElementById("ocrProgress");
const ocrResultSection = document.getElementById("ocrResultSection");
const ocrResult = document.getElementById("ocrResult");
const ocrCopyBtn = document.getElementById("ocrCopyBtn");

let selectedImage = null;
let previewUrl = null;
let tesseractPromise = null;

function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (!tesseractPromise) {
        tesseractPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
            script.onload = () => resolve(window.Tesseract);
            script.onerror = () => reject(new Error("Could not load the OCR engine"));
            document.head.appendChild(script);
        });
    }
    return tesseractPromise;
}

ocrBrowseBtn.addEventListener("click", () => {
    ocrFileInput.click();
});

ocrFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        loadImage(file);

    }
});

function loadImage(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please select an Image File.");
        return;
    }

    selectedImage = file;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    ocrImagePreview.src = previewUrl;
    ocrPreviewSection.hidden = false;
    ocrResultSection.hidden = true;
    ocrProgress.hidden = true;

    ocrResult.value = "";
}


ocrRemoveImage.addEventListener("click", () => {
    selectedImage = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;

    ocrFileInput.value = "";
    ocrImagePreview.src = "";

    ocrPreviewSection.hidden = true;
    ocrResultSection.hidden = true;

    ocrResult.value = "";

});

ocrExtractBtn.addEventListener("click", async () => {
    if (!selectedImage) {
        alert("Please select an Image First");
        return;
    }

    ocrExtractBtn.disabled = true;
    ocrProgress.hidden = false;
    ocrProgress.textContent = "Extracting Text.....";

    try {
        const Tesseract = await loadTesseract();
        const result = await Tesseract.recognize(
            selectedImage,
            "eng",
            {
                logger: (info) => {
                    if (info.status === "recognizing text") {

                        const progress = Math.round(
                            info.progress * 100
                        );

                        ocrProgress.textContent = `Extracting text... ${progress}%`;

                    }
                }
            }
        );
    
        ocrResult.value = result.data.text.trim();

        ocrResultSection.hidden = false;

        if (!ocrResult.value) {
            ocrResult.value = "no text Found in the image"
        }

        ocrProgress.textContent = "Text extracted successfully";

    }

    catch (error) {

        console.error(error);

        ocrResult.value = "Something went wrong while Extracting";

        ocrResultSection.hidden = false;
        ocrProgress.textContent = error.message || "OCR failed";

    }

    finally {
        ocrExtractBtn.disabled = false;

    }
});

ocrCopyBtn.addEventListener("click", async () => {
    if (!ocrResult.value) {
        return;

    }

    try {
        await navigator.clipboard.writeText(ocrResult.value);

        ocrCopyBtn.textContent = "Copied";

        setTimeout(() => {
            ocrCopyBtn.textContent = "Copy Text";

        }, 1500);


    }
    catch (error) {
        console.error(error);
        ocrResult.select();
        document.execCommand("copy");
        ocrCopyBtn.textContent = "Copied";

        setTimeout(() => {
            ocrCopyBtn.textContent = "Copy Text";

        }, 1500);

    }









    


});



