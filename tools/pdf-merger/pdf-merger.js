
(() => {
    const uploadArea = document.getElementById("pdfUploadArea");
    const fileInput = document.getElementById("pdfFileInput");
    const browseBtn = document.getElementById("pdfBrowseBtn");
    const fileList = document.getElementById("pdfFileList");
    const fileCount = document.getElementById("pdfFileCount");
    const totalSize = document.getElementById("pdfTotalSize");
    const mergeBtn = document.getElementById("pdfMergeBtn");
    const clearBtn = document.getElementById("pdfClearBtn");
    const status = document.getElementById("pdfStatus");

    if (!uploadArea || !fileInput || !fileList || !mergeBtn) {
        console.error("PDF Merger: Required HTML elements were not found.");
        return;
    }

    let files = [];
    let isMerging = false;

    // Load pdf-lib from CDN if it is not already available.
    function loadPdfLib() {
        if (window.PDFLib) {
            return Promise.resolve(window.PDFLib);
        }

        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(
                'script[data-pdf-lib="true"]'
            );

            if (existingScript) {
                existingScript.addEventListener("load", () => {
                    if (window.PDFLib) resolve(window.PDFLib);
                    else reject(new Error("PDF library failed to initialize."));
                }, { once: true });

                existingScript.addEventListener("error", () => {
                    reject(new Error("Could not load the PDF library."));
                }, { once: true });

                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
            script.dataset.pdfLib = "true";

            script.onload = () => {
                if (window.PDFLib) {
                    resolve(window.PDFLib);
                } else {
                    reject(new Error("PDF library failed to initialize."));
                }
            };

            script.onerror = () => {
                reject(new Error("Could not load pdf-lib. Check your internet connection."));
            };

            document.head.appendChild(script);
        });
    }

    function formatSize(bytes) {
        if (bytes === 0) return "0 B";

        const units = ["B", "KB", "MB", "GB"];
        const index = Math.min(
            Math.floor(Math.log(bytes) / Math.log(1024)),
            units.length - 1
        );

        return (
            (bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2) +
            " " +
            units[index]
        );
    }

    function showStatus(message, type = "info") {
        status.textContent = message;
        status.className = "pdf-status " + type;
    }

    function clearStatus() {
        status.textContent = "";
        status.className = "pdf-status";
    }

    function isPdf(file) {
        return (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        );
    }

    function addFiles(selectedFiles) {
        if (isMerging) return;

        let added = 0;
        let rejected = 0;

        for (const file of selectedFiles) {
            if (!isPdf(file)) {
                rejected++;
                continue;
            }

            // Avoid adding the same file twice.
            const duplicate = files.some(
                item =>
                    item.file.name === file.name &&
                    item.file.size === file.size &&
                    item.file.lastModified === file.lastModified
            );

            if (duplicate) continue;

            files.push({
                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + "-" + Math.random(),
                file
            });

            added++;
        }

        renderFiles();

        if (rejected > 0) {
            showStatus(
                `${rejected} non-PDF file(s) were skipped.`,
                "error"
            );
        } else if (added > 0) {
            clearStatus();
        }
    }

    function renderFiles() {
        fileList.innerHTML = "";

        if (files.length === 0) {
            const empty = document.createElement("div");
            empty.className = "pdf-empty-state";
            empty.textContent = "No PDF files selected yet.";
            fileList.appendChild(empty);
        }

        files.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "pdf-file-item";

            const number = document.createElement("div");
            number.className = "pdf-file-number";
            number.textContent = index + 1;

            const info = document.createElement("div");
            info.className = "pdf-file-info";

            const name = document.createElement("div");
            name.className = "pdf-file-name";
            name.textContent = item.file.name;

            const size = document.createElement("div");
            size.className = "pdf-file-size";
            size.textContent = formatSize(item.file.size);

            info.append(name, size);

            const controls = document.createElement("div");
            controls.className = "pdf-file-controls";

            const upBtn = document.createElement("button");
            upBtn.type = "button";
            upBtn.className = "pdf-icon-btn";
            upBtn.textContent = "↑";
            upBtn.title = "Move up";
            upBtn.setAttribute("aria-label", "Move " + item.file.name + " up");
            upBtn.disabled = index === 0 || isMerging;

            upBtn.addEventListener("click", () => {
                if (index > 0 && !isMerging) {
                    [files[index - 1], files[index]] =
                        [files[index], files[index - 1]];
                    renderFiles();
                }
            });

            const downBtn = document.createElement("button");
            downBtn.type = "button";
            downBtn.className = "pdf-icon-btn";
            downBtn.textContent = "↓";
            downBtn.title = "Move down";
            downBtn.setAttribute("aria-label", "Move " + item.file.name + " down");
            downBtn.disabled = index === files.length - 1 || isMerging;

            downBtn.addEventListener("click", () => {
                if (index < files.length - 1 && !isMerging) {
                    [files[index + 1], files[index]] =
                        [files[index], files[index + 1]];
                    renderFiles();
                }
            });

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "pdf-icon-btn pdf-remove-btn";
            removeBtn.textContent = "×";
            removeBtn.title = "Remove file";
            removeBtn.setAttribute(
                "aria-label",
                "Remove " + item.file.name
            );
            removeBtn.disabled = isMerging;

            removeBtn.addEventListener("click", () => {
                if (isMerging) return;

                files = files.filter(file => file.id !== item.id);
                renderFiles();
                clearStatus();
            });

            controls.append(upBtn, downBtn, removeBtn);
            row.append(number, info, controls);
            fileList.appendChild(row);
        });

        fileCount.textContent =
            files.length + (files.length === 1 ? " file" : " files");

        const total = files.reduce(
            (sum, item) => sum + item.file.size,
            0
        );

        totalSize.textContent = formatSize(total);

        mergeBtn.disabled = files.length < 2 || isMerging;
        clearBtn.disabled = files.length === 0 || isMerging;
        browseBtn.disabled = isMerging;
        fileInput.disabled = isMerging;
    }

    browseBtn.addEventListener("click", () => {
        if (!isMerging) fileInput.click();
    });

    fileInput.addEventListener("change", event => {
        addFiles(Array.from(event.target.files || []));
        // Allow selecting the same file again after removing it.
        fileInput.value = "";
    });

    // Drag and drop support.
    ["dragenter", "dragover"].forEach(eventName => {
        uploadArea.addEventListener(eventName, event => {
            event.preventDefault();
            event.stopPropagation();

            if (!isMerging) {
                uploadArea.classList.add("drag-over");
            }
        });
    });

    ["dragleave", "drop"].forEach(eventName => {
        uploadArea.addEventListener(eventName, event => {
            event.preventDefault();
            event.stopPropagation();
            uploadArea.classList.remove("drag-over");
        });
    });

    uploadArea.addEventListener("drop", event => {
        if (!isMerging && event.dataTransfer) {
            addFiles(Array.from(event.dataTransfer.files || []));
        }
    });

    clearBtn.addEventListener("click", () => {
        if (isMerging) return;

        files = [];
        fileInput.value = "";
        renderFiles();
        clearStatus();
    });

    mergeBtn.addEventListener("click", async () => {
        if (files.length < 2 || isMerging) return;

        isMerging = true;
        renderFiles();

        mergeBtn.textContent = "Merging...";
        showStatus("Loading PDF library...", "info");

        try {
            const { PDFDocument } = await loadPdfLib();
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const item = files[i];

                showStatus(
                    `Processing ${i + 1} of ${files.length}: ${item.file.name}`,
                    "info"
                );

                const bytes = await item.file.arrayBuffer();

                const sourcePdf = await PDFDocument.load(bytes);
                const copiedPages = await mergedPdf.copyPages(
                    sourcePdf,
                    sourcePdf.getPageIndices()
                );

                copiedPages.forEach(page => {
                    mergedPdf.addPage(page);
                });
            }

            showStatus("Preparing merged PDF...", "info");

            const mergedBytes = await mergedPdf.save();

            const blob = new Blob([mergedBytes], {
                type: "application/pdf"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "merged-document.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 60000);

            showStatus(
                `Successfully merged ${files.length} PDF files! Your download should begin automatically.`,
                "success"
            );
        } catch (error) {
            console.error("PDF Merger error:", error);

            let message = error.message || "An unknown error occurred.";

            if (
                message.toLowerCase().includes("encrypt") ||
                message.toLowerCase().includes("password")
            ) {
                message =
                    "One of your PDFs may be password-protected. Remove its password and try again.";
            }

            showStatus("Failed to merge PDFs: " + message, "error");
        } finally {
            isMerging = false;
            mergeBtn.textContent = "Merge PDFs";
            renderFiles();
        }
    });

    renderFiles();
})();