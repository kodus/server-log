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
        console.log("CREATE PANEL", panel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGV2dG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQUMsR0FBRyxFQUFFO0lBRUY7Ozs7O09BS0c7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFJbEMsSUFBSSxNQUErQixDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixTQUFTLEtBQUssQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXJELEtBQUssRUFBRSxDQUFDO1FBRVIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVELG1DQUFtQztRQUVuQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxNQUFNO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7WUFFM0QsTUFBTSxHQUFHLE1BQXFCLENBQUM7WUFFL0IsS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUEwQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIoKCkgPT4ge1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBzY3JpcHQgcnVucyBpbiB0aGUgYmFja2dyb3VuZCBhcyBzb29uIGFzIERldnRvb2xzIGlzIG9wZW5lZC5cbiAgICAgKiBcbiAgICAgKiBXZSBwdXNoIGFjdGlvbnMgdGVtcG9yYXJpbHkgdG8gYSBxdWV1ZSwgdW50aWwgdGhlIHBhbmVsIGlzIG9wZW5lZCwgdG8gYXZvaWRcbiAgICAgKiBsb2FkaW5nIGFuZCBwcm9jZXNzaW5nIG9mIGNvbnRlbnQgdGhhdCB3b24ndCBiZSB2aXNpYmxlIHRvIHRoZSB1c2VyIGFueXdheS5cbiAgICAgKi9cblxuICAgIGNvbnNvbGUubG9nKFwiU1RBUlQ6IGRldnRvb2xzLmpzXCIpO1xuXG4gICAgdHlwZSBBY3Rpb24gPSB7IChwYW5lbDogUGFuZWxXaW5kb3cpOiB2b2lkIH07XG5cbiAgICBsZXQgX3BhbmVsOiBQYW5lbFdpbmRvdyB8IHVuZGVmaW5lZDtcblxuICAgIGxldCBfcXVldWU6IEFjdGlvbltdID0gW107XG5cbiAgICBmdW5jdGlvbiBxdWV1ZShhY3Rpb246IEFjdGlvbikge1xuICAgICAgICBfcXVldWUucHVzaChhY3Rpb24pO1xuXG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIF9xdWV1ZSA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgICAgICBpZiAoX3BhbmVsKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBmbiBvZiBfcXVldWUpIHtcbiAgICAgICAgICAgICAgICBmbihfcGFuZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfcXVldWUgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNocm9tZS5kZXZ0b29scy5uZXR3b3JrLm9uTmF2aWdhdGVkLmFkZExpc3RlbmVyKHVybCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTkFWSUdBVEU6IGNsZWFyIHBlbmRpbmcgcmVxdWVzdHNcIiwgdXJsKTtcbiAgICBcbiAgICAgICAgY2xlYXIoKTtcblxuICAgICAgICBxdWV1ZShwYW5lbCA9PiBwYW5lbC5vbk5hdmlnYXRpb24odXJsKSk7XG4gICAgfSk7XG4gICAgXG4gICAgY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25SZXF1ZXN0RmluaXNoZWQuYWRkTGlzdGVuZXIocmVxdWVzdCA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVRVUVTVFwiLCByZXF1ZXN0KTtcbiAgICBcbiAgICAgICAgcXVldWUocGFuZWwgPT4gcGFuZWwub25SZXF1ZXN0KHJlcXVlc3QpKTtcbiAgICB9KTtcbiAgICBcbiAgICBjaHJvbWUuZGV2dG9vbHMucGFuZWxzLmNyZWF0ZShcIlNlcnZlciBMb2dcIiwgXCJ0b29sYmFyLWljb24ucG5nXCIsIFwicGFuZWwuaHRtbFwiLCBwYW5lbCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFBBTkVMXCIsIHBhbmVsKTtcblxuICAgICAgICBwYW5lbC5vblNob3duLmFkZExpc3RlbmVyKGZ1bmN0aW9uIG9uU2hvd1BhbmVsKHdpbmRvdykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTSE9XIFBBTkVMXCIpO1xuXG4gICAgICAgICAgICBwYW5lbC5vblNob3duLnJlbW92ZUxpc3RlbmVyKG9uU2hvd1BhbmVsKTsgLy8gcnVuIG9uY2Ugb25seVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBfcGFuZWwgPSB3aW5kb3cgYXMgUGFuZWxXaW5kb3c7XG5cbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuXG4vKlxuXG4vLyB0aGlzIHdvbid0IGJlIG5lY2Vzc2FyeSB1bmxlc3Mgd2UgbmVlZCB0byBjb25uZWN0IHRvIFwiYmFja2dyb3VuZC5qc1wiXG4vLyBhdCB0aGUgbW9tZW50IGl0IGRvZXNuJ3QgbG9vayBsaWtlIHRoYXQgd2lsbCBiZSBuZWNlc3NhcnkuXG5cbmNocm9tZS5kZXZ0b29scy5wYW5lbHMuY3JlYXRlKFwiU2VydmVyIExvZ1wiLCBcInRvb2xiYXItaWNvbi5wbmdcIiwgXCJwYW5lbC5odG1sXCIsIHBhbmVsID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNSRUFURSBQQU5FTFwiKTtcblxuICAgIGxldCBwYW5lbF93aW5kb3c6IFBhbmVsV2luZG93OyAvLyBHb2luZyB0byBob2xkIHRoZSByZWZlcmVuY2UgdG8gcGFuZWwuaHRtbCdzIGB3aW5kb3dgXG5cbiAgICBsZXQgZGF0YTogc3RyaW5nW10gPSBbXTtcbiAgICBcbiAgICBsZXQgcG9ydCA9IGNocm9tZS5ydW50aW1lLmNvbm5lY3Qoe25hbWU6ICdzZXJ2ZXItbG9nJ30pO1xuXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXNnKSB7XG4gICAgICAgIC8vIFdyaXRlIGluZm9ybWF0aW9uIHRvIHRoZSBwYW5lbCwgaWYgZXhpc3RzLlxuICAgICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFuZWwgcmVmZXJlbmNlICh5ZXQpLCBxdWV1ZSB0aGUgZGF0YS5cbiAgICAgICAgaWYgKHBhbmVsX3dpbmRvdykge1xuICAgICAgICAgICAgcGFuZWxfd2luZG93LmRvX3NvbWV0aGluZyhtc2cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5wdXNoKG1zZyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhbmVsLm9uU2hvd24uYWRkTGlzdGVuZXIoZnVuY3Rpb24gdG1wKHdpbmRvdykge1xuICAgICAgICBwYW5lbC5vblNob3duLnJlbW92ZUxpc3RlbmVyKHRtcCk7IC8vIFJ1biBvbmNlIG9ubHlcbiAgICAgICAgcGFuZWxfd2luZG93ID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xuXG4gICAgICAgIC8vIFJlbGVhc2UgcXVldWVkIGRhdGFcbiAgICAgICAgbGV0IG1zZzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgICAgIHdoaWxlIChtc2cgPSBkYXRhLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgIHBhbmVsX3dpbmRvdy5kb19zb21ldGhpbmcobXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgZWFzeSB0byB0YWxrIHRvIHBhc3MgYSBtZXNzYWdlIGJhY2s6XG5cbiAgICAgICAgcGFuZWxfd2luZG93LnJlc3BvbmQgPSBmdW5jdGlvbihtc2c6IHN0cmluZykge1xuICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShtc2cpO1xuICAgICAgICB9O1xuICAgIH0pO1xufSk7XG4qL1xuIl19