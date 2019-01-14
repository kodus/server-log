import { renderLog, Log } from "./log.js";
import { Request, Response } from "har-format";

type Icon = "spinner" | "error" | "check" | undefined;

/**
 * This custom element allows us to isolate server-side log pages in a shadow-root.
 */
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

    panel.onNavigation = url => {
        console.log("ON NAVIGATION", url);

        // TODO add "Preserve Log" option (similar to the "Network" tab)
        $content.innerHTML = "";
    };

    panel.onRequest = transaction => {
        console.log("ON REQUEST", transaction);

        // NOTE: weird typecasts required here because the request/response properties
        //       aren't defined in `@types/chrome` - we have to pull these definitions
        //       from a separate package `@types/har-format` and manually cast:

        const request = (transaction as any).request as Request;
        const response = (transaction as any).response as Response;

        const title = `[${response.status} ${response.statusText}] ${request.method} ${request.url}`;

        for (let header of response.headers) {
            const name = header.name.toLowerCase();

            if (name === "x-chromelogger-data") {
                appendLog(title, "X-ChromeLogger-Data", new Promise((resolve, reject) => {
                    try {
                        const log = JSON.parse(atob(header.value));

                        console.log("PARSED CHROME-LOGGER HEADER", log);

                        resolve(renderLog(log as Log));
                    } catch (error) {
                        reject(`Error parsing X-ChromeLogger-Data header (${error})`);
                    }
                }));
            }
        }
    }

    /**
     * Append a log document to the "Server Log" panel
     */
    function appendLog(title: string, source: string, documentPromise: Promise<string>) {
        const header = appendHeader("spinner", title, source);

        const el = document.createElement("log-entry") as LogEntry;

        $content.appendChild(el);

        documentPromise
            .then(html => {
                el.setHTML(html);

                header.setIcon("check");
            })
            .catch(error => {
                el.setHTML(`<pre style="color:red; padding-left:20px;">${html(error)}</pre>`);

                header.setIcon("error");
            });
    }

    /**
     * Create a header with an icon, title and source of the request
     */
    function appendHeader(icon: Icon, title: string, source: string) {
        const el = document.createElement("div");

        el.innerHTML = (`
            <div class="header ${icon ? `header--${icon}` : ``}">
                <div class="header__icon">${
                    icon ? `<span class="icon"></span>` : ``
                }</div>
                <div class="header__title">${html(title)}</div>
                <div class="header__source">${html(source)}</div>
            </div>`
        );

        $content.appendChild(el);

        function setIcon(icon: Icon) {
            el.querySelector(".icon")!.className = `icon icon-${icon}`;
        };

        setIcon(icon);

        return {
            setIcon
        };
    }
        
    /**
     * Escape plain text as HTML
     */
    function html(str: string | null | undefined): string {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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
