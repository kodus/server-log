"use strict";
(() => {
    /**
     * This script runs in the background as soon as Devtools is opened.
     *
     * We push actions temporarily to a queue, until the panel is opened, to avoid
     * loading and processing of content that won't be visible to the user anyway.
     */
    console.log("START: devtools.js");
    let _panel;
    let _queue = [];
    function queue(action) {
        _queue.push(action);
        flush();
    }
    function clear() {
        _queue = [];
    }
    function flush() {
        if (_panel) {
            for (let fn of _queue) {
                fn(_panel);
            }
            _queue = [];
        }
    }
    chrome.devtools.network.onNavigated.addListener(url => {
        console.log("NAVIGATE: clear pending requests", url);
        clear();
        queue(panel => panel.onNavigation(url));
    });
    chrome.devtools.network.onRequestFinished.addListener(request => {
        // console.log("REQUEST", request);
        queue(panel => panel.onRequest(request));
    });
    chrome.devtools.panels.create("Server Log", "toolbar-icon.png", "panel.html", panel => {
        console.log("CREATE PANEL");
        panel.onShown.addListener(function onShowPanel(window) {
            console.log("SHOW PANEL");
            panel.onShown.removeListener(onShowPanel); // run once only
            _panel = window;
            flush();
        });
    });
})();
/*

// this won't be necessary unless we need to connect to "background.js"
// at the moment it doesn't look like that will be necessary.

chrome.devtools.panels.create("Server Log", "toolbar-icon.png", "panel.html", panel => {
    console.log("CREATE PANEL");

    let panel_window: PanelWindow; // Going to hold the reference to panel.html's `window`

    let data: string[] = [];
    
    let port = chrome.runtime.connect({name: 'server-log'});

    port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if (panel_window) {
            panel_window.do_something(msg);
        } else {
            data.push(msg);
        }
    });

    panel.onShown.addListener(function tmp(window) {
        panel.onShown.removeListener(tmp); // Run once only
        panel_window = window as PanelWindow;

        // Release queued data
        let msg: string | undefined;

        while (msg = data.shift()) {
            panel_window.do_something(msg);
        }

        // Just to show that it's easy to talk to pass a message back:

        panel_window.respond = function(msg: string) {
            port.postMessage(msg);
        };
    });
});
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGV2dG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQUMsR0FBRyxFQUFFO0lBRUY7Ozs7O09BS0c7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFJbEMsSUFBSSxNQUErQixDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixTQUFTLEtBQUssQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXJELEtBQUssRUFBRSxDQUFDO1FBRVIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVELG1DQUFtQztRQUVuQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVCLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsV0FBVyxDQUFDLE1BQU07WUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUxQixLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtZQUUzRCxNQUFNLEdBQUcsTUFBcUIsQ0FBQztZQUUvQixLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBDRSIsInNvdXJjZXNDb250ZW50IjpbIigoKSA9PiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIHNjcmlwdCBydW5zIGluIHRoZSBiYWNrZ3JvdW5kIGFzIHNvb24gYXMgRGV2dG9vbHMgaXMgb3BlbmVkLlxyXG4gICAgICogXHJcbiAgICAgKiBXZSBwdXNoIGFjdGlvbnMgdGVtcG9yYXJpbHkgdG8gYSBxdWV1ZSwgdW50aWwgdGhlIHBhbmVsIGlzIG9wZW5lZCwgdG8gYXZvaWRcclxuICAgICAqIGxvYWRpbmcgYW5kIHByb2Nlc3Npbmcgb2YgY29udGVudCB0aGF0IHdvbid0IGJlIHZpc2libGUgdG8gdGhlIHVzZXIgYW55d2F5LlxyXG4gICAgICovXHJcblxyXG4gICAgY29uc29sZS5sb2coXCJTVEFSVDogZGV2dG9vbHMuanNcIik7XHJcblxyXG4gICAgdHlwZSBBY3Rpb24gPSB7IChwYW5lbDogUGFuZWxXaW5kb3cpOiB2b2lkIH07XHJcblxyXG4gICAgbGV0IF9wYW5lbDogUGFuZWxXaW5kb3cgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgbGV0IF9xdWV1ZTogQWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBxdWV1ZShhY3Rpb246IEFjdGlvbikge1xyXG4gICAgICAgIF9xdWV1ZS5wdXNoKGFjdGlvbik7XHJcblxyXG4gICAgICAgIGZsdXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgX3F1ZXVlID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmx1c2goKSB7XHJcbiAgICAgICAgaWYgKF9wYW5lbCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBmbiBvZiBfcXVldWUpIHtcclxuICAgICAgICAgICAgICAgIGZuKF9wYW5lbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF9xdWV1ZSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vbk5hdmlnYXRlZC5hZGRMaXN0ZW5lcih1cmwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTkFWSUdBVEU6IGNsZWFyIHBlbmRpbmcgcmVxdWVzdHNcIiwgdXJsKTtcclxuICAgIFxyXG4gICAgICAgIGNsZWFyKCk7XHJcblxyXG4gICAgICAgIHF1ZXVlKHBhbmVsID0+IHBhbmVsLm9uTmF2aWdhdGlvbih1cmwpKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjaHJvbWUuZGV2dG9vbHMubmV0d29yay5vblJlcXVlc3RGaW5pc2hlZC5hZGRMaXN0ZW5lcihyZXF1ZXN0ID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFUVVFU1RcIiwgcmVxdWVzdCk7XHJcbiAgICBcclxuICAgICAgICBxdWV1ZShwYW5lbCA9PiBwYW5lbC5vblJlcXVlc3QocmVxdWVzdCkpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGNocm9tZS5kZXZ0b29scy5wYW5lbHMuY3JlYXRlKFwiU2VydmVyIExvZ1wiLCBcInRvb2xiYXItaWNvbi5wbmdcIiwgXCJwYW5lbC5odG1sXCIsIHBhbmVsID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNSRUFURSBQQU5FTFwiKTtcclxuXHJcbiAgICAgICAgcGFuZWwub25TaG93bi5hZGRMaXN0ZW5lcihmdW5jdGlvbiBvblNob3dQYW5lbCh3aW5kb3cpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTSE9XIFBBTkVMXCIpO1xyXG5cclxuICAgICAgICAgICAgcGFuZWwub25TaG93bi5yZW1vdmVMaXN0ZW5lcihvblNob3dQYW5lbCk7IC8vIHJ1biBvbmNlIG9ubHlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIF9wYW5lbCA9IHdpbmRvdyBhcyBQYW5lbFdpbmRvdztcclxuXHJcbiAgICAgICAgICAgIGZsdXNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcblxyXG4vKlxyXG5cclxuLy8gdGhpcyB3b24ndCBiZSBuZWNlc3NhcnkgdW5sZXNzIHdlIG5lZWQgdG8gY29ubmVjdCB0byBcImJhY2tncm91bmQuanNcIlxyXG4vLyBhdCB0aGUgbW9tZW50IGl0IGRvZXNuJ3QgbG9vayBsaWtlIHRoYXQgd2lsbCBiZSBuZWNlc3NhcnkuXHJcblxyXG5jaHJvbWUuZGV2dG9vbHMucGFuZWxzLmNyZWF0ZShcIlNlcnZlciBMb2dcIiwgXCJ0b29sYmFyLWljb24ucG5nXCIsIFwicGFuZWwuaHRtbFwiLCBwYW5lbCA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNSRUFURSBQQU5FTFwiKTtcclxuXHJcbiAgICBsZXQgcGFuZWxfd2luZG93OiBQYW5lbFdpbmRvdzsgLy8gR29pbmcgdG8gaG9sZCB0aGUgcmVmZXJlbmNlIHRvIHBhbmVsLmh0bWwncyBgd2luZG93YFxyXG5cclxuICAgIGxldCBkYXRhOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBsZXQgcG9ydCA9IGNocm9tZS5ydW50aW1lLmNvbm5lY3Qoe25hbWU6ICdzZXJ2ZXItbG9nJ30pO1xyXG5cclxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgIC8vIFdyaXRlIGluZm9ybWF0aW9uIHRvIHRoZSBwYW5lbCwgaWYgZXhpc3RzLlxyXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBwYW5lbCByZWZlcmVuY2UgKHlldCksIHF1ZXVlIHRoZSBkYXRhLlxyXG4gICAgICAgIGlmIChwYW5lbF93aW5kb3cpIHtcclxuICAgICAgICAgICAgcGFuZWxfd2luZG93LmRvX3NvbWV0aGluZyhtc2cpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaChtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHBhbmVsLm9uU2hvd24uYWRkTGlzdGVuZXIoZnVuY3Rpb24gdG1wKHdpbmRvdykge1xyXG4gICAgICAgIHBhbmVsLm9uU2hvd24ucmVtb3ZlTGlzdGVuZXIodG1wKTsgLy8gUnVuIG9uY2Ugb25seVxyXG4gICAgICAgIHBhbmVsX3dpbmRvdyA9IHdpbmRvdyBhcyBQYW5lbFdpbmRvdztcclxuXHJcbiAgICAgICAgLy8gUmVsZWFzZSBxdWV1ZWQgZGF0YVxyXG4gICAgICAgIGxldCBtc2c6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgd2hpbGUgKG1zZyA9IGRhdGEuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICBwYW5lbF93aW5kb3cuZG9fc29tZXRoaW5nKG1zZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBKdXN0IHRvIHNob3cgdGhhdCBpdCdzIGVhc3kgdG8gdGFsayB0byBwYXNzIGEgbWVzc2FnZSBiYWNrOlxyXG5cclxuICAgICAgICBwYW5lbF93aW5kb3cucmVzcG9uZCA9IGZ1bmN0aW9uKG1zZzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UobXNnKTtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pO1xyXG4qL1xyXG4iXX0=