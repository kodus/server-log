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
