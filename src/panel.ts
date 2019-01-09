class LogEntry extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    }

    setHTML(html: string) {
        let doc = new DOMParser().parseFromString(html, "text/html");

        this.style.display = "block";

        [...doc.head.querySelectorAll("style")].forEach(
            style => this.shadow.appendChild(style));

        [...doc.body.childNodes].forEach(
            node => this.shadow.appendChild(node));
    }
}

customElements.define("log-entry", LogEntry);

((panel: PanelWindow) => {

    console.log("START: panel.js");

    const $content = document.body.querySelector<HTMLElement>("[data-content]")!;

    panel.onRequest = request => {
        console.log("ON REQUEST", request);

        appendContent(loadDocument((request as any).request.url))
    }

    panel.onNavigation = url => {
        console.log("ON NAVIGATION", url);

        $content.innerHTML = "";

        appendContent(Promise.resolve(`<h1>${url}</h1>`));
    };

    function appendContent(html: Promise<string>) {
        const el = document.createElement("log-entry") as LogEntry;

        $content.appendChild(el);

        html.then(html => el.setHTML(html));
    }
    
    // TODO load real content

    const loadDocument = (url: string) => new Promise<string>(resolve => resolve(`
    <!DOCTYPE html>
    <html>
    
    <head>
      <title>Hello</title>
      <style>
        h2 { color: red; }
      </style>
    </head>
    
    <body>
      <h2>${url}</h2>
    </body>
    
    </html>
    `));
    
})(window as PanelWindow);

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
