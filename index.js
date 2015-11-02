(function () {
   'use strict';
}());

var govTrack = require('govtrack-node');

govTrack.findRole({current: true }, function(err, res) {
    if(! err) {
        // console.log(JSON.stringify(res));
    }
});

govTrack.findPerson({},
    function(err, res) {
        if (! err) {
            for (var i in res.objects) {

                var person = res.objects[i];

                console.log(JSON.stringify(person).substring(0, 100));

                if (person.twitterid !== null) {
                    console.log(person.twitterid);
                }
                console.log('------------------------------------------------');
            }
        }
    }
);
