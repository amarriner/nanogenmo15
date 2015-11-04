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

var json                = JSON.parse(fs.readFileSync('speeches/index.json'));
var words               = {};
var totalSpeechWords    = 0;

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
        totalSpeechWords += speech.length;
        for (var k = 0; k < speech.length; k++) {
            var word = speech[k].trim();

            // Ignore words that are all numbers
            if (/^[0-9]*$/.test(word)) {
                continue;
            }

            if (! words[word]) {
                words[word] = 0;
            }

            words[word]++;
        }
    }
}

// Run through the words object and push each property into an array. Would've
// like to have done this in the words loop above, but trying to find the
// property in an array was very expensive and made the script just run for
// far too long so we're doing it now.
var totalWords = 0;
var uniqueWords = 0;
var wordArray = [];
for (var k in Object.keys(words)) {
    var key = Object.keys(words)[k];

    if (!isNaN(words[key])) {
        wordArray.push({ "word": key, "count": words[key]});
        totalWords += parseInt(words[key]);
        uniqueWords++;
    }
}

// Then sorting the array by the count of words in descending order
wordArray.sort(function (a, b) {
    a = a.count;
    b = b.count;

    return a > b ? -1 : ( a < b ? 1 : 0);
});

// And finally writing the results to a JSON file
var f = fs.openSync("words.json", 'w');
fs.writeSync(f, JSON.stringify(wordArray, null, 3), undefined, "utf-8");
fs.closeSync(f);

console.log('----------------------------------------------------------------');
console.log('                      C O M P L E T E');
console.log('----------------------------------------------------------------');
console.log('Words found in Speeches    : ' + totalSpeechWords);
console.log('Words in JSON file         : ' + totalWords);
console.log('Unique words               : ' + uniqueWords);
console.log('----------------------------------------------------------------');
