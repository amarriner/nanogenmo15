var govTrack = require('govtrack-node');

govTrack.findRole({current: true }, function(err, res) {
    if(! err) {
        console.log(JSON.stringify(res));
    }
});
