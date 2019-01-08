console.log("HELLO PANEL");

chrome.devtools.network.onRequestFinished.addListener(request => {
    console.log("REQUEST", request);
});


// customElements.define(
//     "log-entry",
//     class LogEntryElement extends HTMLElement {
//         constructor() {
//             super();
//
//             this.attachShadow({ mode: "open" });
//         }
//
//         load(html) {
//             let doc = new DOMParser().parseFromString(html, "text/html");
//
//             this.style.display = "block";
//
//             [...doc.head.querySelectorAll("style")].forEach(
//                 style => this.shadowRoot.appendChild(style));
//
//             [...doc.body.childNodes].forEach(
//                 node => this.shadowRoot.appendChild(node));
//         }
//     }
// );
//
// function load(html) {
//     let el = document.createElement("log-entry");
//
//     el.load(html);
//
//     document.body.appendChild(el);
// }
//
// const sample = color => `
// <!DOCTYPE html>
// <html>
//
// <head>
//   <title>Hello</title>
//   <style>
//     h1 { color: ${color}; }
//   </style>
// </head>
//
// <body>
//   <h1>Hello World</h1>
// </body>
//
// </html>
// `;
//
// load(sample("red"));
// load(sample("green"));
// load(sample("blue"));
