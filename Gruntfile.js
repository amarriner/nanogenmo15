module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'index.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
}
