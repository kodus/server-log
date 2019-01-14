import { renderLog, Log } from "./log.js";
import { Request, Response } from "har-format";

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

    panel.onRequest = transaction => {
        console.log("ON REQUEST", transaction);

        // NOTE: weird typecasts required here because the request/response properties
        //       aren't defined in `@types/chrome` - we have to pull these definitions
        //       from a separate package `@types/har-format` and manually cast:

        const request = (transaction as any).request as Request;
        const response = (transaction as any).response as Response;

        for (let header of response.headers) {
            const name = header.name.toLowerCase();

            if (name === "x-chromelogger-data") {
                try {
                    const log = JSON.parse(atob(header.value));
                    console.log("PARSE LOG", log);

                    appendContent(Promise.resolve(renderLog(log as Log)));
                } catch (e) {
                    console.error(e);
                }
            }
        }
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
