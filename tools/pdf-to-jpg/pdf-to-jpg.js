
const pdfFile = document.getElementById("pdfFile");
const selectPdf = document.getElementById("selectPdf");
const pdfDropZone = document.getElementById("pdfDropZone");
const pdfFileInfo = document.getElementById("pdfFileInfo");

const jpgQuality = document.getElementById("jpgQuality");
const qualityValue = document.getElementById("qualityValue");
const convertPdf = document.getElementById("convertPdf");

const pdfProgress = document.getElementById("pdfProgress");
const pdfProgressText = document.getElementById("pdfProgressText");
const pdfProgressBar = document.getElementById("pdfProgressBar");

const pdfPageGrid = document.getElementById("pdfPageGrid");
const downloadAll = document.getElementById("downloadAll");

let selectedFile = null;
let convertedImages = [];
let pdfjsLib = null;
let librariesReady = false;
let isConverting = false;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = src;
        script.onload = resolve;
        script.onerror = () => {
            script.remove();
            reject(new Error("Failed to load library: " + src));
        };

        document.head.appendChild(script);
    });
}

async function loadLibraries() {
    if (librariesReady) return;

    convertPdf.disabled = true;
    convertPdf.textContent = "Loading libraries...";

    try {
        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        );

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        );

        pdfjsLib = window.pdfjsLib;

        if (!pdfjsLib || !window.JSZip) {
            throw new Error("Required libraries are unavailable.");
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        librariesReady = true;

        convertPdf.textContent = "Convert to JPG";
        convertPdf.disabled = !selectedFile;

    } catch (error) {
        console.error(error);

        convertPdf.textContent = "Library loading failed";
        pdfFileInfo.textContent =
            "Could not load libraries. Check your internet connection and reopen the tool.";
    }
}


jpgQuality.addEventListener("input", () => {
    qualityValue.textContent = jpgQuality.value + "%";

});

selectPdf.addEventListener("click", () => {
    pdfFile.click();

});

pdfFile.addEventListener("change", () => {
    if (pdfFile.files.length > 0) {
        handleFile(pdfFile.files[0]);

    }
});

function handleFile(file) {
    if (isConverting) return;

    if(file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        pdfFileInfo.textContent = "please select a valid pdf file";
        return;

    }

    selectedFile = file;
    pdfFileInfo.textContent = file.name + "(" + (file.size / (1024 * 1024)).toFixed(2) + "MB";
    convertPdf.disabled = !librariesReady;



    convertedImages = [];
    pdfPageGrid.innerHTML = '<p class="pdf-empty">Ready to convert Your PDF</p>';

    downloadAll.disabled = true;

}


pdfDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    pdfDropZone.classList.add("drag-over");
});

pdfDropZone.addEventListener("dragleave", () => {
    pdfDropZone.classList.remove("drag-over");
});

pdfDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    pdfDropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (file) {
        handleFile(file);
    }
});


convertPdf.addEventListener("click", async () => {
    if (!selectedFile || !librariesReady || isConverting) return;

    isConverting = true;
    convertPdf.disabled = true;
    downloadAll.disabled = true;

    pdfProgress.hidden = false;
    pdfProgressBar.value = 0;
    pdfProgressText.textContent = "Reading PDF...";

    pdfPageGrid.innerHTML = "";
    convertedImages = [];

    let pdf = null;

    try {
        const arrayBuffer = await selectedFile.arrayBuffer();

        pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer)
        }).promise;

        const totalPages = pdf.numPages;
        const quality = Number(jpgQuality.value) / 100;

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            pdfProgressText.textContent =
                `Converting page ${pageNumber} of ${totalPages}...`;

            const page = await pdf.getPage(pageNumber);


            const viewport = page.getViewport({ scale: 2 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(
                    result => {
                        if (result) resolve(result);
                        else reject(new Error("JPG conversion failed."));
                    },
                    "image/jpeg",
                    quality
                );
            });

            const imageUrl = URL.createObjectURL(blob);

            convertedImages.push({
                name: `page-${pageNumber}.jpg`,
                blob: blob,
                url: imageUrl
            });

            addPageCard(pageNumber, imageUrl, blob.size);

            pdfProgressBar.value =
                (pageNumber / totalPages) * 100;


            canvas.width = 0;
            canvas.height = 0;

            page.cleanup();
        }

        downloadAll.disabled = convertedImages.length === 0;

        pdfProgressText.textContent =
            `Successfully converted ${totalPages} pages!`;

    } catch (error) {
        console.error(error);

        pdfProgressText.textContent =
            "Conversion failed: " + error.message;

    } finally {
        if (pdf) {
            await pdf.destroy();
        }

        isConverting = false;
        convertPdf.disabled = !selectedFile || !librariesReady;
        convertPdf.textContent = "Convert to JPG";
    }
});


function addPageCard(pageNumber, imageUrl, fileSize) {
    const card = document.createElement("div");
    card.className = "pdf-page-card";

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `PDF page ${pageNumber}`;

    const info = document.createElement("div");
    info.className = "pdf-page-card-info";

    const heading = document.createElement("h4");
    heading.textContent =
        `Page ${pageNumber} · ${(fileSize / 1024).toFixed(1)} KB`;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `page-${pageNumber}.jpg`;
    link.textContent = "Download JPG";

    info.append(heading, link);
    card.append(image, info);

    pdfPageGrid.appendChild(card);
}


downloadAll.addEventListener("click", async () => {
    if (!convertedImages.length) return;

    downloadAll.disabled = true;
    downloadAll.textContent = "Creating ZIP...";

    try {
        const zip = new window.JSZip();

        convertedImages.forEach(image => {
            zip.file(image.name, image.blob);
        });

        const zipBlob = await zip.generateAsync({
            type: "blob"
        });

        const zipUrl = URL.createObjectURL(zipBlob);

        const link = document.createElement("a");
        link.href = zipUrl;
        link.download = "converted-pages.zip";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);

    } catch (error) {
        console.error(error);
        alert("Could not create ZIP: " + error.message);

    } finally {
        downloadAll.disabled = false;
        downloadAll.textContent = "Download All (ZIP)";
    }
});


function clearConvertedImages() {
    convertedImages.forEach(image => {
        URL.revokeObjectURL(image.url);
    });

    convertedImages = [];
}


loadLibraries();