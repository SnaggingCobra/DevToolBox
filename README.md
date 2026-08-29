# DevToolbox

A small collection of front-end utilities and generators packed as a lightweight dev toolbox. Each tool is a single HTML/CSS/JS page you can open locally in a browser — no build step required.

## Project overview

DevToolbox is a personal toolkit of small web utilities I use while designing and debugging front-end UI and data tasks. It contains handy generators and validators such as color and gradient creators, JSON formatters and validators, a regex tester, and more. The goal is to keep useful snippets and UI helpers in one place so they’re easy to open and iterate on.

## What’s included

- `index.html` — A simple entry point (if present) linking to the individual tools.
- `script.js`, `style.css` — Global scripts and styles used by the main page.
- `tools/` — Folder containing each utility in its own subfolder.

Tools included (each is a self-contained HTML page in `tools/<tool>/`):

- Base64 encoder/decoder — `tools/base64/base64.html`
- Box shadow generator — `tools/box-shadow/box-shadow.html`
- Color converter (RGB/HEX/HSL) — `tools/color-converter/color-converter.html`
- Diff checker — `tools/diff-checker/diff-checker.html`
- Flexbox generator — `tools/flexbox-generator/flexbox-generator.html`
- Gradient generator — `tools/gradient-generator/gradient-generator.html`
- JSON formatter — `tools/json-formatter/json-formatter.html`
- JSON validator — `tools/json-validator/json-validator.html`
- Regex tester — `tools/regex-tester/regex-tester.html`

If you add new tools, follow the same folder pattern: put `your-tool.html`, `your-tool.css`, and `your-tool.js` inside `tools/your-tool/`.

## Usage

Quick options to run and use the toolbox locally:

1. Open any tool directly in your browser by double-clicking its HTML file, for example:

   - Open `tools/base64/base64.html` to use the Base64 utility.

2. Run a tiny local server (recommended) from the project root so relative imports work consistently. From the project root run:

```bash
python3 -m http.server 8000
# or for Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000/` in your browser and navigate to the desired tool.

## Development notes

- Keep each tool focused and self-contained. Avoid adding heavy dependencies unless the tool needs them.
- Use the existing folder structure for consistency: HTML, CSS, and JS for each tool live together in a single subfolder.
- If you refactor shared code, try to keep minimal globals to avoid collisions between tools.

## Contributing

If you want to add a tool or improve an existing one:

1. Create a new folder inside `tools/` named for the tool.
2. Add `your-tool.html`, `your-tool.css`, and `your-tool.js` following the patterns used elsewhere.
3. Test the page by opening it directly or via a local server.
4. Submit a PR with a short description of the feature.

## AI usage

AI assistance was used sparingly in this project. It helped with small parts of the code and debugging, and it assisted with error correction. The AI acted as a side assistant across several iterative questions and fixes — not as a one-shot, single-prompt solution. In other words, it supported the development process by suggesting fixes, pointing out errors, and helping refine solutions while I reviewed and applied the changes.

## Troubleshooting

- If a tool does not render correctly, try serving the project via the simple HTTP server above instead of opening files directly — some browsers restrict local resource loading.
- Open the browser console (F12) for runtime errors; most tools are small and will log helpful messages there.

## AUTHOR

    -- Prajwol Gynawali