Server Log Panel
================

This extension for Chrome aggregates diagnostic logs (HTML) from the server-side to a panel in Devtools.

Legacy support for [ChromeLogger](https://craig.is/writing/chrome-logger) headers is available for your
existing projects - if you just want your server-side logs in a separate panel from your client-side JS
console, you can use this extension as a drop-in replacement for the original extension.

Progressive adoption (to break the header-size limitation of ChromeLogger) is possible with minor changes
to existing server-side libraries: simply make them output the ChromeLogger JSON data to a file instead
of via a header, and emit the `X-ServerLog-Location` header with the URL of the JSON file.

### Usage

Open Devtools (F12) and look for the new "Server Log" tab.

During development, your server-side scripts can emit headers and logs (in HTML format) to be displayed
in the "Server Log" panel.

See below for available server-side libraries or how to build your own.

#### Server-side Libraries

Install a server-side library for your language:

  * PHP (with PSR-3/7/15) support via [`kodus/chrome-logger`](https://github.com/kodus/chrome-logger).
  * Python, Ruby, Node, .NET, Go, Java and more via [ChromeLogger integrations](https://craig.is/writing/chrome-logger).

Consider forking the existing ChromeLogger-libraries and help break the header-size limit - or
write a new and improved server-side library for your language using fancy HTML!

Tell us about your server-side library, and we'll add it here! :-)

### Specification

The server-side specifies the location of one or more HTML resources by adding an
`X-ServerLog-Location` header to an HTTP Response - for example:

    X-ServerLog-Location: /server-log/938b6caf-2787-43c3-8cf9-1d6669f0537a.html

The URL is relative to the page that emitted the header.

When the extension detects one or more of these headers, the HTML resource(s) will be fetched
and the content will be displayed in the "Server Log" panel in Devtools.

The resource specified by the header must be a simple, self-contained HTML5 document - use
the `<style>` tag in the `<head>` of your document to style the content in the `<body>` element.

### Contributing

TypeScript sources are compiled from `src` to the `chrome-extension` folder.

Note that other (HTML, CSS) files in the `chrome-extension` folder should be edited
directly - only the TypeScript sources are compiled from `src`.

If you want to hack on the extension, this will get you started:

    npm install
    npm run watch

To compile before check-in:

    npm run build

If you haven't worked on a Chrome extension before, [start here](https://developer.chrome.com/extensions/getstarted).

Please submit pull-requests *without* the compiled `.js` files checked-in - we'll rebuild
the compiled source upon accepting your PR and/or publishing a release.

#### Roadmap

Here are some of the features we'd like to add:

  * [ ] Add toolbar similar to the "Network" panel:
    * [ ] Add button to manually clear the log.
    * [ ] Add "Preserve Log" option to toggle clearing the log on navigation; unchecked by default.
  * [ ] Support for external resources in HTML files:
    * [ ] Support for external Javascript via `<script>` tags in `<head>` or `<body>`.
    * [ ] Support for external CSS via `<link rel="stylesheet">` in `<head>`.

Pull-requests welcome :-)

#### Icons

Icons were lifted from Devtools [here](https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/Images/smallIcons.png) -
if you need more, extract them using [MethodDraw](https://editor.method.ac/), compress them
with [SVGOMG](https://jakearchibald.github.io/svgomg/), and [URL-encode](https://yoksel.github.io/url-encoder/) them.

### Meta

If you've used ChromeLogger, you might have one or more of the following questions.

*Why HTML and not JSON or XML?*

A JSON/XML schema is considerably more complexity, and HTML provides more freedom in terms
of formatting the content.

*Why not embed documents directly in headers?*

There's a (~250KB) header size limitations in browsers, and often much lower limits on the
server, which leads to serious problems and/or unfortunate trade-offs such as having to
truncate the log.

*Why a panel instead of writing to the console?*

We took a poll among our own developers, and nobody actually wanted server-side log-entries
mixed in with client-side log-entries in the console.
