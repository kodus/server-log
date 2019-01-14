// This module implements backwards compatibility with ChromeLogger data.

export interface Log {
    version: string;
    columns: string[];
    rows: any;
}

interface Row {
    log: any;
    type: "log" | "info" | "warn" | "error" | "group" | "groupEnd" | "groupCollapsed" | "table";
    backtrace: string | undefined;
}

type Icon = "info" | "warning" | "error" | "expanded" | "collapsed" | "spinner" | undefined;

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

[class^="icon-"] {
    display: inline-block;
    width: 10px;
    height: 10px;
}

.icon-error {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3ClinearGradient id='a'%3E%3Cstop offset='0' stop-color='%23d7687d'/%3E%3Cstop offset='1' stop-color='%23b21402'/%3E%3C/linearGradient%3E%3ClinearGradient y1='1' x1='.5' xlink:href='%23a' x2='.5' id='b'/%3E%3C/defs%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath fill='url(%23b)' d='M5 0C2.24 0 0 2.24 0 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5'/%3E%3Cpath fill='%23eb3941' d='M.36 5C.36 7.56 2.44 9.64 5 9.64c2.56 0 4.64-2.08 4.64-4.64C9.64 2.44 7.56.36 5 .36 2.44.36.36 2.44.36 5'/%3E%3Cpath stroke='%23fff' d='M3 3l4 4M7 3L3 7'/%3E%3C/g%3E%3C/svg%3E");
}

.icon-info {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3ClinearGradient id='a'%3E%3Cstop offset='0' stop-color='%23606eda'/%3E%3Cstop offset='1' stop-color='%23021db2'/%3E%3C/linearGradient%3E%3ClinearGradient xlink:href='%23a' y2='.5' y1='.5' x2='1' id='b'/%3E%3C/defs%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath fill='url(%23b)' d='M5 0C2.24 0 0 2.24 0 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5'/%3E%3Cpath fill='%232a53cd' d='M.36 5C.36 7.56 2.44 9.64 5 9.64c2.56 0 4.64-2.08 4.64-4.64C9.64 2.44 7.56.36 5 .36 2.44.36.36 2.44.36 5'/%3E%3Cpath fill='%23fff' d='M3.93 2.14c-.03-.53.55-.97 1.06-.83.5.12.79.73.56 1.18-.2.44-.79.61-1.2.36a.812.812 0 0 1-.42-.71zm1.7 5.46h.67v.53H3.41V7.6h.66V3.99h-.66v-.53h2.22V7.6z'/%3E%3C/g%3E%3C/svg%3E");
}

.icon-warning {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath stroke='%23c19600' stroke-width='2' stroke-linejoin='round' d='M1 9l4-8 4 8H1z'/%3E%3Cpath fill='%23f4bd00' stroke='%23f5bd00' stroke-width='1.5' stroke-linejoin='round' d='M1 9l4-8 4 8H1z'/%3E%3Cpath fill='%23ad8601' d='M3.75 2.75h2.5v2.5L5.75 7h-1.5l-.5-1.75v-2.5m0 5.25h2.5v1.25h-2.5'/%3E%3Cpath fill='%23fff' d='M4 3h2v2.25L5.5 7h-1L4 5.25V3m0 5h2v1H4'/%3E%3Ctext font-family='sans-serif' fill='%23ccc' y='118.387' x='63.051'%3E%3Ctspan font-size='8' y='118.387' x='63.051'%3Ed%3C/tspan%3E%3C/text%3E%3C/g%3E%3C/svg%3E");
}

.icon-expanded {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath d='M4.5 8L8 2H1'/%3E%3C/g%3E%3C/svg%3E");
}

.icon-collapsed {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M-1-1h12v12H-1z'/%3E%3Cg%3E%3Cpath d='M7 4.5L2 1v7'/%3E%3C/g%3E%3C/svg%3E");
}

.icon-spinner {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='lds-rolling' style='background:0 0'%3E%3Ccircle cx='50' cy='50' fill='none' stroke='%23757ed1' stroke-width='15' r='40' stroke-dasharray='188.49555921538757 64.83185307179586' transform='rotate(275.327 50 50)'%3E%3CanimateTransform attributeName='transform' type='rotate' calcMode='linear' values='0 50 50;360 50 50' keyTimes='0;1' dur='0.5s' begin='0s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E");
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
    background: #fdfbe5;
}

.log-item--error {
    background: #fbf0f0;
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

</style>
</head>
<body>
    <div class="log">
        ${renderLogRows(log)}
    </div>
</body>
</html>`);
}

const ICON_MAP: { [type: string]: Icon } = {
    info: "info",
    warn: "warning",
    error: "error"
};

function renderLogRows(log: Log): string {
    let html = [];

    for (let row of parseLog(log)) {
        console.log(row);
        const type = row.type;

        switch (type) {
            case "log":
            case "info":
            case "warn":
            case "error":
            default:
                html.push(renderItem(ICON_MAP[type], renderData(row.log), row.backtrace));
        }
    }

    return html.join("\n");
}

function renderData(data: Array<any>): string {
    return data.map(item => html(typeof item === "string" ? item : JSON.stringify(item)))
        .map(html => `<div>${html}</div>`)
        .join("");
}

function renderItem(icon: Icon, content: string, source: string | undefined): string {
    return (`
<div class="log-item log-item--${icon}">
    <div class="log-item__icon">${
        icon ? `<span class="icon-${icon}"></span>` : ``
    }</div>
    <div class="log-item__content">${content}</div>
    ${ source ? `<div class="log-item__source">${html(source)}</div>` : `` }
</div>`
    );
}

function html(str: string | null | undefined): string {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

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
