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
        },

        jsonlint: {
            all: {
                src: [
                    'package.json',
                    'speeches/index.json',
                    'words.json'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.registerTask('analyze', ['jshint', 'execute:analyze']);
    grunt.registerTask('bootstrap', ['execute:bootstrap']);
};
