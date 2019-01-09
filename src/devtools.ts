console.log("START: devtools.js");

chrome.devtools.panels.create("Server Log", "toolbar-icon.png", "panel.html", panel => {
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
