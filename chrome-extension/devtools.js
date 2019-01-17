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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGV2dG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQUMsR0FBRyxFQUFFO0lBRUY7Ozs7O09BS0c7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFJbEMsSUFBSSxNQUErQixDQUFDO0lBRXBDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixTQUFTLEtBQUssQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1YsSUFBSSxNQUFNLEVBQUU7WUFDUixLQUFLLElBQUksRUFBRSxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2Q7WUFFRCxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXJELEtBQUssRUFBRSxDQUFDO1FBRVIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVELG1DQUFtQztRQUVuQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxNQUFNO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7WUFFM0QsTUFBTSxHQUFHLE1BQXFCLENBQUM7WUFFL0IsS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUEwQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIoKCkgPT4ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBzY3JpcHQgcnVucyBpbiB0aGUgYmFja2dyb3VuZCBhcyBzb29uIGFzIERldnRvb2xzIGlzIG9wZW5lZC5cclxuICAgICAqIFxyXG4gICAgICogV2UgcHVzaCBhY3Rpb25zIHRlbXBvcmFyaWx5IHRvIGEgcXVldWUsIHVudGlsIHRoZSBwYW5lbCBpcyBvcGVuZWQsIHRvIGF2b2lkXHJcbiAgICAgKiBsb2FkaW5nIGFuZCBwcm9jZXNzaW5nIG9mIGNvbnRlbnQgdGhhdCB3b24ndCBiZSB2aXNpYmxlIHRvIHRoZSB1c2VyIGFueXdheS5cclxuICAgICAqL1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiU1RBUlQ6IGRldnRvb2xzLmpzXCIpO1xyXG5cclxuICAgIHR5cGUgQWN0aW9uID0geyAocGFuZWw6IFBhbmVsV2luZG93KTogdm9pZCB9O1xyXG5cclxuICAgIGxldCBfcGFuZWw6IFBhbmVsV2luZG93IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGxldCBfcXVldWU6IEFjdGlvbltdID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gcXVldWUoYWN0aW9uOiBBY3Rpb24pIHtcclxuICAgICAgICBfcXVldWUucHVzaChhY3Rpb24pO1xyXG5cclxuICAgICAgICBmbHVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgIF9xdWV1ZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZsdXNoKCkge1xyXG4gICAgICAgIGlmIChfcGFuZWwpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgZm4gb2YgX3F1ZXVlKSB7XHJcbiAgICAgICAgICAgICAgICBmbihfcGFuZWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfcXVldWUgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25OYXZpZ2F0ZWQuYWRkTGlzdGVuZXIodXJsID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5BVklHQVRFOiBjbGVhciBwZW5kaW5nIHJlcXVlc3RzXCIsIHVybCk7XHJcbiAgICBcclxuICAgICAgICBjbGVhcigpO1xyXG5cclxuICAgICAgICBxdWV1ZShwYW5lbCA9PiBwYW5lbC5vbk5hdmlnYXRpb24odXJsKSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25SZXF1ZXN0RmluaXNoZWQuYWRkTGlzdGVuZXIocmVxdWVzdCA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRVFVRVNUXCIsIHJlcXVlc3QpO1xyXG4gICAgXHJcbiAgICAgICAgcXVldWUocGFuZWwgPT4gcGFuZWwub25SZXF1ZXN0KHJlcXVlc3QpKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjaHJvbWUuZGV2dG9vbHMucGFuZWxzLmNyZWF0ZShcIlNlcnZlciBMb2dcIiwgXCJ0b29sYmFyLWljb24ucG5nXCIsIFwicGFuZWwuaHRtbFwiLCBwYW5lbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDUkVBVEUgUEFORUxcIiwgcGFuZWwpO1xyXG5cclxuICAgICAgICBwYW5lbC5vblNob3duLmFkZExpc3RlbmVyKGZ1bmN0aW9uIG9uU2hvd1BhbmVsKHdpbmRvdykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgUEFORUxcIik7XHJcblxyXG4gICAgICAgICAgICBwYW5lbC5vblNob3duLnJlbW92ZUxpc3RlbmVyKG9uU2hvd1BhbmVsKTsgLy8gcnVuIG9uY2Ugb25seVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX3BhbmVsID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxuICAgICAgICAgICAgZmx1c2goKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuXHJcbi8qXHJcblxyXG4vLyB0aGlzIHdvbid0IGJlIG5lY2Vzc2FyeSB1bmxlc3Mgd2UgbmVlZCB0byBjb25uZWN0IHRvIFwiYmFja2dyb3VuZC5qc1wiXHJcbi8vIGF0IHRoZSBtb21lbnQgaXQgZG9lc24ndCBsb29rIGxpa2UgdGhhdCB3aWxsIGJlIG5lY2Vzc2FyeS5cclxuXHJcbmNocm9tZS5kZXZ0b29scy5wYW5lbHMuY3JlYXRlKFwiU2VydmVyIExvZ1wiLCBcInRvb2xiYXItaWNvbi5wbmdcIiwgXCJwYW5lbC5odG1sXCIsIHBhbmVsID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ1JFQVRFIFBBTkVMXCIpO1xyXG5cclxuICAgIGxldCBwYW5lbF93aW5kb3c6IFBhbmVsV2luZG93OyAvLyBHb2luZyB0byBob2xkIHRoZSByZWZlcmVuY2UgdG8gcGFuZWwuaHRtbCdzIGB3aW5kb3dgXHJcblxyXG4gICAgbGV0IGRhdGE6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGxldCBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZTogJ3NlcnZlci1sb2cnfSk7XHJcblxyXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgLy8gV3JpdGUgaW5mb3JtYXRpb24gdG8gdGhlIHBhbmVsLCBpZiBleGlzdHMuXHJcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHBhbmVsIHJlZmVyZW5jZSAoeWV0KSwgcXVldWUgdGhlIGRhdGEuXHJcbiAgICAgICAgaWYgKHBhbmVsX3dpbmRvdykge1xyXG4gICAgICAgICAgICBwYW5lbF93aW5kb3cuZG9fc29tZXRoaW5nKG1zZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGFuZWwub25TaG93bi5hZGRMaXN0ZW5lcihmdW5jdGlvbiB0bXAod2luZG93KSB7XHJcbiAgICAgICAgcGFuZWwub25TaG93bi5yZW1vdmVMaXN0ZW5lcih0bXApOyAvLyBSdW4gb25jZSBvbmx5XHJcbiAgICAgICAgcGFuZWxfd2luZG93ID0gd2luZG93IGFzIFBhbmVsV2luZG93O1xyXG5cclxuICAgICAgICAvLyBSZWxlYXNlIHF1ZXVlZCBkYXRhXHJcbiAgICAgICAgbGV0IG1zZzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB3aGlsZSAobXNnID0gZGF0YS5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIHBhbmVsX3dpbmRvdy5kb19zb21ldGhpbmcobXNnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEp1c3QgdG8gc2hvdyB0aGF0IGl0J3MgZWFzeSB0byB0YWxrIHRvIHBhc3MgYSBtZXNzYWdlIGJhY2s6XHJcblxyXG4gICAgICAgIHBhbmVsX3dpbmRvdy5yZXNwb25kID0gZnVuY3Rpb24obXNnOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZShtc2cpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSk7XHJcbiovXHJcbiJdfQ==