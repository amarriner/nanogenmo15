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
            },

            markov: {
                src: ['markov.js']
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-jsonlint');

    grunt.registerTask('analyze', ['jshint', 'execute:analyze']);
    grunt.registerTask('bootstrap', ['execute:bootstrap']);
    grunt.registerTask('markov', ['jshint', 'execute:markov']);
};
