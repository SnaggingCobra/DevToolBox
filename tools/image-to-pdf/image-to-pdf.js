
const itpFileInput = document.getElementById("itpFileInput");
const itpBrowseButton = document.getElementById("itpBrowseButton");
const itpAddMoreButton = document.getElementById("itpAddMoreButton");
const itpDropZone = document.getElementById("itpDropZone");
const itpWorkspace = document.getElementById("itpWorkspace");
const itpImageList = document.getElementById("itpImageList");
const itpImageCount = document.getElementById("itpImageCount");
const itpResetButton = document.getElementById("itpResetButton");
const itpConvertButton = document.getElementById("itpConvertButton");
const itpDownloadButton = document.getElementById("itpDownloadButton");
const itpStatus = document.getElementById("itpStatus");
const itpQuality = document.getElementById("itpPdfQuality");
const itpQualityValue = document.getElementById("itpQualityValue");
const itpResult = document.getElementById("itpResult");
const itpPdfInfo = document.getElementById("itpPdfInfo");

let itpImages = [];
let itpDraggedIndex = null;
let itpPdfUrl = null;
let itpConverting = false;

function clearGeneratedPdf() {
  if (itpPdfUrl) URL.revokeObjectURL(itpPdfUrl);
  itpPdfUrl = null;
  itpDownloadButton.disabled = true;
  itpResult.hidden = true;
}

