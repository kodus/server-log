// This module implements backwards compatibility with ChromeLogger data.
export function renderLog(log) {
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

.log-entry {
    display: flex;
    padding: 4px 4px 3px 4px;
    border-bottom: solid 1px #e8e8e8;
}

.log-entry--warning {
    background: #fdfbe5;
}

.log-entry--error {
    background: #fbf0f0;
}

.log-entry__icon {
    width: 15px;
}

.log-entry__message {
    flex: 1 1;
}

.log-entry__source {
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
const ICON_MAP = {
    info: "info",
    warn: "warning",
    error: "error"
};
function renderLogRows(log) {
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
                html.push(renderEntry(ICON_MAP[type], renderData(row.log), row.backtrace));
        }
    }
    return html.join("\n");
}
function renderData(data) {
    return data.map(item => html(typeof item === "string" ? item : JSON.stringify(item)))
        .map(html => `<div>${html}</div>`)
        .join("");
}
function renderEntry(icon, content, source) {
    return (`
<div class="log-entry log-entry--${icon}">
    <div class="log-entry__icon">${icon ? `<span class="icon-${icon}"></span>` : ``}</div>
    <div class="log-entry__message">${content}</div>
    ${source ? `<div class="log-entry__source">${html(source)}</div>` : ``}
</div>`);
}
function html(str) {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function* parseLog(data) {
    let log_index = data.columns.indexOf("log");
    let type_index = data.columns.indexOf("type");
    let backtrace_index = data.columns.indexOf("backtrace");
    for (let row of data.rows) {
        yield {
            log: row[log_index],
            type: (row[type_index] || "log"),
            backtrace: row[backtrace_index]
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5RUFBeUU7QUFnQnpFLE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBUTtJQUM5QixPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQTBGRixhQUFhLENBQUMsR0FBRyxDQUFDOzs7UUFHcEIsQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQUVELE1BQU0sUUFBUSxHQUE2QjtJQUN2QyxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxTQUFTO0lBQ2YsS0FBSyxFQUFFLE9BQU87Q0FDakIsQ0FBQztBQUVGLFNBQVMsYUFBYSxDQUFDLEdBQVE7SUFDM0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRWQsS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBRXRCLFFBQVEsSUFBSSxFQUFFO1lBQ1YsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxPQUFPLENBQUM7WUFDYjtnQkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUNsRjtLQUNKO0lBRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUFnQjtJQUNoQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNoRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDO1NBQ2pDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBVSxFQUFFLE9BQWUsRUFBRSxNQUEwQjtJQUN4RSxPQUFPLENBQUM7bUNBQ3VCLElBQUk7bUNBRS9CLElBQUksQ0FBQyxDQUFDLENBQUMscUJBQXFCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUNsRDtzQ0FDa0MsT0FBTztNQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtDQUFrQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRztPQUNyRSxDQUNGLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsR0FBOEI7SUFDeEMsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7U0FDYixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUN0QixPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztTQUN2QixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUN0QixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztTQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxRQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBUztJQUN6QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV4RCxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDdkIsTUFBTTtZQUNGLEdBQUcsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ25CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQWdCO1lBQy9DLFNBQVMsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDO1NBQ2xDLENBQUM7S0FDTDtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIG1vZHVsZSBpbXBsZW1lbnRzIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggQ2hyb21lTG9nZ2VyIGRhdGEuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvZyB7XHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBjb2x1bW5zOiBzdHJpbmdbXTtcclxuICAgIHJvd3M6IGFueTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJvdyB7XHJcbiAgICBsb2c6IGFueTtcclxuICAgIHR5cGU6IFwibG9nXCIgfCBcImluZm9cIiB8IFwid2FyblwiIHwgXCJlcnJvclwiIHwgXCJncm91cFwiIHwgXCJncm91cEVuZFwiIHwgXCJncm91cENvbGxhcHNlZFwiIHwgXCJ0YWJsZVwiO1xyXG4gICAgYmFja3RyYWNlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbnR5cGUgSWNvbiA9IFwiaW5mb1wiIHwgXCJ3YXJuaW5nXCIgfCBcImVycm9yXCIgfCBcImV4cGFuZGVkXCIgfCBcImNvbGxhcHNlZFwiIHwgXCJzcGlubmVyXCIgfCB1bmRlZmluZWQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTG9nKGxvZzogTG9nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAoYDwhRE9DVFlQRSBodG1sPlxyXG48aHRtbD5cclxuPGhlYWQ+XHJcbjxzdHlsZT5cclxuLyoqXHJcbiAqIEljb25zIGxpZnRlZCBmcm9tIGRldnRvb2xzIGhlcmU6XHJcbiAqIFxyXG4gKiAgICAgaHR0cHM6Ly9naXRodWIuY29tL0Nocm9tZURldlRvb2xzL2RldnRvb2xzLWZyb250ZW5kL2Jsb2IvbWFzdGVyL2Zyb250X2VuZC9JbWFnZXMvc21hbGxJY29ucy5wbmdcclxuICpcclxuICogSWYgeW91IG5lZWQgbW9yZSwgZXh0cmFjdCB0aGVtIHVzaW5nIE1ldGhvZERyYXc6XHJcbiAqXHJcbiAqICAgICBodHRwczovL2VkaXRvci5tZXRob2QuYWMvXHJcbiAqXHJcbiAqIFRoZW4gY29tcHJlc3MgdGhlbTpcclxuICpcclxuICogICAgIGh0dHBzOi8vamFrZWFyY2hpYmFsZC5naXRodWIuaW8vc3Znb21nL1xyXG4gKiBcclxuICogQW5kIFVSTC1lbmNvZGUgdGhlbTpcclxuICpcclxuICogICAgIGh0dHBzOi8veW9rc2VsLmdpdGh1Yi5pby91cmwtZW5jb2Rlci9cclxuICovXHJcblxyXG5bY2xhc3NePVwiaWNvbi1cIl0ge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2lkdGg6IDEwcHg7XHJcbiAgICBoZWlnaHQ6IDEwcHg7XHJcbn1cclxuXHJcbi5pY29uLWVycm9yIHtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyUzRSUzQ2RlZnMlM0UlM0NsaW5lYXJHcmFkaWVudCBpZD0nYSclM0UlM0NzdG9wIG9mZnNldD0nMCcgc3RvcC1jb2xvcj0nJTIzZDc2ODdkJy8lM0UlM0NzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nJTIzYjIxNDAyJy8lM0UlM0MvbGluZWFyR3JhZGllbnQlM0UlM0NsaW5lYXJHcmFkaWVudCB5MT0nMScgeDE9Jy41JyB4bGluazpocmVmPSclMjNhJyB4Mj0nLjUnIGlkPSdiJy8lM0UlM0MvZGVmcyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBmaWxsPSd1cmwoJTIzYiknIGQ9J001IDBDMi4yNCAwIDAgMi4yNCAwIDVzMi4yNCA1IDUgNSA1LTIuMjQgNS01LTIuMjQtNS01LTUnLyUzRSUzQ3BhdGggZmlsbD0nJTIzZWIzOTQxJyBkPSdNLjM2IDVDLjM2IDcuNTYgMi40NCA5LjY0IDUgOS42NGMyLjU2IDAgNC42NC0yLjA4IDQuNjQtNC42NEM5LjY0IDIuNDQgNy41Ni4zNiA1IC4zNiAyLjQ0LjM2LjM2IDIuNDQuMzYgNScvJTNFJTNDcGF0aCBzdHJva2U9JyUyM2ZmZicgZD0nTTMgM2w0IDRNNyAzTDMgNycvJTNFJTNDL2clM0UlM0Mvc3ZnJTNFXCIpO1xyXG59XHJcblxyXG4uaWNvbi1pbmZvIHtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyUzRSUzQ2RlZnMlM0UlM0NsaW5lYXJHcmFkaWVudCBpZD0nYSclM0UlM0NzdG9wIG9mZnNldD0nMCcgc3RvcC1jb2xvcj0nJTIzNjA2ZWRhJy8lM0UlM0NzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nJTIzMDIxZGIyJy8lM0UlM0MvbGluZWFyR3JhZGllbnQlM0UlM0NsaW5lYXJHcmFkaWVudCB4bGluazpocmVmPSclMjNhJyB5Mj0nLjUnIHkxPScuNScgeDI9JzEnIGlkPSdiJy8lM0UlM0MvZGVmcyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBmaWxsPSd1cmwoJTIzYiknIGQ9J001IDBDMi4yNCAwIDAgMi4yNCAwIDVzMi4yNCA1IDUgNSA1LTIuMjQgNS01LTIuMjQtNS01LTUnLyUzRSUzQ3BhdGggZmlsbD0nJTIzMmE1M2NkJyBkPSdNLjM2IDVDLjM2IDcuNTYgMi40NCA5LjY0IDUgOS42NGMyLjU2IDAgNC42NC0yLjA4IDQuNjQtNC42NEM5LjY0IDIuNDQgNy41Ni4zNiA1IC4zNiAyLjQ0LjM2LjM2IDIuNDQuMzYgNScvJTNFJTNDcGF0aCBmaWxsPSclMjNmZmYnIGQ9J00zLjkzIDIuMTRjLS4wMy0uNTMuNTUtLjk3IDEuMDYtLjgzLjUuMTIuNzkuNzMuNTYgMS4xOC0uMi40NC0uNzkuNjEtMS4yLjM2YS44MTIuODEyIDAgMCAxLS40Mi0uNzF6bTEuNyA1LjQ2aC42N3YuNTNIMy40MVY3LjZoLjY2VjMuOTloLS42NnYtLjUzaDIuMjJWNy42eicvJTNFJTNDL2clM0UlM0Mvc3ZnJTNFXCIpO1xyXG59XHJcblxyXG4uaWNvbi13YXJuaW5nIHtcclxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNFJTNDcGF0aCBmaWxsPSdub25lJyBkPSdNLTEtMWgxMnYxMkgtMXonLyUzRSUzQ2clM0UlM0NwYXRoIHN0cm9rZT0nJTIzYzE5NjAwJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIGQ9J00xIDlsNC04IDQgOEgxeicvJTNFJTNDcGF0aCBmaWxsPSclMjNmNGJkMDAnIHN0cm9rZT0nJTIzZjViZDAwJyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcgZD0nTTEgOWw0LTggNCA4SDF6Jy8lM0UlM0NwYXRoIGZpbGw9JyUyM2FkODYwMScgZD0nTTMuNzUgMi43NWgyLjV2Mi41TDUuNzUgN2gtMS41bC0uNS0xLjc1di0yLjVtMCA1LjI1aDIuNXYxLjI1aC0yLjUnLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmZmJyBkPSdNNCAzaDJ2Mi4yNUw1LjUgN2gtMUw0IDUuMjVWM20wIDVoMnYxSDQnLyUzRSUzQ3RleHQgZm9udC1mYW1pbHk9J3NhbnMtc2VyaWYnIGZpbGw9JyUyM2NjYycgeT0nMTE4LjM4NycgeD0nNjMuMDUxJyUzRSUzQ3RzcGFuIGZvbnQtc2l6ZT0nOCcgeT0nMTE4LjM4NycgeD0nNjMuMDUxJyUzRWQlM0MvdHNwYW4lM0UlM0MvdGV4dCUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcclxufVxyXG5cclxuLmljb24tZXhwYW5kZWQge1xyXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9J25vbmUnIGQ9J00tMS0xaDEydjEySC0xeicvJTNFJTNDZyUzRSUzQ3BhdGggZD0nTTQuNSA4TDggMkgxJy8lM0UlM0MvZyUzRSUzQy9zdmclM0VcIik7XHJcbn1cclxuXHJcbi5pY29uLWNvbGxhcHNlZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBkPSdNNyA0LjVMMiAxdjcnLyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcclxufVxyXG5cclxuLmljb24tc3Bpbm5lciB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgcHJlc2VydmVBc3BlY3RSYXRpbz0neE1pZFlNaWQnIGNsYXNzPSdsZHMtcm9sbGluZycgc3R5bGU9J2JhY2tncm91bmQ6MCAwJyUzRSUzQ2NpcmNsZSBjeD0nNTAnIGN5PSc1MCcgZmlsbD0nbm9uZScgc3Ryb2tlPSclMjM3NTdlZDEnIHN0cm9rZS13aWR0aD0nMTUnIHI9JzQwJyBzdHJva2UtZGFzaGFycmF5PScxODguNDk1NTU5MjE1Mzg3NTcgNjQuODMxODUzMDcxNzk1ODYnIHRyYW5zZm9ybT0ncm90YXRlKDI3NS4zMjcgNTAgNTApJyUzRSUzQ2FuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0ndHJhbnNmb3JtJyB0eXBlPSdyb3RhdGUnIGNhbGNNb2RlPSdsaW5lYXInIHZhbHVlcz0nMCA1MCA1MDszNjAgNTAgNTAnIGtleVRpbWVzPScwOzEnIGR1cj0nMC41cycgYmVnaW49JzBzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvJTNFJTNDL2NpcmNsZSUzRSUzQy9zdmclM0VcIik7XHJcbn1cclxuXHJcbi5sb2cge1xyXG4gICAgZm9udC1mYW1pbHk6IENvbnNvbGFzLCBMdWNpZGEgQ29uc29sZSwgQ291cmllciBOZXcsIE1lbmxvLCBkZWphdnUgc2FucyBtb25vLCBtb25vc3BhY2U7XHJcbiAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcclxufVxyXG5cclxuLmxvZy1lbnRyeSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgcGFkZGluZzogNHB4IDRweCAzcHggNHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4ICNlOGU4ZTg7XHJcbn1cclxuXHJcbi5sb2ctZW50cnktLXdhcm5pbmcge1xyXG4gICAgYmFja2dyb3VuZDogI2ZkZmJlNTtcclxufVxyXG5cclxuLmxvZy1lbnRyeS0tZXJyb3Ige1xyXG4gICAgYmFja2dyb3VuZDogI2ZiZjBmMDtcclxufVxyXG5cclxuLmxvZy1lbnRyeV9faWNvbiB7XHJcbiAgICB3aWR0aDogMTVweDtcclxufVxyXG5cclxuLmxvZy1lbnRyeV9fbWVzc2FnZSB7XHJcbiAgICBmbGV4OiAxIDE7XHJcbn1cclxuXHJcbi5sb2ctZW50cnlfX3NvdXJjZSB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBmbG9hdDogcmlnaHQ7XHJcbiAgICBjb2xvcjogIzg4ODtcclxuICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xyXG59XHJcblxyXG48L3N0eWxlPlxyXG48L2hlYWQ+XHJcbjxib2R5PlxyXG4gICAgPGRpdiBjbGFzcz1cImxvZ1wiPlxyXG4gICAgICAgICR7cmVuZGVyTG9nUm93cyhsb2cpfVxyXG4gICAgPC9kaXY+XHJcbjwvYm9keT5cclxuPC9odG1sPmApO1xyXG59XHJcblxyXG5jb25zdCBJQ09OX01BUDogeyBbdHlwZTogc3RyaW5nXTogSWNvbiB9ID0ge1xyXG4gICAgaW5mbzogXCJpbmZvXCIsXHJcbiAgICB3YXJuOiBcIndhcm5pbmdcIixcclxuICAgIGVycm9yOiBcImVycm9yXCJcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckxvZ1Jvd3MobG9nOiBMb2cpOiBzdHJpbmcge1xyXG4gICAgbGV0IGh0bWwgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCByb3cgb2YgcGFyc2VMb2cobG9nKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJvdyk7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHJvdy50eXBlO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImxvZ1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwiaW5mb1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwid2FyblwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiZXJyb3JcIjpcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGh0bWwucHVzaChyZW5kZXJFbnRyeShJQ09OX01BUFt0eXBlXSwgcmVuZGVyRGF0YShyb3cubG9nKSwgcm93LmJhY2t0cmFjZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaHRtbC5qb2luKFwiXFxuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJEYXRhKGRhdGE6IEFycmF5PGFueT4pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGRhdGEubWFwKGl0ZW0gPT4gaHRtbCh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiA/IGl0ZW0gOiBKU09OLnN0cmluZ2lmeShpdGVtKSkpXHJcbiAgICAgICAgLm1hcChodG1sID0+IGA8ZGl2PiR7aHRtbH08L2Rpdj5gKVxyXG4gICAgICAgIC5qb2luKFwiXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJFbnRyeShpY29uOiBJY29uLCBjb250ZW50OiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAoYFxyXG48ZGl2IGNsYXNzPVwibG9nLWVudHJ5IGxvZy1lbnRyeS0tJHtpY29ufVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImxvZy1lbnRyeV9faWNvblwiPiR7XHJcbiAgICAgICAgaWNvbiA/IGA8c3BhbiBjbGFzcz1cImljb24tJHtpY29ufVwiPjwvc3Bhbj5gIDogYGBcclxuICAgIH08L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJsb2ctZW50cnlfX21lc3NhZ2VcIj4ke2NvbnRlbnR9PC9kaXY+XHJcbiAgICAkeyBzb3VyY2UgPyBgPGRpdiBjbGFzcz1cImxvZy1lbnRyeV9fc291cmNlXCI+JHtodG1sKHNvdXJjZSl9PC9kaXY+YCA6IGBgIH1cclxuPC9kaXY+YFxyXG4gICAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaHRtbChzdHI6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChzdHIgfHwgJycpXHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gKiBwYXJzZUxvZyhkYXRhOiBMb2cpOiBJdGVyYWJsZUl0ZXJhdG9yPFJvdz4ge1xyXG4gICAgbGV0IGxvZ19pbmRleCA9IGRhdGEuY29sdW1ucy5pbmRleE9mKFwibG9nXCIpO1xyXG4gICAgbGV0IHR5cGVfaW5kZXggPSBkYXRhLmNvbHVtbnMuaW5kZXhPZihcInR5cGVcIik7XHJcbiAgICBsZXQgYmFja3RyYWNlX2luZGV4ID0gZGF0YS5jb2x1bW5zLmluZGV4T2YoXCJiYWNrdHJhY2VcIik7XHJcblxyXG4gICAgZm9yIChsZXQgcm93IG9mIGRhdGEucm93cykge1xyXG4gICAgICAgIHlpZWxkIHtcclxuICAgICAgICAgICAgbG9nOiByb3dbbG9nX2luZGV4XSxcclxuICAgICAgICAgICAgdHlwZTogKHJvd1t0eXBlX2luZGV4XSB8fCBcImxvZ1wiKSBhcyBSb3dbXCJ0eXBlXCJdLFxyXG4gICAgICAgICAgICBiYWNrdHJhY2U6IHJvd1tiYWNrdHJhY2VfaW5kZXhdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXX0=