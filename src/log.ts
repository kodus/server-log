// This module implements backwards compatibility with ChromeLogger data.

export interface Log {
    version: string;
    columns: string[];
    rows: Array<any>;
}

interface Row {
    log: any;
    type: "log" | "info" | "warn" | "error" | "group" | "groupEnd" | "groupCollapsed" | "table";
    backtrace: string | undefined;
}

type Icon = "info" | "warning" | "error" | "collapse" | undefined;

/**
 * Map where log-entry type -> icon name
 */
const ICON_MAP: { [type: string]: Icon } = {
    warn: "warning",
    error: "error"
};

/**
 * Parse log-data from ChromeLogger's "packed" format into Row structures
 */
function * parseLog(data: Log): IterableIterator<Row> {
    let log_index = data.columns.indexOf("log");
    let type_index = data.columns.indexOf("type");
    let backtrace_index = data.columns.indexOf("backtrace");

    for (let row of data.rows) {
        yield {
            log: row[log_index],
            type: (row[type_index] || "log") as Row["type"],
            backtrace: row[backtrace_index]
        };
    }
}

/**
 * Render a console-like HTML page from ChromeLogger's "packed" format
 */
export function renderLog(log: Log): string {
    return (`<!DOCTYPE html>
        <html>
        <head>
        <style>
        /**
         * Icons lifted from devtools here:
         * 
         *     https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/Images/smallIcons.png
         *
         * If you need more, extract them using MethodDraw:
         *
         *     https://editor.method.ac/
         *
         * Then compress them:
         *
         *     https://jakearchibald.github.io/svgomg/
         * 
         * And URL-encode them:
         *
         *     https://yoksel.github.io/url-encoder/
         */

        pre {
            margin: 0;
        }

        [class^="icon-"] {
            display: inline-block;
            width: 10px;
            height: 10px;
        }

        .icon-error {
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3ClinearGradient id='a'%3E%3Cstop offset='0' stop-color='%23d7687d'/%3E%3Cstop offset='1' stop-color='%23b21402'/%3E%3C/linearGradient%3E%3ClinearGradient y1='1' x1='.5' xlink:href='%23a' x2='.5' id='b'/%3E%3C/defs%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath fill='url(%23b)' d='M5 0C2.24 0 0 2.24 0 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5'/%3E%3Cpath fill='%23eb3941' d='M.36 5C.36 7.56 2.44 9.64 5 9.64c2.56 0 4.64-2.08 4.64-4.64C9.64 2.44 7.56.36 5 .36 2.44.36.36 2.44.36 5'/%3E%3Cpath stroke='%23fff' d='M3 3l4 4M7 3L3 7'/%3E%3C/g%3E%3C/svg%3E");
        }

        .icon-warning {
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath stroke='%23c19600' stroke-width='2' stroke-linejoin='round' d='M1 9l4-8 4 8H1z'/%3E%3Cpath fill='%23f4bd00' stroke='%23f5bd00' stroke-width='1.5' stroke-linejoin='round' d='M1 9l4-8 4 8H1z'/%3E%3Cpath fill='%23ad8601' d='M3.75 2.75h2.5v2.5L5.75 7h-1.5l-.5-1.75v-2.5m0 5.25h2.5v1.25h-2.5'/%3E%3Cpath fill='%23fff' d='M4 3h2v2.25L5.5 7h-1L4 5.25V3m0 5h2v1H4'/%3E%3Ctext font-family='sans-serif' fill='%23ccc' y='118.387' x='63.051'%3E%3Ctspan font-size='8' y='118.387' x='63.051'%3Ed%3C/tspan%3E%3C/text%3E%3C/g%3E%3C/svg%3E");
        }

        .icon-collapse {
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath d='M7 4.5L2 1v7'/%3E%3C/g%3E%3C/svg%3E");
        }

        .log {
            font-family: Consolas, Lucida Console, Courier New, Menlo, dejavu sans mono, monospace;
            font-size: 12px !important;
        }

        .log-item {
            display: flex;
            padding: 4px 4px 3px 4px;
            border-bottom: solid 1px #e8e8e8;
        }

        .log-item--warning {
            background: #fffcdc;
            color: #753737;
        }

        .log-item--error {
            background: #ffeaea;
            color: #f73131;
        }

        .log-item__icon {
            width: 15px;
        }

        .log-item__content {
            flex: 1 1;
        }

        .log-item__source {
            display: inline-block;
            float: right;
            color: #888;
            margin-left: 20px;
        }

        .collapsible {
            display: none;
        }

        .collapsible + label {
            font-weight: bold;
            display: block;
        }

        .collapsible__content {
            margin-left: 10px;
            border-left: dotted 1px #888;
            padding-left: 10px;
        }

        .collapsible + label + .collapsible__content {
            display: none;
        }

        .collapsible:checked + label + .collapsible__content {
            display: block;
        }

        .collapsible:checked + label .icon-collapse {
            /* expanded */
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath d='M4.5 8L8 2H1'/%3E%3C/g%3E%3C/svg%3E");
        }

        </style>
        </head>
        <body>
            <div class="log">
                ${renderLogRows(log)}
            </div>
        </body>
        </html>`
    );
}

