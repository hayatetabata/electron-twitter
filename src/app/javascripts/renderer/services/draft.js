const {app} = require('electron').remote;
const fs = require('fs');

module.exports = class Draft {
    static getPath() {
        return app.getPath('userData') + '/draft.txt';
    }

    static read() {
        return new Promise((onFulfilled, onRejected) => {
            fs.readFile(Draft.getPath(), 'utf8', (e, text) => {
                if (e) {
                    onRejected(e);
                    return;
                }
                onFulfilled(text);
            });
        });
    }

    static write(text) {
        return new Promise((onFulfilled, onRejected) => {
            fs.writeFile(Draft.getPath(), text, 'utf8', (e) => {
                if (e) {
                    onRejected(e);
                    return;
                }

                onFulfilled(text);
            });
        });
    }
};
