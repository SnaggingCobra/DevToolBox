const codeInput = document.getElementById("codeInput");
const codeLanguage = document.getElementById("codeLanguage");
const reviewType = document.getElementById("reviewType");
const codeDescription = document.getElementById("codeDescription");
const reviewCode = document.getElementById("reviewCode");
const clearCode = document.getElementById("clearCode");
const reviewStatus = document.getElementById("reviewStatus");
const reviewResults = document.getElementById("reviewResults");

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getLanguageName() {
    return codeLanguage.options[codeLanguage.selectedIndex].text;
}

function analyzeCode(code, language, type) {
    const issues = [];
    const lines = code.split("\n");
    const isJavaScript = ["javascript", "typescript"].includes(language);
    const isCStyle = ["java", "cpp", "c", "csharp"].includes(language);
    const isWeb = ["javascript", "typescript", "php", "html"].includes(language);

    function addIssue(issueType, severity, line, title, description) {
        issues.push({ type: issueType, severity, line, title, description });
    }

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        const nextLine = lines[index + 1] || "";

        if (isJavaScript && /\beval\s*\(/.test(line)) {
            addIssue("security", "HIGH", lineNumber, "Potentially unsafe eval() usage", "Avoid eval() because it can execute untrusted code.");
        }
        if (isWeb && /(password|secret|api[_-]?key|token)\s*[:=]\s*[\"'][^\"']+[\"']/i.test(line)) {
            addIssue("security", "HIGH", lineNumber, "Hardcoded credential", "Move credentials to environment variables or a secure secret store.");
        }
        if (language === "html" && /\bon(click|load|error)\s*=/.test(line.toLowerCase())) {
            addIssue("security", "MEDIUM", lineNumber, "Inline event handler", "Use a separate script and an appropriate content security policy.");
        }
        if (language === "sql" && /\b(select|update|delete|insert)\b.*(\+|concat\s*\()/i.test(line)) {
            addIssue("security", "HIGH", lineNumber, "Possible SQL injection", "Use parameterized queries instead of concatenating input into SQL.");
        }
        if (isCStyle && /\b(strcpy|strcat|gets|sprintf)\s*\(/.test(line)) {
            addIssue("security", "HIGH", lineNumber, "Unsafe buffer operation", "Use a bounded and safer alternative to prevent buffer overflows.");
        }
        if (language === "php" && /\b(mysql_query|mysqli_query)\s*\([^)]*\$[a-z_]/i.test(line)) {
            addIssue("security", "HIGH", lineNumber, "Unparameterized database query", "Use prepared statements for user-controlled database values.");
        }
        if (language === "python" && /\bprint\s*\(/.test(line)) {
            addIssue("quality", "LOW", lineNumber, "Print statement found", "Use the logging system for application diagnostics.");
        }
        if (isJavaScript && /(^|[^=])==([^=]|$)/.test(line)) {
            addIssue("quality", "LOW", lineNumber, "Loose equality", "Use === instead of == to avoid type coercion errors.");
        }
        if (isCStyle && /(System\.out\.print|printf\s*\(|cout\s*<<|Console\.WriteLine)/.test(line)) {
            addIssue("quality", "LOW", lineNumber, "Direct console output", "Use the project logging convention instead of writing directly to the console.");
        }
        if (language === "php" && /\becho\s+/.test(line)) {
            addIssue("quality", "LOW", lineNumber, "Direct output", "Use the project response or logging convention consistently.");
        }
        if (language === "sql" && /\bselect\s+\*/i.test(line)) {
            addIssue("quality", "LOW", lineNumber, "Unbounded column selection", "Select only the columns the caller needs instead of using SELECT *.");
        }
        if (isJavaScript && /\bif\s*\([^)]*\b[a-z_$][\w$]*\s*=\s*[^=]/i.test(line)) {
            addIssue("bug", "HIGH", lineNumber, "Assignment inside condition", "Use a comparison operator or wrap the assignment intentionally.");
        }
        if (language === "sql" && /\b(delete|update)\b/i.test(line) && !/\bwhere\b/i.test(line)) {
            addIssue("bug", "HIGH", lineNumber, "Statement without WHERE clause", "Add a WHERE clause or confirm that every row should be changed.");
        }
        if (isCStyle && /\bif\s*\([^)]*=[^=]/.test(line)) {
            addIssue("bug", "HIGH", lineNumber, "Assignment inside condition", "Use a comparison operator or an explicit assignment outside the condition.");
        }
        if (language === "python" && /\bexcept\s*:\s*$/.test(trimmedLine)) {
            addIssue("bug", "MEDIUM", lineNumber, "Bare exception handler", "Catch a specific exception so unexpected failures are not hidden.");
        }
        if (line.length > 120) {
            addIssue("performance", "MEDIUM", lineNumber, "Line is too long", "Break this line into smaller expressions to improve maintenance.");
        }
        if (/\b(for|while)\b/.test(line) && /\b(for|while)\b/.test(nextLine)) {
            addIssue("performance", "MEDIUM", lineNumber, "Nested iteration", "Review nested loops and consider indexing, batching, or a more efficient algorithm.");
        }
        if (language === "sql" && /\bselect\b/i.test(line) && /\bselect\b/i.test(nextLine)) {
            addIssue("performance", "MEDIUM", lineNumber, "Nested query", "Consider a join or an indexed query plan for large datasets.");
        }
        if (/\b(TODO|FIXME)\b/i.test(line)) {
            addIssue("readability", "LOW", lineNumber, "Unresolved code note", "Resolve or document this note before shipping the code.");
        }
        if (/function\s*\([^)]*\)\s*\{|\bdef\s*\([^)]*\)\s*:/i.test(line)) {
            addIssue("readability", "LOW", lineNumber, "Unnamed function", "Give functions descriptive names so their intent is clear.");
        }
    });

    if (type === "full") return issues;
    if (type === "bugs") return issues.filter(issue => issue.type === "bug");
    if (type === "security") return issues.filter(issue => issue.type === "security");
    if (type === "performance") return issues.filter(issue => issue.type === "performance");
    if (type === "quality") return issues.filter(issue => issue.type === "quality");
    if (type === "readability") return issues.filter(issue => issue.type === "readability");
    return issues;
}

function getScore(issues) {
    const penalty = issues.reduce((total, issue) => {
        return total + (issue.severity === "HIGH" ? 15 : issue.severity === "MEDIUM" ? 8 : 3);
    }, 0);
    return Math.max(0, 100 - penalty);
}

function getTestSuggestions(language) {
    const common = [
        "returns the expected result for valid input",
        "handles empty and invalid input safely",
        "does not mutate input data unexpectedly"
    ];
    const suggestions = {
        javascript: common,
        typescript: [common[0], "rejects values that do not match the declared type", "handles null and undefined safely"],
        python: [common[0], "raises the expected exception for invalid input", common[1]],
        java: [common[0], "handles null arguments without an unexpected exception", "preserves object state after the call"],
        cpp: [common[0], "handles boundary values without a buffer overrun", "releases resources after the operation"],
        c: [common[0], "handles boundary values without writing past a buffer", "returns the documented error code"],
        csharp: [common[0], "handles null arguments predictably", "does not change shared state unexpectedly"],
        php: [common[0], "rejects invalid request data", "escapes or validates output safely"],
        html: ["renders the required controls", "shows validation feedback for invalid input", "works with keyboard navigation"],
        sql: ["returns matching rows for valid filters", "returns no rows for an unknown identifier", "rejects invalid or unauthorized input"]
    };
    return suggestions[language] || common;
}

function renderResults(issues, language, type) {
    if (type === "tests") {
        const tests = getTestSuggestions(codeLanguage.value);
        reviewResults.innerHTML = `<div class="review-summary"><div class="review-score"><span class="score-number">${tests.length}</span><span class="score-label">tests</span></div><div class="review-summary-text"><h3>Suggested Tests</h3><p>Starter test cases for this ${escapeHTML(language)} code.</p></div></div><div class="issues-list">${tests.map((test, index) => `<div class="review-issue"><div class="issue-top"><span class="issue-severity low">TEST ${index + 1}</span></div><h4>${escapeHTML(test)}</h4><p>Verify this behavior with an automated test.</p></div>`).join("")}</div>`;
        return;
    }

    let html = `<div class="review-summary"><div class="review-score"><span class="score-number">${getScore(issues)}</span><span class="score-label">/ 100</span></div><div class="review-summary-text"><h3>Code Review</h3><p>${issues.length === 0 ? `No obvious issues were detected in this ${escapeHTML(language)} review.` : `${issues.length} potential issue${issues.length === 1 ? "" : "s"} found.`}</p></div></div>`;
    if (!issues.length) {
        html += `<div class="review-success"><strong>No issues found</strong><p>The local reviewer did not detect problems in your code.</p></div>`;
    } else {
        html += `<div class="issues-list">${issues.map(issue => `<div class="review-issue"><div class="issue-top"><span class="issue-severity ${issue.severity.toLowerCase()}">${escapeHTML(issue.severity)}</span><span class="issue-line">Line ${issue.line}</span></div><h4>${escapeHTML(issue.title)}</h4><p>${escapeHTML(issue.description)}</p></div>`).join("")}</div>`;
    }
    reviewResults.innerHTML = html;
}

function normalizeRemoteIssues(review) {
    const issues = Array.isArray(review) ? review : review && review.issues;
    if (!Array.isArray(issues)) {
        throw new Error("The review response did not contain issues.");
    }

    return issues.map((issue) => ({
        type: String(issue.category || "quality").toLowerCase(),
        severity: String(issue.severity || "LOW").toUpperCase(),
        line: Number.isInteger(issue.line) ? issue.line : 0,
        title: issue.title || "Review note",
        description: issue.suggestion ? `${issue.description || ""} ${issue.suggestion}`.trim() : (issue.description || "No details provided.")
    }));
}

async function requestRemoteReview(code, type) {
    const response = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            code,
            language: codeLanguage.value,
            reviewType: type,
            description: codeDescription.value.trim()
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || "The AI review request failed.");
    }

    return normalizeRemoteIssues(data);
}

reviewCode.addEventListener("click", async () => {
    const code = codeInput.value.trim();
    if (!code) {
        reviewStatus.textContent = "No code";
        reviewResults.innerHTML = `<div class="empty-review"><div class="empty-icon">!</div><h3>No code provided</h3><p>Paste some code into the editor before starting the review.</p></div>`;
        return;
    }
    reviewCode.disabled = true;
    reviewCode.textContent = "Reviewing...";
    reviewStatus.textContent = "Analyzing";
    const type = reviewType.value;
    try {
        const issues = await requestRemoteReview(code, type);
        renderResults(issues, getLanguageName(), type);
        reviewStatus.textContent = "Complete";
    } catch (error) {
        console.error("Remote review failed:", error);
        renderResults(analyzeCode(code, codeLanguage.value, type), getLanguageName(), type);
        reviewStatus.textContent = "Local fallback";
    } finally {
        reviewCode.disabled = false;
        reviewCode.textContent = "Review Code";
    }
});

clearCode.addEventListener("click", () => {
    codeInput.value = "";
    codeDescription.value = "";
    reviewStatus.textContent = "Ready";
    reviewResults.innerHTML = `<div class="empty-review"><div class="empty-icon">AI</div><h3>No review yet</h3><p>Paste your code above and click <strong>Review Code</strong> to analyze it.</p></div>`;
    codeInput.focus();
});
