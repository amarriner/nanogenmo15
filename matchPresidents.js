(function () {
   'use strict';
}());

var fs          = require('fs');
var govTrack    = require('govtrack-node');

// Get all "President" roles from govtrack and loop through them trying to get
// the govtrack ID for the presidents in the speeches/index.json file.
//
// If the speeches/index.json file doesn't exist, run:
//   npm run bootstrap
govTrack.findRole({role_type: "president", sort: "enddate"},
    function(err, res) {
        if (err) {
            console.log(err);
        }

        // Read the JSON file from disk and parse to a JS object
        var json = JSON.parse(fs.readFileSync("speeches/index.json"));

        // Loop through govtrack results
        for (var i in res.objects) {
            var matched = null;
            var matches = [];
            var role = res.objects[i];

            // Loop through the speeches/index.json file trying to find the
            // matching president
            for (var j in json) {
                var pres = json[j];

                // To match, we'll look at both firstname/lastname combinations
                // as well as nickname/lastname combinations. The only one that
                // really requires the nickname/lastname combo is Jimmy Carter.
                // Still, better to be thorough.
                var matchedName = false;
                var names = [role.person.firstname];

                if (role.person.nickname) {
                    names.push(role.person.nickname);
                }

                for (var k in names) {
                    var re = new RegExp("^" + names[k] + ".*" + role.person.lastname + "$");

                    if (pres.name.match(re) && !matchedName) {
                        matchedName = true;
                        matched = {"id": role.person.id, "index": j};
                        matches.push({"index": j, "object": pres});
                    }
                }
            }

            // If there were multiple matches for a given govtrack president,
            // use the president's start and end dates to find the correct one
            // from the JSON file
            if (matches.length > 1) {
                matched = null;
                for (var m in matches) {
                    var match = matches[m].object;
                    if (match.speeches[0] <= role.enddate.substring(0,4) &&
                        match.speeches[0] >= role.startdate.substring(0,4)) {
                        matched = {"id": role.person.id, "index": matches[m].index};
                    }
                }
            }

            // For some reason, we couldn't find the correct President to match.
            if (! matched) {
                console.log("Could not match " + role.person.name);
            }

            // Otherwise, update the JSON object with the govtrack ID.
            else {
                json[matched.index].id = matched.id;
            }
        }

        // Run through the JSON file to make sure each president has an ID
        for (i in json) {
            if (!json[i].id) {
                console.log(json[i].name + " does not have a govtrack ID!");
            }
        }

        // Overrite the JSON file with the updated version.
        var f = fs.openSync("speeches/index.json", 'w');
        fs.writeSync(f, JSON.stringify(json, null, 3));
        fs.closeSync(f);
    }
);
