(function() {
    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const jsCode = document.getElementById("jsCode");
    const preview = document.getElementById("preview");
    const runCode = document.getElementById("runCode");
    const clearCode = document.getElementById("clearCode");

    if (!htmlCode || !cssCode || !jsCode || !preview) return;

    function updatePreview() {
        const html = htmlCode.value;
        const css = cssCode.value;
        const js = jsCode.value.replace(/<\/script/gi, "<\\/script");

        const documentContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        try {
            ${js}
        } catch (error) {
            console.error(error);
        }
    <\/script>
</body>
</html>
`;

        preview.srcdoc = documentContent;
    }

    function clearPlayground() {
        htmlCode.value = "";
        cssCode.value = "";
        jsCode.value = "";
        preview.srcdoc = "";
    }

    if (runCode) runCode.addEventListener("click", updatePreview);
    if (clearCode) clearCode.addEventListener("click", clearPlayground);

    updatePreview();
})();
