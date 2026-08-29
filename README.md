# DevToolBox

DevToolBox is a collection of small web tools I made for things I often need while working on websites and code.

It started as a few simple utilities and I kept adding tools whenever I found something I wanted to have quickly in one place. Everything is made with plain HTML, CSS and JavaScript, so there is no build setup or framework required.

## Tools

### Box Shadow Generator

`tools/box-shadow/`

A small visual tool for creating CSS `box-shadow` values. You can adjust the shadow settings and copy the generated CSS.

### Color Converter

`tools/color-converter/`

Converts colors between RGB, HEX and HSL formats. This is useful when switching between different color formats while working on a UI.

### Diff Checker

`tools/diff-checker/`

Compares two pieces of text and shows the differences between them. I made this for quickly checking what changed between two versions of some text or code.

### Flexbox Generator

`tools/flexbox-generator/`

Helps create CSS Flexbox layouts without having to remember every property. You can change the layout options and get the corresponding CSS.

### Gradient Generator

`tools/gradient-generator/`

Creates CSS gradients with adjustable colors and directions. The generated CSS can be copied and used directly in a website.

### JSON Formatter

`tools/json-formatter/`

Takes messy or hard-to-read JSON and formats it into a cleaner, indented structure.

### JSON Validator

`tools/json-validator/`

Checks whether a JSON input is valid and shows an error when the JSON has a problem.

### Regex Tester

`tools/regex-tester/`

A simple place to test regular expressions against text and see which parts match.

## Running it

There is no build process.

You can open the HTML files directly in your browser, for example:

```text
tools/base64/base64.html
```

I usually recommend using a local server instead:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Project structure

```text
DevToolBox/
├── index.html
├── script.js
├── style.css
└── tools/
    ├── 
    ├── box-shadow/
    ├── color-converter/
    ├── diff-checker/
    ├── flexbox-generator/
    ├── gradient-generator/
    ├── json-formatter/
    ├── json-validator/
    └── regex-tester/
```

Each tool has its own folder so I can work on it without affecting the other tools.

## AI usage

I did use AI while working on DevToolBox, mainly when I got stuck on a bug or needed help figuring out a particular implementation.

It was not generated from one prompt. I built the project and added the tools myself, then used AI during different parts of development to help find errors, suggest fixes, and explain things when I needed it. I also tested the changes and made the final decisions about what went into the project.

## Built with

* HTML
* CSS
* JavaScript

No framework or build tool is required.

## Author

**Prajwol Gynawali**

GitHub: **SnaggingCobra**
