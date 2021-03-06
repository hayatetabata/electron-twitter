const {app, BrowserWindow, globalShortcut} = require('electron');

module.exports = class FormWindow {
    constructor() {
        this.window = null;
        this.start();
    }

    start() {
        app.on('ready', () => {
            this.createWindow();
            this.registerGlobalShortcut();
        });

        app.on('showForm', () => {
            this.window.show();
        });

        app.on('will-quit', () => {
            globalShortcut.unregisterAll();
        });
    }

    registerGlobalShortcut() {
        const accelerator = 'CommandOrControl+Shift+N';
        if (globalShortcut.isRegistered(accelerator)) {
            return;
        }

        globalShortcut.register(accelerator, () => {
            this.window.show();
        });
    }

    createWindow() {
        this.window = new BrowserWindow({
            title: 'ツイート',
            center: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            width: 600,//300
            height: 500,//250
            show: false
        });

        this.window.on('close', (event) => {
            if (this.window.isVisible()) {
                this.window.hide();
                event.preventDefault();
            }
        });

        this.window.
         loadURL('file://' + __dirname + '/../../html/form.html');
    }
};
