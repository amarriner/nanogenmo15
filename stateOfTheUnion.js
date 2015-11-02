(function () {
   'use strict';
}());

// All of the State of the Union speeches are retrieved from here:
//    http://www.presidency.ucsb.edu/sou.php
//
// Run `npm run bootstrap` to retrieve them

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var allPresidents = [];

function President(name) {
    this.name = name;
    this.speeches = [];
}

// Wrapper to fs.stat to check if a file exists
function exists(path) {
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
}

// Makes a directory or directories depending on the path. Splits the path
// parameter into individual directories and adds each in order.
function mkdir(path) {
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

// This finds the table rows that actually have the state of the union
// links in them. Unfortunately there aren't any IDs or classes that
// make this easier so if the structure of that page ever changes,
// this will almost certainly break.
function parseLinks(data) {
    var lastPres;
    var pres;
    var $ = cheerio.load(data);

    $('table tr:nth-of-type(2) td table tr td:nth-of-type(2) table:nth-of-type(2) > tr').each(function(i, tr) {

        if (i > 0) {
            $(tr).children('td').each(function(j, td) {

                // Table rows with a width of 180 are Either a president's
                // name, or the next row of a given president.
                if ($(td).attr('width') == "180") {

                    // If the text doesn't include an image file in the
                    // cell then it's a president's name
                    if (! /^</.test($(td).html())) {
                        if (lastPres) {
                            var ndx = allPresidents.map(function(e) { return e.name; }).indexOf(lastPres);
                            if (ndx >= 0) {
                                console.log('found');
                                allPresidents[ndx].speeches.concat(pres.speeches);
                            }
                            else {
                                allPresidents.push(pres);
                            }
                        }

                        lastPres = $(td).text();
                        pres = new President(lastPres);
                    }
                }

                // If we're not in a cell that contains a president's name
                // check to see if there's a link in the cell and see if its
                // text matches a regex for a year (four digits). If so,
                // keep track of it.
                else {
                    var link = $(td).find('a');
                    if (link                                            &&
                            $(link).text()                              &&
                            /[0-9][0-9][0-9][0-9]/.test($(link).text()) &&
                            !/#/.test($(link).attr('href'))) {
                        parseSpeech($(link).text(), $(link).attr('href'), lastPres);
                        pres.speeches.push($(link).text());
                    }
                }

            });
        }
    });

    allPresidents.push(pres);

    mkdir("speeches");
    f = fs.openSync("speeches/index.json", 'w');
    fs.writeSync(f, JSON.stringify(allPresidents));
    fs.closeSync(f);
}

// Extracts speech text from the appropriate URL
function parseSpeech(year, url, name) {
    var filename = "speeches/" + name + "/" + year + ".txt";

    if (exists(filename)) {
        return;
    }

    mkdir("speeches/" + name);

    request(url,
        function(err, response, data) {
            var $ = cheerio.load(data);
            var f = fs.openSync(filename, 'w');

            fs.writeSync(f, $('span.displaytext').text());
            fs.closeSync(f);
        }
    );
}

// Main entry point
request('http://www.presidency.ucsb.edu/sou.php',
    function (err, response, data) {
        if (err) {
            console.log(err);
            return;
        }

        parseLinks(data);
    }
);
