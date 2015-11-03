module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        execute: {
            bootstrap: {
                src: [
                    'stateOfTheUnion.js',
                    'matchPresidents.js'
                ]
            }
        },

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
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('bootstrap', 'execute:bootstrap');
};
