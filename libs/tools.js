(function () {
   'use strict';
}());

var fs = require('fs');

module.exports = {
    // Wrapper to fs.stat to check if a file exists
    exists: function exists(path) {
        var ret = true;

        try {
            var stats = fs.statSync(path);
        }
        catch (e) {
            if (e.errno == 34) {
                ret = false;
            }
        }

        return ret;
    },

    // Makes a directory or directories depending on the path. Splits the path
    // parameter into individual directories and adds each in order.
    mkdir: function mkdir(path) {
        for (var i = 0; i < path.split('/').length; i++) {
            var dir = path.split('/').slice(0, i + 1).join('/');
            try {
                var stats = fs.statSync(dir);
            }
            catch (e) {
                if (e.errno == 34) {
                    fs.mkdirSync(dir);
                }
            }
        }
    }
};
