/**
 * This module implements backwards compatibility with ChromeLogger data, by rendering
 * a console-like HTML page on the client-side.
 */
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

        table {
            display: inline-block;
            padding: 8px 0;
            border-collapse: collapse;
        }
        
        th, td {
            border: solid 1px #b3b6bd;
            padding: 4px 8px;
            text-align: left;
            vertical-align: top;
        }
        
        th {
            background: #d0ebfb;
        }
        
        tbody tr:nth-child(even) {
            background: #f3f3f3;
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
        switch (type) {
            case "log":
            case "info":
            case "warn":
            case "error":
            default:
                append(renderItem(ICON_MAP[type], renderData(row.log), row.backtrace));
                break;
            case "group":
                startGroup(renderData(row.log), false);
                break;
            case "groupCollapsed":
                startGroup(renderData(row.log), true);
                break;
            case "groupEnd":
                endGroup();
                break;
            case "table":
                append(renderTable(row.log[0]));
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
 * Render log-data as a table
 */
function renderTable(rows) {
    try {
        let unique_keys = {};
        for (let row of rows) {
            for (let key of Object.keys(row)) {
                unique_keys[key] = true;
            }
        }
        const keys = Object.keys(unique_keys);
        return `
            <div class="table"><table>
                <thead>
                    ${keys.map(key => `<th>${html(key)}</th>`).join("")}
                </head>
                <tbody>
                    ${rows.map(row => `<tr>${keys.map(key => `<td>${row[key]}</td>`).join("")}</tr>`).join("\n")}
                </tbody>
            </table></div>
        `;
    }
    catch (error) {
        console.error(`Error rendering table data: ${error}`, rows);
        return renderData(rows);
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUF5Qkg7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBNkI7SUFDdkMsSUFBSSxFQUFFLFNBQVM7SUFDZixLQUFLLEVBQUUsT0FBTztDQUNqQixDQUFDO0FBRUY7O0dBRUc7QUFDSCxRQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBUztJQUN6QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV4RCxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDdkIsTUFBTTtZQUNGLEdBQUcsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ25CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQWdCO1lBQy9DLFNBQVMsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDO1NBQ2xDLENBQUM7S0FDTDtBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsR0FBUTtJQUM5QixPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQW9ITSxhQUFhLENBQUMsR0FBRyxDQUFDOzs7Z0JBR3BCLENBQ1gsQ0FBQztBQUNOLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsYUFB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QUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0QyxPQUFPOzs7c0JBR08sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzs7c0JBR2pELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7U0FHdkcsQ0FBQztLQUNMO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU1RCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjtBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsSUFBSSxDQUFDLEdBQThCO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO1NBQ2IsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7U0FDdEIsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7U0FDdkIsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7U0FDdEIsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7U0FDckIsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFRoaXMgbW9kdWxlIGltcGxlbWVudHMgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBDaHJvbWVMb2dnZXIgZGF0YSwgYnkgcmVuZGVyaW5nXHJcbiAqIGEgY29uc29sZS1saWtlIEhUTUwgcGFnZSBvbiB0aGUgY2xpZW50LXNpZGUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgbG9vc2VseSBkZWZpbmVzIENocm9tZUxvZ2dlcidzIFwicGFja2VkXCIgbG9nLWRhdGEgZm9ybWF0XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZyB7XHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBjb2x1bW5zOiBzdHJpbmdbXTtcclxuICAgIHJvd3M6IEFycmF5PGFueT47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXZSBub3JtYWxpemUgQ2hyb21lTG9nZ2VyJ3MgXCJwYWNrZWRcIiBmb3JtYXQgdG8gdGhpcyBmb3JtYXRcclxuICovXHJcbmludGVyZmFjZSBSb3cge1xyXG4gICAgbG9nOiBhbnk7XHJcbiAgICB0eXBlOiBcImxvZ1wiIHwgXCJpbmZvXCIgfCBcIndhcm5cIiB8IFwiZXJyb3JcIiB8IFwiZ3JvdXBcIiB8IFwiZ3JvdXBFbmRcIiB8IFwiZ3JvdXBDb2xsYXBzZWRcIiB8IFwidGFibGVcIjtcclxuICAgIGJhY2t0cmFjZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG4vKipcclxuICogVGhlc2UgYXJlIHRoZSBhdmFpbGFibGUgaWNvbnMgZGVmaW5lZCBpbiB0aGUgQ1NTXHJcbiAqL1xyXG50eXBlIEljb24gPSBcImluZm9cIiB8IFwid2FybmluZ1wiIHwgXCJlcnJvclwiIHwgXCJjb2xsYXBzZVwiIHwgdW5kZWZpbmVkO1xyXG5cclxuLyoqXHJcbiAqIE1hcCB3aGVyZSBsb2ctZW50cnkgdHlwZSAtPiBpY29uIG5hbWVcclxuICovXHJcbmNvbnN0IElDT05fTUFQOiB7IFt0eXBlOiBzdHJpbmddOiBJY29uIH0gPSB7XHJcbiAgICB3YXJuOiBcIndhcm5pbmdcIixcclxuICAgIGVycm9yOiBcImVycm9yXCJcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBsb2ctZGF0YSBmcm9tIENocm9tZUxvZ2dlcidzIFwicGFja2VkXCIgZm9ybWF0IGludG8gUm93IHN0cnVjdHVyZXNcclxuICovXHJcbmZ1bmN0aW9uICogcGFyc2VMb2coZGF0YTogTG9nKTogSXRlcmFibGVJdGVyYXRvcjxSb3c+IHtcclxuICAgIGxldCBsb2dfaW5kZXggPSBkYXRhLmNvbHVtbnMuaW5kZXhPZihcImxvZ1wiKTtcclxuICAgIGxldCB0eXBlX2luZGV4ID0gZGF0YS5jb2x1bW5zLmluZGV4T2YoXCJ0eXBlXCIpO1xyXG4gICAgbGV0IGJhY2t0cmFjZV9pbmRleCA9IGRhdGEuY29sdW1ucy5pbmRleE9mKFwiYmFja3RyYWNlXCIpO1xyXG5cclxuICAgIGZvciAobGV0IHJvdyBvZiBkYXRhLnJvd3MpIHtcclxuICAgICAgICB5aWVsZCB7XHJcbiAgICAgICAgICAgIGxvZzogcm93W2xvZ19pbmRleF0sXHJcbiAgICAgICAgICAgIHR5cGU6IChyb3dbdHlwZV9pbmRleF0gfHwgXCJsb2dcIikgYXMgUm93W1widHlwZVwiXSxcclxuICAgICAgICAgICAgYmFja3RyYWNlOiByb3dbYmFja3RyYWNlX2luZGV4XVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgYSBjb25zb2xlLWxpa2UgSFRNTCBwYWdlIGZyb20gQ2hyb21lTG9nZ2VyJ3MgXCJwYWNrZWRcIiBmb3JtYXRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJMb2cobG9nOiBMb2cpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChgPCFET0NUWVBFIGh0bWw+XHJcbiAgICAgICAgPGh0bWw+XHJcbiAgICAgICAgPGhlYWQ+XHJcbiAgICAgICAgPHN0eWxlPlxyXG5cclxuICAgICAgICBwcmUge1xyXG4gICAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBbY2xhc3NePVwiaWNvbi1cIl0ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuaWNvbi1lcnJvciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyUzRSUzQ2RlZnMlM0UlM0NsaW5lYXJHcmFkaWVudCBpZD0nYSclM0UlM0NzdG9wIG9mZnNldD0nMCcgc3RvcC1jb2xvcj0nJTIzZDc2ODdkJy8lM0UlM0NzdG9wIG9mZnNldD0nMScgc3RvcC1jb2xvcj0nJTIzYjIxNDAyJy8lM0UlM0MvbGluZWFyR3JhZGllbnQlM0UlM0NsaW5lYXJHcmFkaWVudCB5MT0nMScgeDE9Jy41JyB4bGluazpocmVmPSclMjNhJyB4Mj0nLjUnIGlkPSdiJy8lM0UlM0MvZGVmcyUzRSUzQ3BhdGggZmlsbD0nbm9uZScgZD0nTS0xLTFoMTJ2MTJILTF6Jy8lM0UlM0NnJTNFJTNDcGF0aCBmaWxsPSd1cmwoJTIzYiknIGQ9J001IDBDMi4yNCAwIDAgMi4yNCAwIDVzMi4yNCA1IDUgNSA1LTIuMjQgNS01LTIuMjQtNS01LTUnLyUzRSUzQ3BhdGggZmlsbD0nJTIzZWIzOTQxJyBkPSdNLjM2IDVDLjM2IDcuNTYgMi40NCA5LjY0IDUgOS42NGMyLjU2IDAgNC42NC0yLjA4IDQuNjQtNC42NEM5LjY0IDIuNDQgNy41Ni4zNiA1IC4zNiAyLjQ0LjM2LjM2IDIuNDQuMzYgNScvJTNFJTNDcGF0aCBzdHJva2U9JyUyM2ZmZicgZD0nTTMgM2w0IDRNNyAzTDMgNycvJTNFJTNDL2clM0UlM0Mvc3ZnJTNFXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmljb24td2FybmluZyB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNFJTNDcGF0aCBmaWxsPSdub25lJyBkPSdNLTEtMWgxMnYxMkgtMXonLyUzRSUzQ2clM0UlM0NwYXRoIHN0cm9rZT0nJTIzYzE5NjAwJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIGQ9J00xIDlsNC04IDQgOEgxeicvJTNFJTNDcGF0aCBmaWxsPSclMjNmNGJkMDAnIHN0cm9rZT0nJTIzZjViZDAwJyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcgZD0nTTEgOWw0LTggNCA4SDF6Jy8lM0UlM0NwYXRoIGZpbGw9JyUyM2FkODYwMScgZD0nTTMuNzUgMi43NWgyLjV2Mi41TDUuNzUgN2gtMS41bC0uNS0xLjc1di0yLjVtMCA1LjI1aDIuNXYxLjI1aC0yLjUnLyUzRSUzQ3BhdGggZmlsbD0nJTIzZmZmJyBkPSdNNCAzaDJ2Mi4yNUw1LjUgN2gtMUw0IDUuMjVWM20wIDVoMnYxSDQnLyUzRSUzQ3RleHQgZm9udC1mYW1pbHk9J3NhbnMtc2VyaWYnIGZpbGw9JyUyM2NjYycgeT0nMTE4LjM4NycgeD0nNjMuMDUxJyUzRSUzQ3RzcGFuIGZvbnQtc2l6ZT0nOCcgeT0nMTE4LjM4NycgeD0nNjMuMDUxJyUzRWQlM0MvdHNwYW4lM0UlM0MvdGV4dCUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5pY29uLWNvbGxhcHNlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NwYXRoIGZpbGw9J25vbmUnIGQ9J00tMS0xaDEydjEySC0xeicvJTNFJTNDZyUzRSUzQ3BhdGggZD0nTTcgNC41TDIgMXY3Jy8lM0UlM0MvZyUzRSUzQy9zdmclM0VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAubG9nIHtcclxuICAgICAgICAgICAgZm9udC1mYW1pbHk6IENvbnNvbGFzLCBMdWNpZGEgQ29uc29sZSwgQ291cmllciBOZXcsIE1lbmxvLCBkZWphdnUgc2FucyBtb25vLCBtb25vc3BhY2U7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZy1pdGVtIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4IDRweCAzcHggNHB4O1xyXG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHggI2U4ZThlODtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5sb2ctaXRlbS0td2FybmluZyB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZjZGM7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNzUzNzM3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZy1pdGVtLS1lcnJvciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmVhZWE7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjZjczMTMxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvZy1pdGVtX19pY29uIHtcclxuICAgICAgICAgICAgd2lkdGg6IDE1cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAubG9nLWl0ZW1fX2NvbnRlbnQge1xyXG4gICAgICAgICAgICBmbGV4OiAxIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAubG9nLWl0ZW1fX3NvdXJjZSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgZmxvYXQ6IHJpZ2h0O1xyXG4gICAgICAgICAgICBjb2xvcjogIzg4ODtcclxuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29sbGFwc2libGUge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlICsgbGFiZWwge1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29sbGFwc2libGVfX2NvbnRlbnQge1xyXG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IGRvdHRlZCAxcHggIzg4ODtcclxuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAxMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlICsgbGFiZWwgKyAuY29sbGFwc2libGVfX2NvbnRlbnQge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlOmNoZWNrZWQgKyBsYWJlbCArIC5jb2xsYXBzaWJsZV9fY29udGVudCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNvbGxhcHNpYmxlOmNoZWNrZWQgKyBsYWJlbCAuaWNvbi1jb2xsYXBzZSB7XHJcbiAgICAgICAgICAgIC8qIGV4cGFuZGVkICovXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNFJTNDcGF0aCBmaWxsPSdub25lJyBkPSdNLTEtMWgxMnYxMkgtMXonLyUzRSUzQ2clM0UlM0NwYXRoIGQ9J000LjUgOEw4IDJIMScvJTNFJTNDL2clM0UlM0Mvc3ZnJTNFXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFibGUge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAwO1xyXG4gICAgICAgICAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aCwgdGQge1xyXG4gICAgICAgICAgICBib3JkZXI6IHNvbGlkIDFweCAjYjNiNmJkO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHggOHB4O1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aCB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNkMGViZmI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRib2R5IHRyOm50aC1jaGlsZChldmVuKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmM2YzZjM7XHJcbiAgICAgICAgfSAgICAgICAgICBcclxuXHJcbiAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8L2hlYWQ+XHJcbiAgICAgICAgPGJvZHk+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2dcIj5cclxuICAgICAgICAgICAgICAgICR7cmVuZGVyTG9nUm93cyhsb2cpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2JvZHk+XHJcbiAgICAgICAgPC9odG1sPmBcclxuICAgICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgdW5wYWNrYWdlZCBsb2ctcm93cyB0byBIVE1MXHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXJMb2dSb3dzKGxvZzogTG9nKTogc3RyaW5nIHtcclxuICAgIGxldCBodG1sOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgbGV0IGdyb3VwczogQXJyYXk8eyB0aXRsZTogc3RyaW5nLCBjb2xsYXBzZWQ6IGJvb2xlYW4sIGh0bWw6IHN0cmluZ1tdIH0+ID0gW3sgdGl0bGU6IFwiXCIsIGNvbGxhcHNlZDogZmFsc2UsIGh0bWwgfV07XHJcblxyXG4gICAgLyoqIGFwcGVuZCBIVE1MIHRvIHRoZSB0b3Agb2YgdGhlIHN0YWNrICovXHJcbiAgICBjb25zdCBhcHBlbmQgPSAoaHRtbDogc3RyaW5nKSA9PiBncm91cHNbZ3JvdXBzLmxlbmd0aC0xXS5odG1sLnB1c2goaHRtbCk7XHJcblxyXG4gICAgLyoqIHB1c2ggdG8gdGhlIHN0YWNrICovXHJcbiAgICBjb25zdCBzdGFydEdyb3VwID0gKHRpdGxlOiBzdHJpbmcsIGNvbGxhcHNlZDogYm9vbGVhbikgPT4gZ3JvdXBzLnB1c2goeyB0aXRsZSwgY29sbGFwc2VkLCBodG1sOiBbXSB9KTtcclxuXHJcbiAgICAvKiogcG9wIGZyb20gdGhlIHN0YWNrICovXHJcbiAgICBjb25zdCBlbmRHcm91cCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBpdGVtID0gZ3JvdXBzLnBvcCgpITtcclxuICAgICAgICBhcHBlbmQocmVuZGVyR3JvdXAoaXRlbS50aXRsZSwgaXRlbS5odG1sLmpvaW4oXCJcXG5cIiksIGl0ZW0uY29sbGFwc2VkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgcm93IG9mIHBhcnNlTG9nKGxvZykpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyb3cpO1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSByb3cudHlwZTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsb2dcIjpcclxuICAgICAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgY2FzZSBcIndhcm5cIjpcclxuICAgICAgICAgICAgY2FzZSBcImVycm9yXCI6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBhcHBlbmQocmVuZGVySXRlbShJQ09OX01BUFt0eXBlXSwgcmVuZGVyRGF0YShyb3cubG9nKSwgcm93LmJhY2t0cmFjZSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFwiZ3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHN0YXJ0R3JvdXAocmVuZGVyRGF0YShyb3cubG9nKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiZ3JvdXBDb2xsYXBzZWRcIjpcclxuICAgICAgICAgICAgICAgIHN0YXJ0R3JvdXAocmVuZGVyRGF0YShyb3cubG9nKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJncm91cEVuZFwiOlxyXG4gICAgICAgICAgICAgICAgZW5kR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBcInRhYmxlXCI6XHJcbiAgICAgICAgICAgICAgICBhcHBlbmQocmVuZGVyVGFibGUocm93LmxvZ1swXSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBodG1sLmpvaW4oXCJcXG5cIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgbG9nLWRhdGEgKG9mIGFueSBKU09OLWxpa2UgdHlwZSkgYXMgSFRNTFxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyRGF0YShkYXRhOiBBcnJheTxhbnk+KTogc3RyaW5nIHtcclxuICAgIC8vIFRPRE8gaW1wcm92ZSBKU09OIHRyZWUgcmVuZGVyaW5nXHJcbiAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiBodG1sKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiID8gaXRlbSA6IEpTT04uc3RyaW5naWZ5KGl0ZW0sIG51bGwsIDIpKSlcclxuICAgICAgICAubWFwKGh0bWwgPT4gYDxwcmU+JHtodG1sfTwvcHJlPmApXHJcbiAgICAgICAgLmpvaW4oXCJcIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgYW4gaW5kaXZpZHVhbCBsb2ctaXRlbVxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVySXRlbShpY29uOiBJY29uLCBjb250ZW50OiBzdHJpbmcsIHNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9nLWl0ZW0gJHtpY29uID8gYGxvZy1pdGVtLS0ke2ljb259YCA6IGBgfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9nLWl0ZW1fX2ljb25cIj4ke1xyXG4gICAgICAgICAgICAgICAgaWNvbiA/IGA8c3BhbiBjbGFzcz1cImljb24tJHtpY29ufVwiPjwvc3Bhbj5gIDogYGBcclxuICAgICAgICAgICAgfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9nLWl0ZW1fX2NvbnRlbnRcIj4ke2NvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgICAgICR7IHNvdXJjZSA/IGA8ZGl2IGNsYXNzPVwibG9nLWl0ZW1fX3NvdXJjZVwiPiR7aHRtbChzb3VyY2UpfTwvZGl2PmAgOiBgYCB9XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbmRlciBhIGNvbGxhcHNpYmxlIGdyb3VwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJHcm91cCA9ICgoKSA9PiB7XHJcbiAgICAvKiogZ3JvdXAgbnVtYmVyICh0byBjcmVhdGUgdW5pcXVlIGlkLWF0dHJpYnV0ZXMpICovXHJcbiAgICBsZXQgZ3JvdXBfaWQgPSAwO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiByZW5kZXJHcm91cCh0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGNvbGxhcHNlZDogYm9vbGVhbiwgc291cmNlPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBpZCA9IGBncm91cC0ke2dyb3VwX2lkKyt9YDtcclxuICAgIFxyXG4gICAgICAgIHJldHVybiAoYFxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgJHtjb2xsYXBzZWQgPyBcIlwiIDogXCJjaGVja2VkXCJ9IGNsYXNzPVwiY29sbGFwc2libGVcIiBpZD1cIiR7aWR9XCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2lkfVwiPiR7cmVuZGVySXRlbShcImNvbGxhcHNlXCIsIHRpdGxlLCBzb3VyY2UpfTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xsYXBzaWJsZV9fY29udGVudFwiPiR7Y29udGVudH08L2Rpdj5cclxuICAgICAgICBgKTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgbG9nLWRhdGEgYXMgYSB0YWJsZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyVGFibGUocm93czogQXJyYXk8eyBba2V5OiBzdHJpbmddOiBhbnkgfT4pOiBzdHJpbmcge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgdW5pcXVlX2tleXM6IHsgW2tleTogc3RyaW5nXTogdHJ1ZSB9ID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlxdWVfa2V5c1trZXldID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHVuaXF1ZV9rZXlzKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVcIj48dGFibGU+XHJcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtrZXlzLm1hcChrZXkgPT4gYDx0aD4ke2h0bWwoa2V5KX08L3RoPmApLmpvaW4oXCJcIil9XHJcbiAgICAgICAgICAgICAgICA8L2hlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtyb3dzLm1hcChyb3cgPT4gYDx0cj4ke2tleXMubWFwKGtleSA9PiBgPHRkPiR7cm93W2tleV19PC90ZD5gKS5qb2luKFwiXCIpfTwvdHI+YCkuam9pbihcIlxcblwiKX1cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgIDwvdGFibGU+PC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVuZGVyaW5nIHRhYmxlIGRhdGE6ICR7ZXJyb3J9YCwgcm93cyk7XHJcblxyXG4gICAgICAgIHJldHVybiByZW5kZXJEYXRhKHJvd3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXNjYXBlIHBsYWluIHRleHQgYXMgSFRNTFxyXG4gKi9cclxuZnVuY3Rpb24gaHRtbChzdHI6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChzdHIgfHwgJycpXHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcclxufVxyXG4iXX0=