"use strict"

const Fs   = require('fs');
const Path = require('path');

module.exports = (robot) => {
    const path = Path.resolve(__dirname, 'src/scripts');
    Fs.exists(path, (exists) => {
        exists && Fs.readdirSync(path).forEach((f) => robot.loadFile(path, f));
    });
}
