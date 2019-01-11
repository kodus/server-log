interface PanelWindow extends Window {
    //respond(msg: string): void
    //do_something(msg: string): void
    onRequest(request: chrome.devtools.network.Request): void;
    onNavigation(url: string): void;
}
