"use strict";
class LogEntry extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }
    setHTML(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        this.style.display = "block";
        [...doc.head.querySelectorAll("style")].forEach(style => this.shadow.appendChild(style));
        [...doc.body.childNodes].forEach(node => this.shadow.appendChild(node));
    }
}
customElements.define("log-entry", LogEntry);
((panel) => {
    console.log("START: panel.js");
    const $content = document.body.querySelector("[data-content]");
    panel.onRequest = request => {
        console.log("ON REQUEST", request);
        appendContent(loadDocument(request.request.url));
    };
    panel.onNavigation = url => {
        console.log("ON NAVIGATION", url);
        $content.innerHTML = "";
        appendContent(Promise.resolve(`<h1>${url}</h1>`));
    };
    function appendContent(html) {
        const el = document.createElement("log-entry");
        $content.appendChild(el);
        html.then(html => el.setHTML(html));
    }
    // TODO load real content
    const loadDocument = (url) => new Promise(resolve => resolve(`
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
})(window);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sUUFBUyxTQUFRLFdBQVc7SUFHOUI7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxPQUFPLENBQUMsSUFBWTtRQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRTdCLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUMzQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFN0MsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUM1QixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFN0MsQ0FBQyxDQUFDLEtBQWtCLEVBQUUsRUFBRTtJQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFL0IsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQWMsZ0JBQWdCLENBQUUsQ0FBQztJQUU3RSxLQUFLLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLGFBQWEsQ0FBQyxZQUFZLENBQUUsT0FBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzdELENBQUMsQ0FBQTtJQUVELEtBQUssQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLEVBQUU7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFbEMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFeEIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDO0lBRUYsU0FBUyxhQUFhLENBQUMsSUFBcUI7UUFDeEMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQWEsQ0FBQztRQUUzRCxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELHlCQUF5QjtJQUV6QixNQUFNLFlBQVksR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQVMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7Ozs7Ozs7Ozs7OztZQVlyRSxHQUFHOzs7O0tBSVYsQ0FBQyxDQUFDLENBQUM7QUFFUixDQUFDLENBQUMsQ0FBQyxNQUFxQixDQUFDLENBQUM7QUFFMUI7Ozs7Ozs7Ozs7Ozs7O0VBY0UiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2dFbnRyeSBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIHByaXZhdGUgc2hhZG93OiBTaGFkb3dSb290O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hhZG93ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRIVE1MKGh0bWw6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgICAgIFsuLi5kb2MuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKFwic3R5bGVcIildLmZvckVhY2goXHJcbiAgICAgICAgICAgIHN0eWxlID0+IHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKHN0eWxlKSk7XHJcblxyXG4gICAgICAgIFsuLi5kb2MuYm9keS5jaGlsZE5vZGVzXS5mb3JFYWNoKFxyXG4gICAgICAgICAgICBub2RlID0+IHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKG5vZGUpKTtcclxuICAgIH1cclxufVxyXG5cclxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibG9nLWVudHJ5XCIsIExvZ0VudHJ5KTtcclxuXHJcbigocGFuZWw6IFBhbmVsV2luZG93KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJTVEFSVDogcGFuZWwuanNcIik7XHJcblxyXG4gICAgY29uc3QgJGNvbnRlbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiW2RhdGEtY29udGVudF1cIikhO1xyXG5cclxuICAgIHBhbmVsLm9uUmVxdWVzdCA9IHJlcXVlc3QgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT04gUkVRVUVTVFwiLCByZXF1ZXN0KTtcclxuXHJcbiAgICAgICAgYXBwZW5kQ29udGVudChsb2FkRG9jdW1lbnQoKHJlcXVlc3QgYXMgYW55KS5yZXF1ZXN0LnVybCkpXHJcbiAgICB9XHJcblxyXG4gICAgcGFuZWwub25OYXZpZ2F0aW9uID0gdXJsID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk9OIE5BVklHQVRJT05cIiwgdXJsKTtcclxuXHJcbiAgICAgICAgJGNvbnRlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgYXBwZW5kQ29udGVudChQcm9taXNlLnJlc29sdmUoYDxoMT4ke3VybH08L2gxPmApKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kQ29udGVudChodG1sOiBQcm9taXNlPHN0cmluZz4pIHtcclxuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsb2ctZW50cnlcIikgYXMgTG9nRW50cnk7XHJcblxyXG4gICAgICAgICRjb250ZW50LmFwcGVuZENoaWxkKGVsKTtcclxuXHJcbiAgICAgICAgaHRtbC50aGVuKGh0bWwgPT4gZWwuc2V0SFRNTChodG1sKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFRPRE8gbG9hZCByZWFsIGNvbnRlbnRcclxuXHJcbiAgICBjb25zdCBsb2FkRG9jdW1lbnQgPSAodXJsOiBzdHJpbmcpID0+IG5ldyBQcm9taXNlPHN0cmluZz4ocmVzb2x2ZSA9PiByZXNvbHZlKGBcclxuICAgIDwhRE9DVFlQRSBodG1sPlxyXG4gICAgPGh0bWw+XHJcbiAgICBcclxuICAgIDxoZWFkPlxyXG4gICAgICA8dGl0bGU+SGVsbG88L3RpdGxlPlxyXG4gICAgICA8c3R5bGU+XHJcbiAgICAgICAgaDIgeyBjb2xvcjogcmVkOyB9XHJcbiAgICAgIDwvc3R5bGU+XHJcbiAgICA8L2hlYWQ+XHJcbiAgICBcclxuICAgIDxib2R5PlxyXG4gICAgICA8aDI+JHt1cmx9PC9oMj5cclxuICAgIDwvYm9keT5cclxuICAgIFxyXG4gICAgPC9odG1sPlxyXG4gICAgYCkpO1xyXG4gICAgXHJcbn0pKHdpbmRvdyBhcyBQYW5lbFdpbmRvdyk7XHJcblxyXG4vKlxyXG5cclxuLy8gTk9URTogZG9uJ3QgbmVlZCB0aGlzIGZvciBub3cgLSBtaWdodCBuZWVkIGl0IHRvIGNvbW11bmljYXRlIHdpdGggXCJiYWNrZ3JvdW5kLmpzXCJcclxuXHJcbnBhbmVsX3dpbmRvdy5kb19zb21ldGhpbmcgPSAobXNnOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiRE9JTkcgU09NRVRISU5HXCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCArPSAnXFxuJyArIG1zZzsgLy8gU3R1cGlkIGV4YW1wbGUsIFBvQ1xyXG59XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBgcmVzcG9uZGAsIGJlY2F1c2VcclxuICAgIC8vIHRoZSBwYW5lbCBjYW4gb25seSBiZSBjbGlja2VkIHdoZW4gaXQncyB2aXNpYmxlLi4uXHJcbiAgICBwYW5lbF93aW5kb3cucmVzcG9uZCgnQW5vdGhlciBzdHVwaWQgZXhhbXBsZSEnKTtcclxufTtcclxuKi9cclxuIl19