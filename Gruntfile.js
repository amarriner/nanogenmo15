module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: ["words.json", "speeches"],

        execute: {
            analyze: {
                src: ['analyze.js']
            },

            bootstrap: {
                src: [
                    'stateOfTheUnion.js',
                    'matchPresidents.js'
                ]
            },

            markov: {
                src: ['markov.js']
            }
        },

        if: {
            clean: {
                options: {
                    test: function() { return clean; }
                },
                ifTrue: [ 'clean' ]
            }
        },

        jshint: {
            options: {
                'devel': true
            },
            files: {
                src: [
                    '*.js',
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

    var clean = grunt.option('clean') || false;

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-if');
    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.registerTask('analyze', ['jshint', 'execute:analyze']);
    grunt.registerTask('bootstrap', ['if:clean', 'execute:bootstrap']);
    grunt.registerTask('markov', ['jshint', 'execute:markov']);
};
