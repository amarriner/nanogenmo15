(function () {
   'use strict';
}());

var fs          = require('fs');
var MarkovChain = require('markovchain').MarkovChain;
var tools       = require('./libs/tools');

// Check to make sure the JSON file that has the filenames for all the speeches
// is present. If not, grunt bootstrap probably needs to be run
if (! tools.exists('speeches/index.json')) {
    console.log("Missing JSON file! Run grunt bootstrap to generate...");
    return;
}

// Load the JSON file, then find a random President within it, and a random
// speech within that President
var json            = JSON.parse(fs.readFileSync('speeches/index.json'));
var randomPresident = json[Math.floor(Math.random() * json.length)];

// Get the speeches array with the correct file paths
var years           = randomPresident.speeches.map(function(e) {
    return 'speeches/' + randomPresident.name + '/' + e + '.txt';
});

// Generate Markov chain using npm module
var speech = new MarkovChain({files: years });
console.log(randomPresident.name);
speech.start('The').end(50).process(function(err, s) {
    console.log(s);
});
