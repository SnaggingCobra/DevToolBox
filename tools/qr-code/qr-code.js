const qrText = document.getElementById("qrText");
const qrImage = document.getElementById("qrImage");
const generateQRCodeButton = document.getElementById("generateQRCode");
const downloadQRCodeButton = document.getElementById("downloadQRCode");
const qrStatus = document.getElementById("qrStatus");

function generateQRCode() {
    if (!qrText || !qrImage) return;

    const value = qrText.value.trim();

    if (!value) {
        qrImage.removeAttribute("src");
        if (qrStatus) qrStatus.textContent = "Enter text or a URL to generate a QR code.";
        return;
    }

    const encoded = encodeURIComponent(value);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
    qrImage.src = url;
    qrImage.alt = `QR code for ${value}`;

    if (qrStatus) qrStatus.textContent = "QR code generated.";
}

if (generateQRCodeButton) {
    generateQRCodeButton.addEventListener("click", generateQRCode);
}

if (downloadQRCodeButton && qrImage) {
    downloadQRCodeButton.addEventListener("click", async () => {
        if (!qrImage.src) {
            if (qrStatus) qrStatus.textContent = "Generate a QR code before downloading it.";
            return;
        }

        try {
            if (qrStatus) qrStatus.textContent = "Preparing download...";
            const response = await fetch(qrImage.src);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = "qr-code.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
            if (qrStatus) qrStatus.textContent = "QR code downloaded.";
        } catch (error) {
            console.error("Download error:", error);
            window.open(qrImage.src, "_blank");
            if (qrStatus) qrStatus.textContent = "QR code opened in new tab.";
        }
    });
}

if (qrText) {
    qrText.addEventListener("input", generateQRCode);
}

generateQRCode();
