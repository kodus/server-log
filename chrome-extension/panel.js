import { renderLog } from "./log.js";
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
    panel.onRequest = transaction => {
        console.log("ON REQUEST", transaction);
        // NOTE: weird typecasts required here because the request/response properties
        //       aren't defined in `@types/chrome` - we have to pull these definitions
        //       from a separate package `@types/har-format` and manually cast:
        const request = transaction.request;
        const response = transaction.response;
        for (let header of response.headers) {
            const name = header.name.toLowerCase();
            if (name === "x-chromelogger-data") {
                try {
                    const log = JSON.parse(atob(header.value));
                    console.log("PARSE LOG", log);
                    appendContent(Promise.resolve(renderLog(log)));
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBTyxNQUFNLFVBQVUsQ0FBQztBQUcxQyxNQUFNLFFBQVMsU0FBUSxXQUFXO0lBRzlCO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsT0FBTyxDQUFDLElBQVk7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUU3QixDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDM0MsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRTdDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FDNUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDSjtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRTdDLENBQUMsQ0FBQyxLQUFrQixFQUFFLEVBQUU7SUFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRS9CLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFjLGdCQUFnQixDQUFFLENBQUM7SUFFN0UsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsRUFBRTtRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2Qyw4RUFBOEU7UUFDOUUsOEVBQThFO1FBQzlFLHVFQUF1RTtRQUV2RSxNQUFNLE9BQU8sR0FBSSxXQUFtQixDQUFDLE9BQWtCLENBQUM7UUFDeEQsTUFBTSxRQUFRLEdBQUksV0FBbUIsQ0FBQyxRQUFvQixDQUFDO1FBRTNELEtBQUssSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRXZDLElBQUksSUFBSSxLQUFLLHFCQUFxQixFQUFFO2dCQUNoQyxJQUFJO29CQUNBLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFOUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekQ7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEI7YUFDSjtTQUNKO0lBQ0wsQ0FBQyxDQUFBO0lBRUQsS0FBSyxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsRUFBRTtRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVsQyxRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUV4QixhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUM7SUFFRixTQUFTLGFBQWEsQ0FBQyxJQUFxQjtRQUN4QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBYSxDQUFDO1FBRTNELFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMsTUFBcUIsQ0FBQyxDQUFDO0FBRTFCOzs7Ozs7Ozs7Ozs7OztFQWNFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyTG9nLCBMb2cgfSBmcm9tIFwiLi9sb2cuanNcIjtcclxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiaGFyLWZvcm1hdFwiO1xyXG5cclxuY2xhc3MgTG9nRW50cnkgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwcml2YXRlIHNoYWRvdzogU2hhZG93Um9vdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnNoYWRvdyA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogXCJvcGVuXCIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SFRNTChodG1sOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgZG9jID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAgICAgICBbLi4uZG9jLmhlYWQucXVlcnlTZWxlY3RvckFsbChcInN0eWxlXCIpXS5mb3JFYWNoKFxyXG4gICAgICAgICAgICBzdHlsZSA9PiB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChzdHlsZSkpO1xyXG5cclxuICAgICAgICBbLi4uZG9jLmJvZHkuY2hpbGROb2Rlc10uZm9yRWFjaChcclxuICAgICAgICAgICAgbm9kZSA9PiB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChub2RlKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImxvZy1lbnRyeVwiLCBMb2dFbnRyeSk7XHJcblxyXG4oKHBhbmVsOiBQYW5lbFdpbmRvdykgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiU1RBUlQ6IHBhbmVsLmpzXCIpO1xyXG5cclxuICAgIGNvbnN0ICRjb250ZW50ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIltkYXRhLWNvbnRlbnRdXCIpITtcclxuXHJcbiAgICBwYW5lbC5vblJlcXVlc3QgPSB0cmFuc2FjdGlvbiA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJPTiBSRVFVRVNUXCIsIHRyYW5zYWN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gTk9URTogd2VpcmQgdHlwZWNhc3RzIHJlcXVpcmVkIGhlcmUgYmVjYXVzZSB0aGUgcmVxdWVzdC9yZXNwb25zZSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgLy8gICAgICAgYXJlbid0IGRlZmluZWQgaW4gYEB0eXBlcy9jaHJvbWVgIC0gd2UgaGF2ZSB0byBwdWxsIHRoZXNlIGRlZmluaXRpb25zXHJcbiAgICAgICAgLy8gICAgICAgZnJvbSBhIHNlcGFyYXRlIHBhY2thZ2UgYEB0eXBlcy9oYXItZm9ybWF0YCBhbmQgbWFudWFsbHkgY2FzdDpcclxuXHJcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9ICh0cmFuc2FjdGlvbiBhcyBhbnkpLnJlcXVlc3QgYXMgUmVxdWVzdDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9ICh0cmFuc2FjdGlvbiBhcyBhbnkpLnJlc3BvbnNlIGFzIFJlc3BvbnNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBoZWFkZXIgb2YgcmVzcG9uc2UuaGVhZGVycykge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaGVhZGVyLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuYW1lID09PSBcIngtY2hyb21lbG9nZ2VyLWRhdGFcIikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2cgPSBKU09OLnBhcnNlKGF0b2IoaGVhZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQQVJTRSBMT0dcIiwgbG9nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kQ29udGVudChQcm9taXNlLnJlc29sdmUocmVuZGVyTG9nKGxvZyBhcyBMb2cpKSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYW5lbC5vbk5hdmlnYXRpb24gPSB1cmwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT04gTkFWSUdBVElPTlwiLCB1cmwpO1xyXG5cclxuICAgICAgICAkY29udGVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICBhcHBlbmRDb250ZW50KFByb21pc2UucmVzb2x2ZShgPGgxPiR7dXJsfTwvaDE+YCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRDb250ZW50KGh0bWw6IFByb21pc2U8c3RyaW5nPikge1xyXG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxvZy1lbnRyeVwiKSBhcyBMb2dFbnRyeTtcclxuXHJcbiAgICAgICAgJGNvbnRlbnQuYXBwZW5kQ2hpbGQoZWwpO1xyXG5cclxuICAgICAgICBodG1sLnRoZW4oaHRtbCA9PiBlbC5zZXRIVE1MKGh0bWwpKTtcclxuICAgIH1cclxuICAgIFxyXG59KSh3aW5kb3cgYXMgUGFuZWxXaW5kb3cpO1xyXG5cclxuLypcclxuXHJcbi8vIE5PVEU6IGRvbid0IG5lZWQgdGhpcyBmb3Igbm93IC0gbWlnaHQgbmVlZCBpdCB0byBjb21tdW5pY2F0ZSB3aXRoIFwiYmFja2dyb3VuZC5qc1wiXHJcblxyXG5wYW5lbF93aW5kb3cuZG9fc29tZXRoaW5nID0gKG1zZzogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkRPSU5HIFNPTUVUSElOR1wiKTtcclxuICAgIGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQgKz0gJ1xcbicgKyBtc2c7IC8vIFN0dXBpZCBleGFtcGxlLCBQb0NcclxufVxyXG5cclxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYHJlc3BvbmRgLCBiZWNhdXNlXHJcbiAgICAvLyB0aGUgcGFuZWwgY2FuIG9ubHkgYmUgY2xpY2tlZCB3aGVuIGl0J3MgdmlzaWJsZS4uLlxyXG4gICAgcGFuZWxfd2luZG93LnJlc3BvbmQoJ0Fub3RoZXIgc3R1cGlkIGV4YW1wbGUhJyk7XHJcbn07XHJcbiovXHJcbiJdfQ==