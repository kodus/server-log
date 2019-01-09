"use strict";
console.log("START: panel.js");
const panel_window = window;
panel_window.onRequest = request => {
    console.log("ON REQUEST", request);
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUvQixNQUFNLFlBQVksR0FBRyxNQUFxQixDQUFDO0FBRTNDLFlBQVksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEVBQUU7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFBO0FBRUQsWUFBWSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsRUFBRTtJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGLHFFQUFxRTtBQUNyRSx1Q0FBdUM7QUFDdkMsTUFBTTtBQUdOLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIsa0RBQWtEO0FBQ2xELDBCQUEwQjtBQUMxQix1QkFBdUI7QUFDdkIsRUFBRTtBQUNGLG1EQUFtRDtBQUNuRCxZQUFZO0FBQ1osRUFBRTtBQUNGLHVCQUF1QjtBQUN2Qiw0RUFBNEU7QUFDNUUsRUFBRTtBQUNGLDRDQUE0QztBQUM1QyxFQUFFO0FBQ0YsK0RBQStEO0FBQy9ELGdFQUFnRTtBQUNoRSxFQUFFO0FBQ0YsZ0RBQWdEO0FBQ2hELDhEQUE4RDtBQUM5RCxZQUFZO0FBQ1osUUFBUTtBQUNSLEtBQUs7QUFDTCxFQUFFO0FBQ0Ysd0JBQXdCO0FBQ3hCLG9EQUFvRDtBQUNwRCxFQUFFO0FBQ0YscUJBQXFCO0FBQ3JCLEVBQUU7QUFDRixxQ0FBcUM7QUFDckMsSUFBSTtBQUNKLEVBQUU7QUFDRiw0QkFBNEI7QUFDNUIsa0JBQWtCO0FBQ2xCLFNBQVM7QUFDVCxFQUFFO0FBQ0YsU0FBUztBQUNULHlCQUF5QjtBQUN6QixZQUFZO0FBQ1osOEJBQThCO0FBQzlCLGFBQWE7QUFDYixVQUFVO0FBQ1YsRUFBRTtBQUNGLFNBQVM7QUFDVCx5QkFBeUI7QUFDekIsVUFBVTtBQUNWLEVBQUU7QUFDRixVQUFVO0FBQ1YsS0FBSztBQUNMLEVBQUU7QUFDRix1QkFBdUI7QUFDdkIseUJBQXlCO0FBQ3pCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKFwiU1RBUlQ6IHBhbmVsLmpzXCIpO1xyXG5cclxuY29uc3QgcGFuZWxfd2luZG93ID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxucGFuZWxfd2luZG93Lm9uUmVxdWVzdCA9IHJlcXVlc3QgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJPTiBSRVFVRVNUXCIsIHJlcXVlc3QpO1xyXG59XHJcblxyXG5wYW5lbF93aW5kb3cub25OYXZpZ2F0aW9uID0gdXJsID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiT04gTkFWSUdBVElPTlwiLCB1cmwpO1xyXG59O1xyXG5cclxuLypcclxuXHJcbi8vIE5PVEU6IGRvbid0IG5lZWQgdGhpcyBmb3Igbm93IC0gbWlnaHQgbmVlZCBpdCB0byBjb21tdW5pY2F0ZSB3aXRoIFwiYmFja2dyb3VuZC5qc1wiXHJcblxyXG5wYW5lbF93aW5kb3cuZG9fc29tZXRoaW5nID0gKG1zZzogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkRPSU5HIFNPTUVUSElOR1wiKTtcclxuICAgIGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQgKz0gJ1xcbicgKyBtc2c7IC8vIFN0dXBpZCBleGFtcGxlLCBQb0NcclxufVxyXG5cclxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYHJlc3BvbmRgLCBiZWNhdXNlXHJcbiAgICAvLyB0aGUgcGFuZWwgY2FuIG9ubHkgYmUgY2xpY2tlZCB3aGVuIGl0J3MgdmlzaWJsZS4uLlxyXG4gICAgcGFuZWxfd2luZG93LnJlc3BvbmQoJ0Fub3RoZXIgc3R1cGlkIGV4YW1wbGUhJyk7XHJcbn07XHJcbiovXHJcblxyXG4vLyBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vblJlcXVlc3RGaW5pc2hlZC5hZGRMaXN0ZW5lcihyZXF1ZXN0ID0+IHtcclxuLy8gICAgIGNvbnNvbGUubG9nKFwiUkVRVUVTVFwiLCByZXF1ZXN0KTtcclxuLy8gfSk7XHJcblxyXG5cclxuLy8gY3VzdG9tRWxlbWVudHMuZGVmaW5lKFxyXG4vLyAgICAgXCJsb2ctZW50cnlcIixcclxuLy8gICAgIGNsYXNzIExvZ0VudHJ5RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuLy8gICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuLy8gICAgICAgICAgICAgc3VwZXIoKTtcclxuLy9cclxuLy8gICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KTtcclxuLy8gICAgICAgICB9XHJcbi8vXHJcbi8vICAgICAgICAgbG9hZChodG1sKSB7XHJcbi8vICAgICAgICAgICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbi8vXHJcbi8vICAgICAgICAgICAgIFsuLi5kb2MuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKFwic3R5bGVcIildLmZvckVhY2goXHJcbi8vICAgICAgICAgICAgICAgICBzdHlsZSA9PiB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGUpKTtcclxuLy9cclxuLy8gICAgICAgICAgICAgWy4uLmRvYy5ib2R5LmNoaWxkTm9kZXNdLmZvckVhY2goXHJcbi8vICAgICAgICAgICAgICAgICBub2RlID0+IHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChub2RlKSk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyApO1xyXG4vL1xyXG4vLyBmdW5jdGlvbiBsb2FkKGh0bWwpIHtcclxuLy8gICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsb2ctZW50cnlcIik7XHJcbi8vXHJcbi8vICAgICBlbC5sb2FkKGh0bWwpO1xyXG4vL1xyXG4vLyAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XHJcbi8vIH1cclxuLy9cclxuLy8gY29uc3Qgc2FtcGxlID0gY29sb3IgPT4gYFxyXG4vLyA8IURPQ1RZUEUgaHRtbD5cclxuLy8gPGh0bWw+XHJcbi8vXHJcbi8vIDxoZWFkPlxyXG4vLyAgIDx0aXRsZT5IZWxsbzwvdGl0bGU+XHJcbi8vICAgPHN0eWxlPlxyXG4vLyAgICAgaDEgeyBjb2xvcjogJHtjb2xvcn07IH1cclxuLy8gICA8L3N0eWxlPlxyXG4vLyA8L2hlYWQ+XHJcbi8vXHJcbi8vIDxib2R5PlxyXG4vLyAgIDxoMT5IZWxsbyBXb3JsZDwvaDE+XHJcbi8vIDwvYm9keT5cclxuLy9cclxuLy8gPC9odG1sPlxyXG4vLyBgO1xyXG4vL1xyXG4vLyBsb2FkKHNhbXBsZShcInJlZFwiKSk7XHJcbi8vIGxvYWQoc2FtcGxlKFwiZ3JlZW5cIikpO1xyXG4vLyBsb2FkKHNhbXBsZShcImJsdWVcIikpO1xyXG4iXX0=