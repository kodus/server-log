interface PanelWindow extends Window {
    //respond(msg: string): void
    //do_something(msg: string): void
    onRequest(reqest: chrome.devtools.network.Request): void;
    onNavigation(url: string): void;
}
