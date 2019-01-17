(() => {

    /**
     * This script runs in the background as soon as Devtools is opened.
     * 
     * We push actions temporarily to a queue, until the panel is opened, to avoid
     * loading and processing of content that won't be visible to the user anyway.
     */

    console.log("START: devtools.js");

    type Action = { (panel: PanelWindow): void };

    let _panel: PanelWindow | undefined;

    let _queue: Action[] = [];

    function queue(action: Action) {
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
            
            _panel = window as PanelWindow;

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
