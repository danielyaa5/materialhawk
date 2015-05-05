'use strict';

var fs = require('fs');

exports.rfqFiles = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var stream = fs.createWriteStream(__dirname + '/../uploads/rfqFiles/' + filename);
        file.pipe(stream);
        stream.on('close', function() {
            console.log('File ' + filename + ' is uploaded');
            res.json({
                filename: filename
            });
        });
    });
};
