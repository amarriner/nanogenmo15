(function () {
   'use strict';
}());

var fs      = require('fs');
var tools   = require('./libs/tools');

// Check to make sure the JSON file that has the filenames for all the speeches
// is present. If not, grunt bootstrap probably needs to be run
if (! tools.exists('speeches/index.json')) {
    console.log("Missing JSON file! Run grunt bootstrap to generate...");
    return;
}

var json    = JSON.parse(fs.readFileSync('speeches/index.json'));
var words   = {};

// Loop through each president in the JSON file
for (var i = 0; i < json.length; i++) {
    var president = json[i];

    // Then, for each president, loop through their speeches
    for (var j = 0; j < president.speeches.length; j++) {
        var year = president.speeches[j];
        var filename = 'speeches/' + president.name + '/' + year + '.txt';

        // Die if missing file
        if (! tools.exists(filename)) {
            console.log('Missing speech file: ' + filename);
            break;
        }

        // Pull in the speech file stripping out the newlines and punctuation,
        // convert to lower case, and then split on spaces to get an array
        // of words
        var speech = fs.readFileSync(filename, "utf-8")
                        .toString()
                        .replace("\n", "")
                        .replace(/[\[\].,?!;()"'-]/g, "")
                        .toLowerCase()
                        .split(" ")
        ;

        // Loop through the words in the speech, counting occurrances
        console.log('Processing ' + filename + ' (' + speech.length + ')...');
        for (var k = 0; k < speech.length; k++) {
            var word = speech[k];

            // Ignore words that are all numbers
            if (/^[0-9]*$/.test(word)) {
                break;
            }

            if (! words[word]) {
                words[word] = 0;
            }

            words[word]++;
        }
    }
}

var f = fs.openSync("words.json", 'w');
fs.writeSync(f, JSON.stringify(words, null, 3), undefined, "utf-8");
fs.closeSync(f);
