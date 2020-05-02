const storage = require('electron-json-storage');
const { remote } = require('electron')
var path = require('path');

storage.has('settings', function (error, hasCity) {
    if (error) throw error;
    storage.has('coords', function (error, hasCoords) {
        if (error) throw error;

        if (hasCity && hasCoords) {
            remote.getCurrentWindow().loadURL(path.join(__dirname, "weather.html"))
        } else {
            remote.getCurrentWindow().loadURL(path.join(__dirname, "settings.html"))
        }
    });
});