function createPdfBlob(pages) {
  const encoder = new TextEncoder();
  const chunks = [];
  const objectOffsets = [0];
  let byteLength = 0;

  const append = bytes => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };
  const appendText = text => append(encoder.encode(text));
  const appendObject = (id, parts) => {
    objectOffsets[id] = byteLength;
    appendText(`${id} 0 obj\n`);
    parts.forEach(part => typeof part === "string" ? appendText(part) : append(part));
    appendText("\nendobj\n");
  };

  const pageObjectIds = pages.map((page, index) => 3 + index * 3);
  const finalObjectId = 2 + pages.length * 3;
  append(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));
  appendObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  appendObject(2, [`<< /Type /Pages /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`]);

  pages.forEach((page, index) => {
    const pageId = pageObjectIds[index];
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const pageWidth = page.widthMm * 72 / 25.4;
    const pageHeight = page.heightMm * 72 / 25.4;
    const content = encoder.encode(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ`);

    appendObject(pageId, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`]);
    appendObject(imageId, [
      `<< /Type /XObject /Subtype /Image /Width ${page.pixelWidth} /Height ${page.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`,
      page.jpeg,
      "\nendstream"
    ]);
    appendObject(contentId, [`<< /Length ${content.length} >>\nstream\n`, content, "\nendstream"]);
  });

  const xrefOffset = byteLength;
  appendText(`xref\n0 ${finalObjectId + 1}\n0000000000 65535 f \n`);
  for (let id = 1; id <= finalObjectId; id++) {
    appendText(`${String(objectOffsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  appendText(`trailer\n<< /Size ${finalObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks, { type: "application/pdf" });
}

itpBrowseButton.addEventListener("click", () => itpFileInput.click());
itpAddMoreButton.addEventListener("click", () => itpFileInput.click());

itpFileInput.addEventListener("change", event => {
  addImages(event.target.files);
  itpFileInput.value = "";
});

function addImages(files) {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const selectedFiles = Array.from(files);
  const validFiles = selectedFiles.filter(file => validTypes.includes(file.type));

  if (validFiles.length === 0) {
    itpStatus.textContent = "Please select JPG, PNG, or WebP images.";
    return;
  }

  validFiles.forEach(file => {
    itpImages.push({
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    });
  });

  clearGeneratedPdf();
  renderImages();
  itpStatus.textContent = `${validFiles.length} image(s) added successfully.`;
}

function renderImages() {
  itpImageList.replaceChildren(itpAddMoreButton);

  itpImages.forEach((image, index) => {
    const item = document.createElement("div");
    item.className = "itp-image-item";
    item.draggable = true;
    item.dataset.index = index;

    const preview = document.createElement("img");
    preview.className = "itp-image-preview";
    preview.src = image.url;
    preview.alt = image.name;

    const info = document.createElement("div");
    info.className = "itp-image-info";

    const name = document.createElement("span");
    name.className = "itp-image-name";
    name.textContent = `${index + 1}. ${image.name}`;
    name.title = image.name;

    const removeButton = document.createElement("button");
    removeButton.className = "itp-remove-image";
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => removeImage(index));

    info.append(name, removeButton);
    item.append(preview, info);

    item.addEventListener("dragstart", () => {
      itpDraggedIndex = index;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.addEventListener("dragover", event => event.preventDefault());
    item.addEventListener("drop", event => {
      event.preventDefault();
      const targetIndex = Number(item.dataset.index);
      if (itpDraggedIndex === null || itpDraggedIndex === targetIndex) return;
      const [draggedImage] = itpImages.splice(itpDraggedIndex, 1);
      itpImages.splice(targetIndex, 0, draggedImage);
      itpDraggedIndex = null;
      clearGeneratedPdf();
      renderImages();
    });

    itpImageList.appendChild(item);
  });

  itpImageCount.textContent = `${itpImages.length} image(s)`;
  itpWorkspace.hidden = itpImages.length === 0;
  itpDropZone.hidden = itpImages.length > 0;
}

function removeImage(index) {
  const [image] = itpImages.splice(index, 1);
  if (image) URL.revokeObjectURL(image.url);
  clearGeneratedPdf();
  renderImages();
  itpStatus.textContent = "Image removed.";
}

itpDropZone.addEventListener("dragover", event => {
  event.preventDefault();
  itpDropZone.classList.add("drag-over");
});
itpDropZone.addEventListener("dragleave", () => itpDropZone.classList.remove("drag-over"));
itpDropZone.addEventListener("drop", event => {
  event.preventDefault();
  itpDropZone.classList.remove("drag-over");
  addImages(event.dataTransfer.files);
});

itpQuality.addEventListener("input", () => {
  itpQualityValue.textContent = `${itpQuality.value}%`;
  clearGeneratedPdf();
});

const itpSettings = ["itpPageSize", "itpOrientation", "itpMargin", "itpImageFit", "itpPdfName"];
itpSettings.forEach(id => {
  document.getElementById(id).addEventListener("input", clearGeneratedPdf);
});

itpConvertButton.addEventListener("click", async () => {
  if (!itpImages.length || itpConverting) return;

  itpConverting = true;
  itpConvertButton.disabled = true;
  itpDownloadButton.disabled = true;
  itpStatus.textContent = "Creating PDF...";
  clearGeneratedPdf();

  try {
    const pageSize = document.getElementById("itpPageSize").value;
    const requestedOrientation = document.getElementById("itpOrientation").value;
    const margin = Number(document.getElementById("itpMargin").value);
    const imageFit = document.getElementById("itpImageFit").value;
    const quality = Number(itpQuality.value) / 100;
    const pdfPages = [];

    for (let index = 0; index < itpImages.length; index++) {
      const image = await createImageBitmap(itpImages[index].file);
      let pageWidth;
      let pageHeight;

      if (pageSize === "fit") {
        pageWidth = image.width * 25.4 / 150;
        pageHeight = image.height * 25.4 / 150;
        if (requestedOrientation === "landscape" && pageWidth < pageHeight) {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        } else if (requestedOrientation === "portrait" && pageWidth > pageHeight) {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
      } else {
        [pageWidth, pageHeight] = {
          a4: [210, 297],
          letter: [215.9, 279.4],
          legal: [215.9, 355.6]
        }[pageSize];
        if (requestedOrientation === "landscape") {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
      }

      const canvasScale = Math.min(150 / 25.4, 3000 / Math.max(pageWidth, pageHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(pageWidth * canvasScale));
      canvas.height = Math.max(1, Math.round(pageHeight * canvasScale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const inset = margin * canvasScale;
      const availableWidth = Math.max(1, canvas.width - inset * 2);
      const availableHeight = Math.max(1, canvas.height - inset * 2);
      const imageRatio = image.width / image.height;
      const availableRatio = availableWidth / availableHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = image.width;
      let sourceHeight = image.height;
      let drawWidth = availableWidth;
      let drawHeight = availableHeight;

      if (imageFit === "cover") {
        if (imageRatio > availableRatio) {
          sourceWidth = image.height * availableRatio;
          sourceX = (image.width - sourceWidth) / 2;
        } else {
          sourceHeight = image.width / availableRatio;
          sourceY = (image.height - sourceHeight) / 2;
        }
      } else {
        const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
        drawWidth = image.width * scale;
        drawHeight = image.height * scale;
      }

      const drawX = inset + (availableWidth - drawWidth) / 2;
      const drawY = inset + (availableHeight - drawHeight) / 2;
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );

      const jpegData = canvas.toDataURL("image/jpeg", quality).split(",")[1];
      const jpegBinary = atob(jpegData);
      const jpeg = new Uint8Array(jpegBinary.length);
      for (let byteIndex = 0; byteIndex < jpegBinary.length; byteIndex++) {
        jpeg[byteIndex] = jpegBinary.charCodeAt(byteIndex);
      }
      pdfPages.push({
        jpeg,
        pixelWidth: canvas.width,
        pixelHeight: canvas.height,
        widthMm: pageWidth,
        heightMm: pageHeight
      });
      image.close();
      canvas.width = 0;
      canvas.height = 0;
      itpStatus.textContent = `Adding image ${index + 1} of ${itpImages.length}...`;
    }

    const blob = createPdfBlob(pdfPages);
    itpPdfUrl = URL.createObjectURL(blob);
    itpDownloadButton.disabled = false;
    itpPdfInfo.textContent = `${itpImages.length} page(s), ${(blob.size / 1024).toFixed(1)} KB`;
    itpResult.hidden = false;
    itpStatus.textContent = "PDF created successfully.";
  } catch (error) {
    console.error("Image to PDF conversion failed:", error);
    itpStatus.textContent = error.message || "Could not create the PDF.";
  } finally {
    itpConverting = false;
    itpConvertButton.disabled = false;
  }
});

itpDownloadButton.addEventListener("click", () => {
  if (!itpPdfUrl) return;
  const link = document.createElement("a");
  const filename = document.getElementById("itpPdfName").value.trim() || "my-images";
  link.href = itpPdfUrl;
  link.download = `${filename.replace(/\.pdf$/i, "")}.pdf`;
  link.click();
});

itpResetButton.addEventListener("click", () => {
  itpImages.forEach(image => URL.revokeObjectURL(image.url));
  itpImages = [];
  itpDraggedIndex = null;
  itpFileInput.value = "";
  itpQuality.value = 90;
  itpQualityValue.textContent = "90%";
  clearGeneratedPdf();
  renderImages();
  itpStatus.textContent = "Workspace reset.";
});

itpStatus.textContent = "Ready. Add images to begin.";







