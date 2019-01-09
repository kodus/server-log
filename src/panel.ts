console.log("START: panel.js");

const panel_window = window as PanelWindow;

panel_window.onRequest = request => {
    console.log("ON REQUEST", request);
}

panel_window.onNavigation = url => {
    console.log("ON NAVIGATION", url);
};

/*

// NOTE: don't need this for now - might need it to communicate with "background.js"

panel_window.do_something = (msg: string) => {
    console.log("DOING SOMETHING");
    document.body.textContent += '\n' + msg; // Stupid example, PoC
}

document.documentElement.onclick = function() {
    // No need to check for the existence of `respond`, because
    // the panel can only be clicked when it's visible...
    panel_window.respond('Another stupid example!');
};
*/

// chrome.devtools.network.onRequestFinished.addListener(request => {
//     console.log("REQUEST", request);
// });


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