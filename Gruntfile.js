module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                'devel': true
            },
            files: {
                src: ['Gruntfile.js', 'index.js', 'matchPresidents.js', 'stateOfTheUnion.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
