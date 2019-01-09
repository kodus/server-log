"use strict";
(() => {
    /**
     * This script runs in the background as soon as Devtools is opened.
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
        console.log("REQUEST", request);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGV2dG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQUMsR0FBRyxFQUFFO0lBRUY7O09BRUc7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFJbEMsSUFBSSxNQUErQixDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixTQUFTLEtBQUssQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXJELEtBQUssRUFBRSxDQUFDO1FBRVIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxXQUFXLENBQUMsTUFBTTtZQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTFCLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1lBRTNELE1BQU0sR0FBRyxNQUFxQixDQUFDO1lBRS9CLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBMENFIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgc2NyaXB0IHJ1bnMgaW4gdGhlIGJhY2tncm91bmQgYXMgc29vbiBhcyBEZXZ0b29scyBpcyBvcGVuZWQuXHJcbiAgICAgKi9cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlNUQVJUOiBkZXZ0b29scy5qc1wiKTtcclxuXHJcbiAgICB0eXBlIEFjdGlvbiA9IHsgKHBhbmVsOiBQYW5lbFdpbmRvdyk6IHZvaWQgfTtcclxuXHJcbiAgICBsZXQgX3BhbmVsOiBQYW5lbFdpbmRvdyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBsZXQgX3F1ZXVlOiBBY3Rpb25bXSA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHF1ZXVlKGFjdGlvbjogQWN0aW9uKSB7XHJcbiAgICAgICAgX3F1ZXVlLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgZmx1c2goKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICBfcXVldWUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmbHVzaCgpIHtcclxuICAgICAgICBpZiAoX3BhbmVsKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGZuIG9mIF9xdWV1ZSkge1xyXG4gICAgICAgICAgICAgICAgZm4oX3BhbmVsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgX3F1ZXVlID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNocm9tZS5kZXZ0b29scy5uZXR3b3JrLm9uTmF2aWdhdGVkLmFkZExpc3RlbmVyKHVybCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJOQVZJR0FURTogY2xlYXIgcGVuZGluZyByZXF1ZXN0c1wiLCB1cmwpO1xyXG4gICAgXHJcbiAgICAgICAgY2xlYXIoKTtcclxuXHJcbiAgICAgICAgcXVldWUocGFuZWwgPT4gcGFuZWwub25OYXZpZ2F0aW9uKHVybCkpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGNocm9tZS5kZXZ0b29scy5uZXR3b3JrLm9uUmVxdWVzdEZpbmlzaGVkLmFkZExpc3RlbmVyKHJlcXVlc3QgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUkVRVUVTVFwiLCByZXF1ZXN0KTtcclxuICAgIFxyXG4gICAgICAgIHF1ZXVlKHBhbmVsID0+IHBhbmVsLm9uUmVxdWVzdChyZXF1ZXN0KSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY2hyb21lLmRldnRvb2xzLnBhbmVscy5jcmVhdGUoXCJTZXJ2ZXIgTG9nXCIsIFwidG9vbGJhci1pY29uLnBuZ1wiLCBcInBhbmVsLmh0bWxcIiwgcGFuZWwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFBBTkVMXCIpO1xyXG5cclxuICAgICAgICBwYW5lbC5vblNob3duLmFkZExpc3RlbmVyKGZ1bmN0aW9uIG9uU2hvd1BhbmVsKHdpbmRvdykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgUEFORUxcIik7XHJcblxyXG4gICAgICAgICAgICBwYW5lbC5vblNob3duLnJlbW92ZUxpc3RlbmVyKG9uU2hvd1BhbmVsKTsgLy8gcnVuIG9uY2Ugb25seVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX3BhbmVsID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxuICAgICAgICAgICAgZmx1c2goKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuXHJcbi8qXHJcblxyXG4vLyB0aGlzIHdvbid0IGJlIG5lY2Vzc2FyeSB1bmxlc3Mgd2UgbmVlZCB0byBjb25uZWN0IHRvIFwiYmFja2dyb3VuZC5qc1wiXHJcbi8vIGF0IHRoZSBtb21lbnQgaXQgZG9lc24ndCBsb29rIGxpa2UgdGhhdCB3aWxsIGJlIG5lY2Vzc2FyeS5cclxuXHJcbmNocm9tZS5kZXZ0b29scy5wYW5lbHMuY3JlYXRlKFwiU2VydmVyIExvZ1wiLCBcInRvb2xiYXItaWNvbi5wbmdcIiwgXCJwYW5lbC5odG1sXCIsIHBhbmVsID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFBBTkVMXCIpO1xyXG5cclxuICAgIGxldCBwYW5lbF93aW5kb3c6IFBhbmVsV2luZG93OyAvLyBHb2luZyB0byBob2xkIHRoZSByZWZlcmVuY2UgdG8gcGFuZWwuaHRtbCdzIGB3aW5kb3dgXHJcblxyXG4gICAgbGV0IGRhdGE6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGxldCBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZTogJ3NlcnZlci1sb2cnfSk7XHJcblxyXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgLy8gV3JpdGUgaW5mb3JtYXRpb24gdG8gdGhlIHBhbmVsLCBpZiBleGlzdHMuXHJcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHBhbmVsIHJlZmVyZW5jZSAoeWV0KSwgcXVldWUgdGhlIGRhdGEuXHJcbiAgICAgICAgaWYgKHBhbmVsX3dpbmRvdykge1xyXG4gICAgICAgICAgICBwYW5lbF93aW5kb3cuZG9fc29tZXRoaW5nKG1zZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGFuZWwub25TaG93bi5hZGRMaXN0ZW5lcihmdW5jdGlvbiB0bXAod2luZG93KSB7XHJcbiAgICAgICAgcGFuZWwub25TaG93bi5yZW1vdmVMaXN0ZW5lcih0bXApOyAvLyBSdW4gb25jZSBvbmx5XHJcbiAgICAgICAgcGFuZWxfd2luZG93ID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxuICAgICAgICAvLyBSZWxlYXNlIHF1ZXVlZCBkYXRhXHJcbiAgICAgICAgbGV0IG1zZzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB3aGlsZSAobXNnID0gZGF0YS5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIHBhbmVsX3dpbmRvdy5kb19zb21ldGhpbmcobXNnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgZWFzeSB0byB0YWxrIHRvIHBhc3MgYSBtZXNzYWdlIGJhY2s6XHJcblxyXG4gICAgICAgIHBhbmVsX3dpbmRvdy5yZXNwb25kID0gZnVuY3Rpb24obXNnOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShtc2cpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSk7XHJcbiovXHJcbiJdfQ==