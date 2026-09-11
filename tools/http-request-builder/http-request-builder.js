const httpMethod = document.getElementById("httpMethod");
const requestUrl = document.getElementById("requestUrl");
const sendRequest = document.getElementById("sendRequest");
const responseStatus = document.getElementById("responseStatus");
const responseTime = document.getElementById("responseTime");
const responseOutput = document.getElementById("responseOutput");
const requestBody = document.getElementById("requestBody");
const paramsList = document.getElementById("paramsList");
const headersList = document.getElementById("headersList");
const addParam = document.getElementById("addParam");
const addHeader = document.getElementById("addHeader");
const codeLanguage = document.getElementById("codeLanguage");
const generatedCode = document.getElementById("generatedCode");
const copyGeneratedCode = document.getElementById("copyGeneratedCode");
const tabs = document.querySelectorAll(".request-tab");

const panels = {
    params: document.getElementById("paramsPanel"),
    headers: document.getElementById("headerPanel"),
    body: document.getElementById("bodyPanel")
};

function getKeyValueData(container) {
    const data = {};
    const rows = container.querySelectorAll(".key-value-row");

    rows.forEach((row) => {
        const key = row.querySelector(".key-input").value.trim();
        const value = row.querySelector(".value-input").value;

        if (key) {
            data[key] = value;
        }
    });

    return data;
}

function createKeyValueRow(container) {
    const row = document.createElement("div");
    row.className = "key-value-row";
    row.innerHTML = `
        <input
            type="text"
            class="key-input"
            placeholder="Key"
            aria-label="Key"
        >
        <input
            type="text"
            class="value-input"
            placeholder="Value"
            aria-label="Value"
        >
        <button
            type="button"
            class="remove-row"
            aria-label="Remove row"
        >
            ×
        </button>
    `;

    row.querySelector(".remove-row").addEventListener("click", () => {
        row.remove();
        updateGeneratedCode();
    });

    row.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", updateGeneratedCode);
    });

    container.appendChild(row);
}

function buildRequestUrl() {
    const rawUrl = requestUrl.value.trim();

    if (!rawUrl) {
        return "";
    }

    try {
        const url = new URL(rawUrl);
        const params = getKeyValueData(paramsList);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        return url.toString();
    } catch {
        return rawUrl;
    }
}

function escapeShell(value) {
    return value.replace(/'/g, "'\\''");
}

function generateJavaScriptCode() {
    const headers = getKeyValueData(headersList);
    const method = JSON.stringify(httpMethod.value);
    let code = `fetch(${JSON.stringify(buildRequestUrl())}, {\n`;

    code += `    method: ${method}`;

    if (Object.keys(headers).length) {
        code += `,\n    headers: ${JSON.stringify(headers, null, 4)}`;
    }

    if (
        ["POST", "PUT", "PATCH"].includes(httpMethod.value) &&
        requestBody.value.trim()
    ) {
        code += `,\n    body: ${JSON.stringify(requestBody.value)}`;
    }

    return `${code}\n});`;
}

function generateCurlCode() {
    const headers = getKeyValueData(headersList);
    let code = `curl -X ${httpMethod.value} '${escapeShell(buildRequestUrl())}'`;

    Object.entries(headers).forEach(([key, value]) => {
        code += ` \\\n    -H '${escapeShell(`${key}: ${value}`)}'`;
    });

    if (
        ["POST", "PUT", "PATCH"].includes(httpMethod.value) &&
        requestBody.value.trim()
    ) {
        code += ` \\\n    --data-raw '${escapeShell(requestBody.value)}'`;
    }

    return code;
}

function generatePythonCode() {
    const method = httpMethod.value.toLowerCase();
    const headers = getKeyValueData(headersList);
    let code = `import requests\n\n`;

    code += `response = requests.${method}(\n`;
    code += `    ${JSON.stringify(buildRequestUrl())}`;

    if (Object.keys(headers).length) {
        code += `,\n    headers=${JSON.stringify(headers, null, 4)}`;
    }

    if (
        ["post", "put", "patch"].includes(method) &&
        requestBody.value.trim()
    ) {
        code += `,\n    data=${JSON.stringify(requestBody.value)}`;
    }

    code += "\n)\n\n";
    code += "print(response.status_code)\n";
    code += "print(response.text)";

    return code;
}

function updateGeneratedCode() {
    if (!requestUrl.value.trim()) {
        generatedCode.textContent = "Enter a URL to generate code.";
        return;
    }

    const generators = {
        javascript: generateJavaScriptCode,
        curl: generateCurlCode,
        python: generatePythonCode
    };

    generatedCode.textContent = generators[codeLanguage.value]();
}

async function makeRequest() {
    const url = buildRequestUrl();

    if (!url) {
        responseStatus.textContent = "No URL";
        responseTime.textContent = "-";
        responseOutput.textContent = "Please enter a request URL.";
        return;
    }

    sendRequest.disabled = true;
    sendRequest.textContent = "Sending...";
    responseStatus.textContent = "Loading...";
    responseTime.textContent = "-";
    responseOutput.textContent = "Sending request...";

    const options = {
        method: httpMethod.value,
        headers: getKeyValueData(headersList)
    };

    if (
        ["POST", "PUT", "PATCH"].includes(options.method) &&
        requestBody.value.trim()
    ) {
        options.body = requestBody.value;
    }

    const startTime = performance.now();

    try {
        const response = await fetch(url, options);
        const elapsed = Math.round(performance.now() - startTime);
        const text = await response.text();

        responseStatus.textContent = `${response.status} ${response.statusText}`;
        responseTime.textContent = `${elapsed} ms`;

        try {
            responseOutput.textContent = text
                ? JSON.stringify(JSON.parse(text), null, 2)
                : "(empty response)";
        } catch {
            responseOutput.textContent = text || "(empty response)";
        }
    } catch (error) {
        responseStatus.textContent = "Request failed";
        responseTime.textContent = `${Math.round(performance.now() - startTime)} ms`;
        responseOutput.textContent =
            "Unable to complete the request. This may be caused by CORS, " +
            "an invalid URL, or a network error.";
        console.error("HTTP Request Error:", error);
    } finally {
        sendRequest.disabled = false;
        sendRequest.textContent = "Send";
    }
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selectedTab = tab.dataset.tab;

        tabs.forEach((item) => {
            item.classList.toggle("active", item === tab);
        });

        Object.entries(panels).forEach(([name, panel]) => {
            panel.classList.toggle("active", name === selectedTab);
        });
    });
});

addParam.addEventListener("click", () => createKeyValueRow(paramsList));
addHeader.addEventListener("click", () => createKeyValueRow(headersList));
sendRequest.addEventListener("click", makeRequest);
codeLanguage.addEventListener("change", updateGeneratedCode);
httpMethod.addEventListener("change", updateGeneratedCode);

[requestUrl, requestBody].forEach((element) => {
    element.addEventListener("input", updateGeneratedCode);
});

copyGeneratedCode.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(generatedCode.textContent);
        copyGeneratedCode.textContent = "Copied";

        setTimeout(() => {
            copyGeneratedCode.textContent = "Copy";
        }, 1200);
    } catch (error) {
        copyGeneratedCode.textContent = "Copy failed";
        console.error("Copy error:", error);
    }
});

createKeyValueRow(paramsList);
createKeyValueRow(headersList);
updateGeneratedCode();
