'use strict';

var multer = require('multer');
var fs = require('fs');

exports.fileUpload = function(req, res) {
    var file = req.files.file,
        path = './app/uploads/rfqDocs/';
        
    console.log('Stream ended.');
};