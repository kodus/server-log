// This module implements backwards compatibility with ChromeLogger data.
/**
 * Map where log-entry type -> icon name
 */
const ICON_MAP = {
    warn: "warning",
    error: "error"
};
/**
 * Parse log-data from ChromeLogger's "packed" format into Row structures
 */
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
/**
 * Render a console-like HTML page from ChromeLogger's "packed" format
 */
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
        </html>`);
}
/**
 * Render unpackaged log-rows to HTML
 */
function renderLogRows(log) {
    let html = [];
    let groups = [{ title: "", collapsed: false, html }];
    /** append HTML to the top of the stack */
    const append = (html) => groups[groups.length - 1].html.push(html);
    /** push to the stack */
    const startGroup = (title, collapsed) => groups.push({ title, collapsed, html: [] });
    /** pop from the stack */
    const endGroup = () => {
        const item = groups.pop();
        append(renderGroup(item.title, item.html.join("\n"), item.collapsed));
    };
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
function renderData(data) {
    // TODO improve JSON tree rendering
    return data.map(item => html(typeof item === "string" ? item : JSON.stringify(item, null, 2)))
        .map(html => `<pre>${html}</pre>`)
        .join("");
}
/**
 * Render an individual log-item
 */
function renderItem(icon, content, source) {
    return (`
        <div class="log-item ${icon ? `log-item--${icon}` : ``}">
            <div class="log-item__icon">${icon ? `<span class="icon-${icon}"></span>` : ``}</div>
            <div class="log-item__content">${content}</div>
            ${source ? `<div class="log-item__source">${html(source)}</div>` : ``}
        </div>`);
}
/**
 * Render a collapsible group
 */
const renderGroup = (() => {
    /** group number (to create unique id-attributes) */
    let group_id = 0;
    return function renderGroup(title, content, collapsed, source) {
        const id = `group-${group_id++}`;
        return (`
            <input type="checkbox" ${collapsed ? "" : "checked"} class="collapsible" id="${id}">
            <label for="${id}">${renderItem("collapse", title, source)}</label>
            <div class="collapsible__content">${content}</div>
        `);
    };
})();
/**
 * Escape plain text as HTML
 */
function html(str) {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5RUFBeUU7QUFnQnpFOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQTZCO0lBQ3ZDLElBQUksRUFBRSxTQUFTO0lBQ2YsS0FBSyxFQUFFLE9BQU87Q0FDakIsQ0FBQztBQUVGOztHQUVHO0FBQ0gsUUFBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQVM7SUFDekIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFeEQsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ3ZCLE1BQU07WUFDRixHQUFHLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUNuQixJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFnQjtZQUMvQyxTQUFTLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQztTQUNsQyxDQUFDO0tBQ0w7QUFDTCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLEdBQVE7SUFDOUIsT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQWdITSxhQUFhLENBQUMsR0FBRyxDQUFDOzs7Z0JBR3BCLENBQ1gsQ0FBQztBQUNOLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsYUFBYSxD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dGliaWxpdHkgd2l0aCBDaHJvbWVMb2dnZXIgZGF0YS5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9nIHtcclxuICAgIHZlcnNpb246IHN0cmluZztcclxuICAgIGNvbHVtbnM6IHN0cmluZ1tdO1xyXG4gICAgcm93czogQXJyYXk8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJvdyB7XHJcbiAgICBsb2c6IGFueTtcclxuICAgIHR5cGU6IFwibG9nXCIgfCBcImluZm9cIiB8IFwid2FyblwiIHwgXCJlcnJvclwiIHwgXCJncm91cFwiIHwgXCJncm91cEVuZFwiIHwgXCJncm91cENvbGxhcHNlZFwiIHwgXCJ0YWJsZVwiO1xyXG4gICAgYmFja3RyYWNlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbnR5cGUgSWNvbiA9IFwiaW5mb1wiIHwgXCJ3YXJuaW5nXCIgfCBcImVycm9yXCIgfCBcImNvbGxhcHNlXCIgfCB1bmRlZmluZWQ7XHJcblxyXG4vKipcclxuICogTWFwIHdoZXJlIGxvZy1lbnRyeSB0eXBlIC0+IGljb24gbmFtZVxyXG4gKi9cclxuY29uc3QgSUNPTl9NQVA6IHsgW3R5cGU6IHN0cmluZ106IEljb24gfSA9IHtcclxuICAgIHdhcm46IFwid2FybmluZ1wiLFxyXG4gICAgZXJyb3I6IFwiZXJyb3JcIlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGxvZy1kYXRhIGZyb20gQ2hyb21lTG9nZ2VyJ3MgXCJwYWNrZWRcIiBmb3JtYXQgaW50byBSb3cgc3RydWN0dXJlc1xyXG4gKi9cclxuZnVuY3Rpb24gKiBwYXJzZUxvZyhkYXRhOiBMb2cpOiBJdGVyYWJsZUl0ZXJhdG9yPFJvdz4ge1xyXG4gICAgbGV0IGxvZ19pbmRleCA9IGRhdGEuY29sdW1ucy5pbmRleE9mKFwibG9nXCIpO1xyXG4gICAgbGV0IHR5cGVfaW5kZXggPSBkYXRhLmNvbHVtbnMuaW5kZXhPZihcInR5cGVcIik7XHJcbiAgICBsZXQgYmFja3RyYWNlX2luZGV4ID0gZGF0YS5jb2x1bW5zLmluZGV4T2YoXCJiYWNrdHJhY2VcIik7XHJcblxyXG4gICAgZm9yIChsZXQgcm93IG9mIGRhdGEucm93cykge1xyXG4gICAgICAgIHlpZWxkIHtcclxuICAgICAgICAgICAgbG9nOiByb3dbbG9nX2luZGV4XSxcclxuICAgICAgICAgICAgdHlwZTogKHJvd1t0eXBlX2luZGV4XSB8fCBcImxvZ1wiKSBhcyBSb3dbXCJ0eXBlXCJdLFxyXG4gICAgICAgICAgICBiYWNrdHJhY2U6IHJvd1tiYWNrdHJhY2VfaW5kZXhdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbmRlciBhIGNvbnNvbGUtbGlrZSBIVE1MIHBhZ2UgZnJvbSBDaHJvbWVMb2dnZXIncyBcInBhY2tlZFwiIGZvcm1hdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckxvZyhsb2c6IExvZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKGA8IURPQ1RZUEUgaHRtbD5cclxuICAgICAgICA8aHRtbD5cclxuICAgICAgICA8aGVhZD5cclxuICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWNvbnMgbGlmdGVkIGZyb20gZGV2dG9vbHMgaGVyZTpcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiAgICAgaHR0cHM6Ly9naXRodWIuY29tL0Nocm9tZURldlRvb2xzL2RldnRvb2xzLWZyb250ZW5kL2Jsb2IvbWFzdGVyL2Zyb250X2VuZC9JbWFnZXMvc21hbGxJY29ucy5wbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmIHlvdSBuZWVkIG1vcmUsIGV4dHJhY3QgdGhlbSB1c2luZyBNZXRob2REcmF3OlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogICAgIGh0dHBzOi8vZWRpdG9yLm1ldGhvZC5hYy9cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZW4gY29tcHJlc3MgdGhlbTpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAgICBodHRwczovL2pha2VhcmNoaWJhbGQuZ2l0aHViLmlvL3N2Z29tZy9cclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiBBbmQgVVJMLWVuY29kZSB0aGVtOlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogICAgIGh0dHBzOi8veW9rc2VsLmdpdGh1Yi5pby91cmwtZW5jb2Rlci9cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgcHJlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgW2NsYXNzXj1cImljb24tXCJdIHtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgICB3aWR0aDogMTBweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmljb24tZXJyb3Ige1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayclM0UlM0NkZWZzJTNFJTNDbGluZWFyR3JhZGllbnQgaWQ9J2EnJTNFJTNDc3RvcCBvZmZzZXQ9JzAnIHN0b3AtY29sb3I9JyUyM2Q3Njg3ZCcvJTNFJTNDc3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyUyM2IyMTQwMicvJTNFJTNDL2xpbmVhckdyYWRpZW50JTNFJTNDbGluZWFyR3JhZGllbnQgeTE9JzEnIHgxPScuNScgeGxpbms6aHJlZj0nJTIzYScgeDI9Jy41JyBpZD0nYicvJTNFJTNDL2RlZnMlM0UlM0NwYXRoIGZpbGw9J25vbmUnIGQ9J00tMS0xaDEydjEySC0xeicvJTNFJTNDZyUzRSUzQ3BhdGggZmlsbD0ndXJsKCUyM2IpJyBkPSdNNSAwQzIuMjQgMCAwIDIuMjQgMCA1czIuMjQgNSA1IDUgNS0yLjI0IDUtNS0yLjI0LTUtNS01Jy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ViMzk0MScgZD0nTS4zNiA1Qy4zNiA3LjU2IDIuNDQgOS42NCA1IDkuNjRjMi41NiAwIDQuNjQtMi4wOCA0LjY0LTQuNjRDOS42NCAyLjQ0IDcuNTYuMzYgNSAuMzYgMi40NC4zNi4zNiAyLjQ0LjM2IDUnLyUzRSUzQ3BhdGggc3Ryb2tlPSclMjNmZmYnIGQ9J00zIDNsNCA0TTcgM0wzIDcnLyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5pY29uLXdhcm5pbmcge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBzdHJva2U9JyUyM2MxOTYwMCcgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyBkPSdNMSA5bDQtOCA0IDhIMXonLyUzRSUzQ3BhdGggZmlsbD0nJTIzZjRiZDAwJyBzdHJva2U9JyUyM2Y1YmQwMCcgc3Ryb2tlLXdpZHRoPScxLjUnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIGQ9J00xIDlsNC04IDQgOEgxeicvJTNFJTNDcGF0aCBmaWxsPSclMjNhZDg2MDEnIGQ9J00zLjc1IDIuNzVoMi41djIuNUw1Ljc1IDdoLTEuNWwtLjUtMS43NXYtMi41bTAgNS4yNWgyLjV2MS4yNWgtMi41Jy8lM0UlM0NwYXRoIGZpbGw9JyUyM2ZmZicgZD0nTTQgM2gydjIuMjVMNS41IDdoLTFMNCA1LjI1VjNtMCA1aDJ2MUg0Jy8lM0UlM0N0ZXh0IGZvbnQtZmFtaWx5PSdzYW5zLXNlcmlmJyBmaWxsPSclMjNjY2MnIHk9JzExOC4zODcnIHg9JzYzLjA1MSclM0UlM0N0c3BhbiBmb250LXNpemU9JzgnIHk9JzExOC4zODcnIHg9JzYzLjA1MSclM0VkJTNDL3RzcGFuJTNFJTNDL3RleHQlM0UlM0MvZyUzRSUzQy9zdmclM0VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuaWNvbi1jb2xsYXBzZSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNFJTNDcGF0aCBmaWxsPSdub25lJyBkPSdNLTEtMWgxMnYxMkgtMXonLyUzRSUzQ2clM0UlM0NwYXRoIGQ9J003IDQuNUwyIDF2NycvJTNFJTNDL2clM0UlM0Mvc3ZnJTNFXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZyB7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBDb25zb2xhcywgTHVjaWRhIENvbnNvbGUsIENvdXJpZXIgTmV3LCBNZW5sbywgZGVqYXZ1IHNhbnMgbW9ubywgbW9ub3NwYWNlO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5sb2ctaXRlbSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCA0cHggM3B4IDRweDtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4ICNlOGU4ZTg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAubG9nLWl0ZW0tLXdhcm5pbmcge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmY2RjO1xyXG4gICAgICAgICAgICBjb2xvcjogIzc1MzczNztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5sb2ctaXRlbS0tZXJyb3Ige1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZlYWVhO1xyXG4gICAgICAgICAgICBjb2xvcjogI2Y3MzEzMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5sb2ctaXRlbV9faWNvbiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxNXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZy1pdGVtX19jb250ZW50IHtcclxuICAgICAgICAgICAgZmxleDogMSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZy1pdGVtX19zb3VyY2Uge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIGZsb2F0OiByaWdodDtcclxuICAgICAgICAgICAgY29sb3I6ICM4ODg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlIHtcclxuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb2xsYXBzaWJsZSArIGxhYmVsIHtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlX19jb250ZW50IHtcclxuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1sZWZ0OiBkb3R0ZWQgMXB4ICM4ODg7XHJcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb2xsYXBzaWJsZSArIGxhYmVsICsgLmNvbGxhcHNpYmxlX19jb250ZW50IHtcclxuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb2xsYXBzaWJsZTpjaGVja2VkICsgbGFiZWwgKyAuY29sbGFwc2libGVfX2NvbnRlbnQge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb2xsYXBzaWJsZTpjaGVja2VkICsgbGFiZWwgLmljb24tY29sbGFwc2Uge1xyXG4gICAgICAgICAgICAvKiBleHBhbmRlZCAqL1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBkPSdNNC41IDhMOCAySDEnLyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgPC9oZWFkPlxyXG4gICAgICAgIDxib2R5PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9nXCI+XHJcbiAgICAgICAgICAgICAgICAke3JlbmRlckxvZ1Jvd3MobG9nKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9ib2R5PlxyXG4gICAgICAgIDwvaHRtbD5gXHJcbiAgICApO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVyIHVucGFja2FnZWQgbG9nLXJvd3MgdG8gSFRNTFxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyTG9nUm93cyhsb2c6IExvZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgaHRtbDogc3RyaW5nW10gPSBbXTtcclxuICAgIGxldCBncm91cHM6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgY29sbGFwc2VkOiBib29sZWFuLCBodG1sOiBzdHJpbmdbXSB9PiA9IFt7IHRpdGxlOiBcIlwiLCBjb2xsYXBzZWQ6IGZhbHNlLCBodG1sIH1dO1xyXG5cclxuICAgIC8qKiBhcHBlbmQgSFRNTCB0byB0aGUgdG9wIG9mIHRoZSBzdGFjayAqL1xyXG4gICAgY29uc3QgYXBwZW5kID0gKGh0bWw6IHN0cmluZykgPT4gZ3JvdXBzW2dyb3Vwcy5sZW5ndGgtMV0uaHRtbC5wdXNoKGh0bWwpO1xyXG5cclxuICAgIC8qKiBwdXNoIHRvIHRoZSBzdGFjayAqL1xyXG4gICAgY29uc3Qgc3RhcnRHcm91cCA9ICh0aXRsZTogc3RyaW5nLCBjb2xsYXBzZWQ6IGJvb2xlYW4pID0+IGdyb3Vwcy5wdXNoKHsgdGl0bGUsIGNvbGxhcHNlZCwgaHRtbDogW10gfSk7XHJcblxyXG4gICAgLyoqIHBvcCBmcm9tIHRoZSBzdGFjayAqL1xyXG4gICAgY29uc3QgZW5kR3JvdXAgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGdyb3Vwcy5wb3AoKSE7XHJcbiAgICAgICAgYXBwZW5kKHJlbmRlckdyb3VwKGl0ZW0udGl0bGUsIGl0ZW0uaHRtbC5qb2luKFwiXFxuXCIpLCBpdGVtLmNvbGxhcHNlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHJvdyBvZiBwYXJzZUxvZyhsb2cpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocm93KTtcclxuICAgICAgICBjb25zdCB0eXBlID0gcm93LnR5cGU7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlbmRlckRhdGEocm93LmxvZyk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibG9nXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbmZvXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3YXJuXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYXBwZW5kKHJlbmRlckl0ZW0oSUNPTl9NQVBbdHlwZV0sIGNvbnRlbnQsIHJvdy5iYWNrdHJhY2UpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSBcImdyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICBzdGFydEdyb3VwKGNvbnRlbnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBcImdyb3VwQ29sbGFwc2VkXCI6XHJcbiAgICAgICAgICAgICAgICBzdGFydEdyb3VwKGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiZ3JvdXBFbmRcIjpcclxuICAgICAgICAgICAgICAgIGVuZEdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJ0YWJsZVwiOlxyXG4gICAgICAgICAgICAgICAgLy8gIFRPRE9cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaHRtbC5qb2luKFwiXFxuXCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVyIGxvZy1kYXRhIChvZiBhbnkgSlNPTi1saWtlIHR5cGUpIGFzIEhUTUxcclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlckRhdGEoZGF0YTogQXJyYXk8YW55Pik6IHN0cmluZyB7XHJcbiAgICAvLyBUT0RPIGltcHJvdmUgSlNPTiB0cmVlIHJlbmRlcmluZ1xyXG4gICAgcmV0dXJuIGRhdGEubWFwKGl0ZW0gPT4gaHRtbCh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiA/IGl0ZW0gOiBKU09OLnN0cmluZ2lmeShpdGVtLCBudWxsLCAyKSkpXHJcbiAgICAgICAgLm1hcChodG1sID0+IGA8cHJlPiR7aHRtbH08L3ByZT5gKVxyXG4gICAgICAgIC5qb2luKFwiXCIpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVyIGFuIGluZGl2aWR1YWwgbG9nLWl0ZW1cclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlckl0ZW0oaWNvbjogSWNvbiwgY29udGVudDogc3RyaW5nLCBzb3VyY2U/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxvZy1pdGVtICR7aWNvbiA/IGBsb2ctaXRlbS0tJHtpY29ufWAgOiBgYH1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvZy1pdGVtX19pY29uXCI+JHtcclxuICAgICAgICAgICAgICAgIGljb24gPyBgPHNwYW4gY2xhc3M9XCJpY29uLSR7aWNvbn1cIj48L3NwYW4+YCA6IGBgXHJcbiAgICAgICAgICAgIH08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvZy1pdGVtX19jb250ZW50XCI+JHtjb250ZW50fTwvZGl2PlxyXG4gICAgICAgICAgICAkeyBzb3VyY2UgPyBgPGRpdiBjbGFzcz1cImxvZy1pdGVtX19zb3VyY2VcIj4ke2h0bWwoc291cmNlKX08L2Rpdj5gIDogYGAgfVxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgYSBjb2xsYXBzaWJsZSBncm91cFxyXG4gKi9cclxuY29uc3QgcmVuZGVyR3JvdXAgPSAoKCkgPT4ge1xyXG4gICAgLyoqIGdyb3VwIG51bWJlciAodG8gY3JlYXRlIHVuaXF1ZSBpZC1hdHRyaWJ1dGVzKSAqL1xyXG4gICAgbGV0IGdyb3VwX2lkID0gMDtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVuZGVyR3JvdXAodGl0bGU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBjb2xsYXBzZWQ6IGJvb2xlYW4sIHNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBgZ3JvdXAtJHtncm91cF9pZCsrfWA7XHJcbiAgICBcclxuICAgICAgICByZXR1cm4gKGBcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICR7Y29sbGFwc2VkID8gXCJcIiA6IFwiY2hlY2tlZFwifSBjbGFzcz1cImNvbGxhcHNpYmxlXCIgaWQ9XCIke2lkfVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtpZH1cIj4ke3JlbmRlckl0ZW0oXCJjb2xsYXBzZVwiLCB0aXRsZSwgc291cmNlKX08L2xhYmVsPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sbGFwc2libGVfX2NvbnRlbnRcIj4ke2NvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgYCk7XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogRXNjYXBlIHBsYWluIHRleHQgYXMgSFRNTFxyXG4gKi9cclxuZnVuY3Rpb24gaHRtbChzdHI6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChzdHIgfHwgJycpXHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcclxufVxyXG4iXX0=