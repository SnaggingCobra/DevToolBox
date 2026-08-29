# DevToolBox

DevToolBox is a project I made to keep some small developer tools that I use while coding in one place.

When I'm working on a website, I sometimes need to convert a color, test a regex, format JSON, make a CSS gradient, or check what changed between two pieces of code. Normally I would have to search for a different website for each of these things. I wanted to make my own small toolbox instead.
.

## What I built

### Base64 Encoder / Decoder

The Base64 tool can convert normal text into Base64 and decode Base64 back into normal text.

I added this because Base64 comes up fairly often when working with web development and data, and I wanted a quick way to do the conversion without opening another website.

### Box Shadow Generator

This tool helps create CSS box shadows.

Instead of manually trying different values for the shadow, I can change the settings in the tool and see the result. It also gives me the CSS value that I can use in a website.

### Color Converter

The Color Converter converts colors between RGB, HEX and HSL.

This is useful when I have a color in one format but need it in another one while working on a website. I made it so I don't have to manually calculate or search for a converter.

### Diff Checker

The Diff Checker compares two pieces of text and shows what is different between them.

I mainly made this for checking code or text when I have two versions and want to quickly see what was changed.

### Flexbox Generator

The Flexbox Generator helps create CSS Flexbox layouts.

It lets me change different Flexbox options and then generates the CSS for those settings. I made this because I sometimes forget the exact Flexbox properties or their values, especially when trying different layouts.

### Gradient Generator

The Gradient Generator is for creating CSS gradients.

I can change the colors and direction of the gradient and see the result while working on it. The tool also gives the CSS code for the gradient so I can use it in a website.

### JSON Formatter

The JSON Formatter takes JSON that is difficult to read and formats it with proper indentation.

This is especially useful when I get a large JSON response from an API and want to make it easier to understand.

### JSON Validator

The JSON Validator checks whether the JSON I enter is valid.

If there is a mistake in the JSON, it tells me that the input is invalid instead of having to figure it out somewhere else. I made this separately from the formatter because sometimes I only want to check whether JSON is valid.

### Regex Tester

The Regex Tester lets me write a regular expression and test it against some text.

It shows which parts of the text match the expression. This makes it easier to test a regex before putting it into my actual code.

## Why I made it

The main reason I made DevToolBox was because I wanted to build something that I could actually use while coding.

I use small online tools quite often when working on projects, but I don't always want to search for them every time. Making my own toolbox gave me a place to put the tools I need and also gave me a project where I could practice JavaScript and working with different parts of a web application.

I also wanted to keep the project simple. Each tool is separated into its own folder, with its own HTML, CSS and JavaScript files. This makes it easier for me to work on one tool without changing the others.

## How it works

The main page is used to access the different tools. It also has a search box so I can find a tool without looking through the whole list.

There is also a theme button for switching the appearance of the toolbox.

The actual tools are kept inside the `tools` folder. Each tool has its own HTML, CSS and JavaScript file.

For example:

    tools/
    ├── base64/
    ├── box-shadow/
    ├── color-converter/
    ├── diff-checker/
    ├── flexbox-generator/
    ├── gradient-generator/
    ├── json-formatter/
    ├── json-validator/
    └── regex-tester/

I chose this structure because it keeps the project easy to understand and makes adding another tool fairly simple.

## Running it

There is no build process or package installation needed.

I can open the HTML files directly in a browser. I can also run the project using a simple local server:

    python3 -m http.server 8000

Then I can open the local server in my browser and use the tools from there.

## Built with

- HTML
- CSS
- JavaScript

I kept the project using plain web technologies because these tools don't need a framework or a complicated setup.

## AI usage

I did use AI while working on DevToolBox.

I mainly used it when I got stuck on a bug, didn't understand why something wasn't working, or wanted help figuring out how to implement something.

The project wasn't made from one prompt. I worked on the tools myself, tested them, changed things when they didn't work, and decided what features to add. AI was more like something I could ask for help when I got stuck during development.

## Creator
   -- Prajwol Gynawali

