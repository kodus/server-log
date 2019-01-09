"use strict";
console.log("START: panel.js");
const panel_window = window;
panel_window.do_something = (msg) => {
    document.body.textContent += '\n' + msg; // Stupid example, PoC
};
document.documentElement.onclick = function () {
    // No need to check for the existence of `respond`, because
    // the panel can only be clicked when it's visible...
    panel_window.respond('Another stupid example!');
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUvQixNQUFNLFlBQVksR0FBRyxNQUFxQixDQUFDO0FBRTNDLFlBQVksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsc0JBQXNCO0FBQ25FLENBQUMsQ0FBQTtBQUVELFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHO0lBQy9CLDJEQUEyRDtJQUMzRCxxREFBcUQ7SUFDckQsWUFBWSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BELENBQUMsQ0FBQztBQUVGLHFFQUFxRTtBQUNyRSx1Q0FBdUM7QUFDdkMsTUFBTTtBQUdOLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIsa0RBQWtEO0FBQ2xELDBCQUEwQjtBQUMxQix1QkFBdUI7QUFDdkIsRUFBRTtBQUNGLG1EQUFtRDtBQUNuRCxZQUFZO0FBQ1osRUFBRTtBQUNGLHVCQUF1QjtBQUN2Qiw0RUFBNEU7QUFDNUUsRUFBRTtBQUNGLDRDQUE0QztBQUM1QyxFQUFFO0FBQ0YsK0RBQStEO0FBQy9ELGdFQUFnRTtBQUNoRSxFQUFFO0FBQ0YsZ0RBQWdEO0FBQ2hELDhEQUE4RDtBQUM5RCxZQUFZO0FBQ1osUUFBUTtBQUNSLEtBQUs7QUFDTCxFQUFFO0FBQ0Ysd0JBQXdCO0FBQ3hCLG9EQUFvRDtBQUNwRCxFQUFFO0FBQ0YscUJBQXFCO0FBQ3JCLEVBQUU7QUFDRixxQ0FBcUM7QUFDckMsSUFBSTtBQUNKLEVBQUU7QUFDRiw0QkFBNEI7QUFDNUIsa0JBQWtCO0FBQ2xCLFNBQVM7QUFDVCxFQUFFO0FBQ0YsU0FBUztBQUNULHlCQUF5QjtBQUN6QixZQUFZO0FBQ1osOEJBQThCO0FBQzlCLGFBQWE7QUFDYixVQUFVO0FBQ1YsRUFBRTtBQUNGLFNBQVM7QUFDVCx5QkFBeUI7QUFDekIsVUFBVTtBQUNWLEVBQUU7QUFDRixVQUFVO0FBQ1YsS0FBSztBQUNMLEVBQUU7QUFDRix1QkFBdUI7QUFDdkIseUJBQXlCO0FBQ3pCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKFwiU1RBUlQ6IHBhbmVsLmpzXCIpO1xyXG5cclxuY29uc3QgcGFuZWxfd2luZG93ID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxucGFuZWxfd2luZG93LmRvX3NvbWV0aGluZyA9IChtc2c6IHN0cmluZykgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCArPSAnXFxuJyArIG1zZzsgLy8gU3R1cGlkIGV4YW1wbGUsIFBvQ1xyXG59XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBgcmVzcG9uZGAsIGJlY2F1c2VcclxuICAgIC8vIHRoZSBwYW5lbCBjYW4gb25seSBiZSBjbGlja2VkIHdoZW4gaXQncyB2aXNpYmxlLi4uXHJcbiAgICBwYW5lbF93aW5kb3cucmVzcG9uZCgnQW5vdGhlciBzdHVwaWQgZXhhbXBsZSEnKTtcclxufTtcclxuXHJcbi8vIGNocm9tZS5kZXZ0b29scy5uZXR3b3JrLm9uUmVxdWVzdEZpbmlzaGVkLmFkZExpc3RlbmVyKHJlcXVlc3QgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJSRVFVRVNUXCIsIHJlcXVlc3QpO1xyXG4vLyB9KTtcclxuXHJcblxyXG4vLyBjdXN0b21FbGVtZW50cy5kZWZpbmUoXHJcbi8vICAgICBcImxvZy1lbnRyeVwiLFxyXG4vLyAgICAgY2xhc3MgTG9nRW50cnlFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4vLyAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4vLyAgICAgICAgICAgICBzdXBlcigpO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xyXG4vLyAgICAgICAgIH1cclxuLy9cclxuLy8gICAgICAgICBsb2FkKGh0bWwpIHtcclxuLy8gICAgICAgICAgICAgbGV0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIik7XHJcbi8vXHJcbi8vICAgICAgICAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuLy9cclxuLy8gICAgICAgICAgICAgWy4uLmRvYy5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdHlsZVwiKV0uZm9yRWFjaChcclxuLy8gICAgICAgICAgICAgICAgIHN0eWxlID0+IHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZSkpO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICBbLi4uZG9jLmJvZHkuY2hpbGROb2Rlc10uZm9yRWFjaChcclxuLy8gICAgICAgICAgICAgICAgIG5vZGUgPT4gdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKG5vZGUpKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vICk7XHJcbi8vXHJcbi8vIGZ1bmN0aW9uIGxvYWQoaHRtbCkge1xyXG4vLyAgICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxvZy1lbnRyeVwiKTtcclxuLy9cclxuLy8gICAgIGVsLmxvYWQoaHRtbCk7XHJcbi8vXHJcbi8vICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcclxuLy8gfVxyXG4vL1xyXG4vLyBjb25zdCBzYW1wbGUgPSBjb2xvciA9PiBgXHJcbi8vIDwhRE9DVFlQRSBodG1sPlxyXG4vLyA8aHRtbD5cclxuLy9cclxuLy8gPGhlYWQ+XHJcbi8vICAgPHRpdGxlPkhlbGxvPC90aXRsZT5cclxuLy8gICA8c3R5bGU+XHJcbi8vICAgICBoMSB7IGNvbG9yOiAke2NvbG9yfTsgfVxyXG4vLyAgIDwvc3R5bGU+XHJcbi8vIDwvaGVhZD5cclxuLy9cclxuLy8gPGJvZHk+XHJcbi8vICAgPGgxPkhlbGxvIFdvcmxkPC9oMT5cclxuLy8gPC9ib2R5PlxyXG4vL1xyXG4vLyA8L2h0bWw+XHJcbi8vIGA7XHJcbi8vXHJcbi8vIGxvYWQoc2FtcGxlKFwicmVkXCIpKTtcclxuLy8gbG9hZChzYW1wbGUoXCJncmVlblwiKSk7XHJcbi8vIGxvYWQoc2FtcGxlKFwiYmx1ZVwiKSk7XHJcbiJdfQ==