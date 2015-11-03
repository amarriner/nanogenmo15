module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        execute: {
            analyze: {
                src: ['analyze.js']
            },

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
                src: [
                    'Gruntfile.js',
                    'index.js',
                    'matchPresidents.js',
                    'stateOfTheUnion.js',
                    'analyze.js',
                    'libs/*'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('analyze', ['jshint', 'execute:analyze']);
    grunt.registerTask('bootstrap', ['execute:bootstrap']);
};
