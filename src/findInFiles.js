'use strict';

var find = require('find'),
    fs = require('fs'),
    Q = require('q');

function readFile(filename) {
    return Q.nfcall(fs.readFile, filename, 'utf-8');
}

function searchFile(data) {
    return function(content) {
        var match = content.match(data.regex);
        return {
            filename: data.filename,
            match: match
        };
    };
}

exports.find = function(pattern, directory, fileFilter) {
    console.log('searching', pattern);
    var regex = new RegExp(pattern, 'g'),
        matchedFiles = [],
        results = [],
        deferred = Q.defer();
    if (typeof fileFilter === 'string') {
        fileFilter = new RegExp(fileFilter);
    } else if (typeof fileFilter === 'undefined') {
        fileFilter = new RegExp('.*');
    }

    find.file(fileFilter, directory, function(files) {

        for (var i = files.length - 1; i >= 0; i--) {
            var fileName = files[i];
            if (!fileName.startsWith("node_modules") && !fileName.startsWith("lib")) {

                console.log(fileName);
                matchedFiles.push(readFile(fileName)
                    .then(searchFile({
                        regex: regex,
                        filename: fileName
                    })));
            }
        }

        Q.allSettled(matchedFiles)
            .then(function(content) {
                console.log(content);
                for (var i = 0; i < content.length; i++) {
                    var fileMatch = content[i].value;
                    if (fileMatch.match !== null) {
                        results[fileMatch.filename] = {
                            matches: fileMatch.match,
                            count: fileMatch.match.length
                        };
                    }
                }
                deferred.resolve(results);
            });
    });
    return deferred.promise;
};
