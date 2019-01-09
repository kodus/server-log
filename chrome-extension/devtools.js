"use strict";
console.log("START: devtools.js");
chrome.devtools.panels.create("Server Log", "toolbar-icon.png", "panel.html", panel => {
    let panel_window; // Going to hold the reference to panel.html's `window`
    let data = [];
    let port = chrome.runtime.connect({ name: 'server-log' });
    port.onMessage.addListener(function (msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if (panel_window) {
            panel_window.do_something(msg);
        }
        else {
            data.push(msg);
        }
    });
    panel.onShown.addListener(function tmp(window) {
        panel.onShown.removeListener(tmp); // Run once only
        panel_window = window;
        // Release queued data
        let msg;
        while (msg = data.shift()) {
            panel_window.do_something(msg);
        }
        // Just to show that it's easy to talk to pass a message back:
        panel_window.respond = function (msg) {
            port.postMessage(msg);
        };
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGV2dG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVsQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTtJQUNsRixJQUFJLFlBQXlCLENBQUMsQ0FBQyx1REFBdUQ7SUFFdEYsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO0lBQ3hCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7SUFFeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBUyxHQUFHO1FBQ25DLDZDQUE2QztRQUM3Qyw0REFBNEQ7UUFDNUQsSUFBSSxZQUFZLEVBQUU7WUFDZCxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxNQUFNO1FBQ3pDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1FBQ25ELFlBQVksR0FBRyxNQUFxQixDQUFDO1FBRXJDLHNCQUFzQjtRQUN0QixJQUFJLEdBQXVCLENBQUM7UUFFNUIsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3ZCLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFFRCw4REFBOEQ7UUFFOUQsWUFBWSxDQUFDLE9BQU8sR0FBRyxVQUFTLEdBQVc7WUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coXCJTVEFSVDogZGV2dG9vbHMuanNcIik7XHJcblxyXG5jaHJvbWUuZGV2dG9vbHMucGFuZWxzLmNyZWF0ZShcIlNlcnZlciBMb2dcIiwgXCJ0b29sYmFyLWljb24ucG5nXCIsIFwicGFuZWwuaHRtbFwiLCBwYW5lbCA9PiB7XHJcbiAgICBsZXQgcGFuZWxfd2luZG93OiBQYW5lbFdpbmRvdzsgLy8gR29pbmcgdG8gaG9sZCB0aGUgcmVmZXJlbmNlIHRvIHBhbmVsLmh0bWwncyBgd2luZG93YFxyXG5cclxuICAgIGxldCBkYXRhOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgbGV0IHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KHtuYW1lOiAnc2VydmVyLWxvZyd9KTtcclxuXHJcbiAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAvLyBXcml0ZSBpbmZvcm1hdGlvbiB0byB0aGUgcGFuZWwsIGlmIGV4aXN0cy5cclxuICAgICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFuZWwgcmVmZXJlbmNlICh5ZXQpLCBxdWV1ZSB0aGUgZGF0YS5cclxuICAgICAgICBpZiAocGFuZWxfd2luZG93KSB7XHJcbiAgICAgICAgICAgIHBhbmVsX3dpbmRvdy5kb19zb21ldGhpbmcobXNnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhLnB1c2gobXNnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBwYW5lbC5vblNob3duLmFkZExpc3RlbmVyKGZ1bmN0aW9uIHRtcCh3aW5kb3cpIHtcclxuICAgICAgICBwYW5lbC5vblNob3duLnJlbW92ZUxpc3RlbmVyKHRtcCk7IC8vIFJ1biBvbmNlIG9ubHlcclxuICAgICAgICBwYW5lbF93aW5kb3cgPSB3aW5kb3cgYXMgUGFuZWxXaW5kb3c7XHJcblxyXG4gICAgICAgIC8vIFJlbGVhc2UgcXVldWVkIGRhdGFcclxuICAgICAgICBsZXQgbXNnOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHdoaWxlIChtc2cgPSBkYXRhLnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgcGFuZWxfd2luZG93LmRvX3NvbWV0aGluZyhtc2cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSnVzdCB0byBzaG93IHRoYXQgaXQncyBlYXN5IHRvIHRhbGsgdG8gcGFzcyBhIG1lc3NhZ2UgYmFjazpcclxuXHJcbiAgICAgICAgcGFuZWxfd2luZG93LnJlc3BvbmQgPSBmdW5jdGlvbihtc2c6IHN0cmluZykge1xyXG4gICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKG1zZyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KTtcclxuIl19