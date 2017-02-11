const {app,BrowserWindow, ipcMain} = require('electron');

module.exports = class TimelineWindow{
    constructor(){
    this.window = null;
    this.newMentionsCount = 0;
    this.start();
    }

    start(){
        app.on('ready',() => {
            this.createWindow(); 
        });

        ipcMain.on('newMention', () => {
            if (this.window.isFocused()){
                return;
            }

            this.newMentionsCount++;
            this.updateBadge();
        });
    }

    createWindow(){
        this.window = new BrowserWindow({
            x:0,
            y:0,
            width:400,
            height:600
        });
        this.window.on('focus', () => {
            this.newMentionCount = 0;
            this.updateBadge();
        });

        this.window.loadURL(
          'file://'+ __dirname + '/../../html/main.html'
        );
    }

    updateBadge() {
        app.setBadgeCount(this.newMentionsCount);
        if (process.platform === 'darwin') {
            app.dock.bounce();
        }
    }
};
