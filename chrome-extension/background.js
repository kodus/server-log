"use strict";
/*

// NOTE: this is unused at the moment.
//       if we need this later, add this to the manifest:
//       "background": { "scripts": ["background.js"] }

console.log("START: background.js");

let ports: chrome.runtime.Port[] = [];

chrome.runtime.onConnect.addListener(port => {
    console.log("CONNECTING", port);

    if (port.name === "server-log") {
        ports.push(port);

        port.onDisconnect.addListener(() => {
            // Remove port when destroyed (eg when devtools instance is closed)

            console.log("DISCONNECTING", port);

            ports = ports.filter(p => p !== port);

            console.log(`(${ports.length} ports remaining)`);
        });

        port.onMessage.addListener(function(msg) {
            // Received message from devtools. Do something:
            console.log("RECEIVED", msg);
        });
    }
});

// Function to send a message to all devtools.html views:

function notifyDevtools(msg: string) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}

// chrome.devtools.network.onRequestFinished.addListener(request => {
//     console.log("REQUEST", request);
// });
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0Q0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5cclxuLy8gTk9URTogdGhpcyBpcyB1bnVzZWQgYXQgdGhlIG1vbWVudC5cclxuLy8gICAgICAgaWYgd2UgbmVlZCB0aGlzIGxhdGVyLCBhZGQgdGhpcyB0byB0aGUgbWFuaWZlc3Q6XHJcbi8vICAgICAgIFwiYmFja2dyb3VuZFwiOiB7IFwic2NyaXB0c1wiOiBbXCJiYWNrZ3JvdW5kLmpzXCJdIH1cclxuXHJcbmNvbnNvbGUubG9nKFwiU1RBUlQ6IGJhY2tncm91bmQuanNcIik7XHJcblxyXG5sZXQgcG9ydHM6IGNocm9tZS5ydW50aW1lLlBvcnRbXSA9IFtdO1xyXG5cclxuY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKHBvcnQgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJDT05ORUNUSU5HXCIsIHBvcnQpO1xyXG5cclxuICAgIGlmIChwb3J0Lm5hbWUgPT09IFwic2VydmVyLWxvZ1wiKSB7XHJcbiAgICAgICAgcG9ydHMucHVzaChwb3J0KTtcclxuXHJcbiAgICAgICAgcG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgcG9ydCB3aGVuIGRlc3Ryb3llZCAoZWcgd2hlbiBkZXZ0b29scyBpbnN0YW5jZSBpcyBjbG9zZWQpXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRJU0NPTk5FQ1RJTkdcIiwgcG9ydCk7XHJcblxyXG4gICAgICAgICAgICBwb3J0cyA9IHBvcnRzLmZpbHRlcihwID0+IHAgIT09IHBvcnQpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coYCgke3BvcnRzLmxlbmd0aH0gcG9ydHMgcmVtYWluaW5nKWApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgLy8gUmVjZWl2ZWQgbWVzc2FnZSBmcm9tIGRldnRvb2xzLiBEbyBzb21ldGhpbmc6XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVDRUlWRURcIiwgbXNnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBGdW5jdGlvbiB0byBzZW5kIGEgbWVzc2FnZSB0byBhbGwgZGV2dG9vbHMuaHRtbCB2aWV3czpcclxuXHJcbmZ1bmN0aW9uIG5vdGlmeURldnRvb2xzKG1zZzogc3RyaW5nKSB7XHJcbiAgICBwb3J0cy5mb3JFYWNoKGZ1bmN0aW9uKHBvcnQpIHtcclxuICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKG1zZyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gY2hyb21lLmRldnRvb2xzLm5ldHdvcmsub25SZXF1ZXN0RmluaXNoZWQuYWRkTGlzdGVuZXIocmVxdWVzdCA9PiB7XHJcbi8vICAgICBjb25zb2xlLmxvZyhcIlJFUVVFU1RcIiwgcmVxdWVzdCk7XHJcbi8vIH0pO1xyXG4qL1xyXG4iXX0=