/**
 * Render unpackaged log-rows to HTML
 */
function renderLogRows(log: Log): string {
    let html: string[] = [];
    let groups: Array<{ title: string, collapsed: boolean, html: string[] }> = [{ title: "", collapsed: false, html }];

    /** append HTML to the top of the stack */
    const append = (html: string) => groups[groups.length-1].html.push(html);

    /** push to the stack */
    const startGroup = (title: string, collapsed: boolean) => groups.push({ title, collapsed, html: [] });

    /** pop from the stack */
    const endGroup = () => {
        const item = groups.pop()!;
        append(renderGroup(item.title, item.html.join("\n"), item.collapsed));
    }

    for (let row of parseLog(log)) {
        console.log(row);
        const type = row.type;
        const content = renderData(row.log);

        switch (type) {
            case "log":
            case "info":
            case "warn":
            case "error":
            default:
                append(renderItem(ICON_MAP[type], content, row.backtrace));
                break;
            
            case "group":
                startGroup(content, false);
                break;

            case "groupCollapsed":
                startGroup(content, true);
                break;

            case "groupEnd":
                endGroup();
                break;

            case "table":
                //  TODO
                break;
        }
    }

    return html.join("\n");
}

/**
 * Render log-data (of any JSON-like type) as HTML
 */
function renderData(data: Array<any>): string {
    // TODO improve JSON tree rendering
    return data.map(item => html(typeof item === "string" ? item : JSON.stringify(item, null, 2)))
        .map(html => `<pre>${html}</pre>`)
        .join("");
}

/**
 * Render an individual log-item
 */
function renderItem(icon: Icon, content: string, source?: string): string {
    return (`
        <div class="log-item ${icon ? `log-item--${icon}` : ``}">
            <div class="log-item__icon">${
                icon ? `<span class="icon-${icon}"></span>` : ``
            }</div>
            <div class="log-item__content">${content}</div>
            ${ source ? `<div class="log-item__source">${html(source)}</div>` : `` }
        </div>`
    );
}

/**
 * Render a collapsible group
 */
const renderGroup = (() => {
    /** group number (to create unique id-attributes) */
    let group_id = 0;

    return function renderGroup(title: string, content: string, collapsed: boolean, source?: string): string {
        const id = `group-${group_id++}`;
    
        return (`
            <input type="checkbox" ${collapsed ? "" : "checked"} class="collapsible" id="${id}">
            <label for="${id}">${renderItem("collapse", title, source)}</label>
            <div class="collapsible__content">${content}</div>
        `);
    }
})();

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
