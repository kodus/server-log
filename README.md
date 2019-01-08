Server Log Panel
================

This extension for Chrome aggregates diagnostic logs from the server-side to a panel in Devtools. 

### Usage

TODO

### Specification

The server-side specifies the location of one or more HTML resources by adding an
`X-ServerLog-Location` header to an HTTP Response - for example:

    X-ServerLog-Location: /log/938b6caf-2787-43c3-8cf9-1d6669f0537a.html

When the extension detects one or more of these headers, the HTML resource(s) will be fetched
and the content will be displayed in the "Server Log" panel in Devtools.

The resource specified by the header must be a simple, self-contained HTML5 document - use
the `<style>` tag in the `<head>` of your document to style the content in the `<body>` element.

### Meta

If you've used ChromeLogger, you might have one or more of the following questions.

*Why HTML and not JSON or XML?*

A JSON/XML schema is considerably more complexity, and HTML provides more freedom in terms
of formatting the content.

*Why not embed directly in headers?*

There's a (~250KB) header size limitations in browsers, and often much lower limits on the
server, which leads to serious problems and/or unfortunate trade-offs such as having to
truncate the log.

*Why a panel instead of writing to the console?*

We took a poll among our own developers, and nobody actually wanted server-side log-entries
mixed in with client-side log-entries in the console.
