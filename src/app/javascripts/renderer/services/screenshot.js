const {desktopCapturer} = require('electron');
const {screen, nativeImage} = require('electron').remote;

module.exports = class Screenshot {
    static capture() {
    //ここまでは処理が読み込めている。
        return Screenshot.getStream()
        .catch(error => {
            console.log(error);
        })
        .then(Screenshot.getVideo)
        .then((video) => {
        //ここからの処理が読み込まれていない
        console.log('OK');
            const canvas = document.createElement('canvas');
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            canvas.getContent('2d').drawImage(
                video, 0, 0, videoWidth, videoHeight,
                0, 0, videoWidth, videoHeight);
            return nativeImage.createFormDataURL(
                canvas.toDataURL());
        });
    }

    static getStream() {
        const display = screen.getPrimaryDisplay();
        const bounds = display.bounds;
        const scale = display.scaleFactor;

        return new Promise((onFulfilled, onRejected) => {
            desktopCapturer.getSources({types: ['screen']}, (error, sources) => {
                if (error) {
                    throw error;
                }
                for (let i = 0; i < sources.length; ++i) {
                    if (sources[i].id.indexOf("screen") !== -1) {
                        navigator.webkitGetUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: sources[i].id,
                                    minWidth: bounds.width * scale,
                                    maxWidth: bounds.width * scale,
                                    minHeight: bounds.height * scale,
                                    maxHeight: bounds.height * scale,
                                }
                            }
                        }, onFulfilled, onRejected);
                        console.log('return');
                        return;
                    }
                }
            });
        });
    }

    static getVideo(stream) {
        const video = document.createElement('video');
        video.autoplay = true;
        video.src = URL.createObjectURL(stream);

        return new Promise((onFulfilled, onRejected) => {
            video.addEventListener('player', () => {
                onFulfilled(video);
            });
            video.addEventListener('error', (error) => {
                onrejected(error);
            });
        });
    }
};
