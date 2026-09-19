const codeInput = document.getElementById("codeInput");
const codeLanguage = document.getElementById("codeLanguage");
const reviewType = document.getElementById("reviewType");
const codeDescription = document.getElementById("codeDescription");

const reviewCode = document.getElementById("reviewCode");
const clearCode = document.getElementById("clearCode");

const reviewStatus = document.getElementById("reviewStatus");
const reviewResults = document.getElementById("reviewResults");


function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function renderResults(review) {
    const issues = Array.isArray(review.issues)
        ? review.issues
        : [];

    let html = `
        <div class="review-summary">
            <div class="review-summary-text">
                <h3>AI Review</h3>
                <p>
                    ${escapeHTML(
                        review.summary ||
                        "Review complete."
                    )}
                </p>
                ${
                    review.detectedLanguage &&
                    review.detectedLanguage !== "Unknown"
                        ? `<p class="detected-language">Detected language: ${escapeHTML(review.detectedLanguage)}</p>`
                        : ""
                }
            </div>
        </div>
    `;


    if (issues.length === 0) {
        html += `
            <div class="review-success">
                <strong>No relevant issues found.</strong>

                <p>
                    The AI did not identify any issues
                    related to the selected review task.
                </p>
            </div>
        `;

        reviewResults.innerHTML = html;
        return;
    }


    html += `
        <div class="issues-list">
    `;


    issues.forEach(issue => {
        const severity =
            String(issue.severity || "LOW")
                .toLowerCase();

        const category =
            String(issue.category || "QUALITY")
                .toUpperCase();

        const line =
            Number.isInteger(issue.line)
                ? issue.line
                : 0;


        html += `
            <div class="review-issue">

                <div class="issue-top">

                    <div>
                        <span class="issue-severity ${escapeHTML(severity)}">
                            ${escapeHTML(
                                String(issue.severity || "LOW")
                            )}
                        </span>

                        <span class="issue-category">
                            ${escapeHTML(category)}
                        </span>
                    </div>

                    <span class="issue-line">
                        ${
                            line > 0
                                ? `Line ${line}`
                                : "General"
                        }
                    </span>

                </div>


                <h4>
                    ${escapeHTML(
                        issue.title ||
                        "Review item"
                    )}
                </h4>


                <p>
                    ${escapeHTML(
                        issue.description ||
                        "No description provided."
                    )}
                </p>


                ${
                    issue.suggestion
                        ? `
                            <div class="issue-suggestion">
                                <strong>Suggestion</strong>

                                <p>
                                    ${escapeHTML(
                                        issue.suggestion
                                    )}
                                </p>
                            </div>
                        `
                        : ""
                }

            </div>
        `;
    });


    html += `
        </div>
    `;

    reviewResults.innerHTML = html;
}


reviewCode.addEventListener(
    "click",
    async () => {

        const code =
            codeInput.value.trim();


        if (!code) {
            reviewStatus.textContent =
                "No code";


            reviewResults.innerHTML = `
                <div class="empty-review">

                    <div class="empty-icon">
                        !
                    </div>

                    <h3>
                        No code provided
                    </h3>

                    <p>
                        Paste some code into the
                        editor before starting
                        the review.
                    </p>

                </div>
            `;

            return;
        }

        reviewCode.disabled = true;

        reviewCode.textContent =
            "Reviewing...";

        reviewStatus.textContent =
            "Analyzing";


        reviewResults.innerHTML = `
            <div class="empty-review">

                <div class="empty-icon">
                    AI
                </div>

                <h3>
                    Reviewing your code
                </h3>

                <p>
                    The AI is analyzing the
                    selected review task.
                </p>

            </div>
        `;


        try {
            const response =
                await fetch(
                    "/api/review-code",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            code,

                            language:
                                codeLanguage.value,

                            reviewType:
                                reviewType.value,

                            description:
                                codeDescription.value.trim()
                        })
                    }
                );


            let data;

            try {
                data =
                    await response.json();
            } catch {
                throw new Error(
                    "The server returned an invalid response."
                );
            }


            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "The AI review request failed."
                );
            }


            renderResults(data);

            reviewStatus.textContent =
                "Complete";

        } catch (error) {

            console.error(
                "AI Code Review Error:",
                error
            );


            reviewStatus.textContent =
                "Error";


            reviewResults.innerHTML = `
                <div class="empty-review">

                    <div class="empty-icon">
                        !
                    </div>

                    <h3>
                        Review failed
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            "Unable to complete the review."
                        )}
                    </p>

                </div>
            `;

        } finally {

            reviewCode.disabled = false;

            reviewCode.textContent =
                "Review Code";
        }
    }
);


clearCode.addEventListener(
    "click",
    () => {

        codeInput.value = "";

        codeDescription.value = "";

        reviewStatus.textContent =
            "Ready";


        reviewResults.innerHTML = `
            <div class="empty-review">

                <div class="empty-icon">
                    AI
                </div>

                <h3>
                    No review yet
                </h3>

                <p>
                    Paste your code above and
                    click <strong>Review Code</strong>
                    to analyze it.
                </p>

            </div>
        `;


        codeInput.focus();
    }
);
