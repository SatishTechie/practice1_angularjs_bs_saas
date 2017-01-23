module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './src',
                    cleanBowerDir: true
                }
            }
        },
        exec: {
            buildUI: {
                command: 'chmod 755 ./src/util/buildscripts/build.sh && chmod 755 ./build.sh && ./build.sh'
            }
        },
        replace: {
            replaceHtmlCacheTag: {
                src: ['./index.html', './cache.manifest', './dist/app/app.js', './dist/app/main.js'],
                dest: ['../'], // overwrite matched source files
                replacements: [{
                        from: /\$\{timestamp\}/g,
                        to: "<%= grunt.template.today('ddmmyyyyhMMss') %>"
                    }]
            }

        },
        clean: {
            js: ["./dist/dojox/*", "./dist/app/*", "!./dist/app/nls", "!./dist/app/resources",
                "!./dist/app/app.js", "!./dist/app/main.js", "./dist/dojo/*", "!./dist/dojo/resources",
                "!./dist/dojo/cldr", "!./dist/dojo/dojo.js", "./dist/dijit/*", "!./dist/dijit/icons",
                "!./dist/dijit/themes", "./src/dojo","./src/dijit", "./src/util","./node_modules"]
        },
        'string-replace': {
            dist: {
                files: [{
                        expand: true,
                        cwd: './dist/',
                        src: '**/*.js',
                        dest: './dist/'
                    }],
                options: {
                    replacements: [
                        {
                            pattern: '//>>built',
                            replacement: ''
                        },
                        {
                            pattern: '//# sourceMappingURL=main.js.map',
                            replacement: ''
                        },
                        {
                            pattern: '//# sourceMappingURL=app.js.map',
                            replacement: ''
                        },
                        {
                            pattern: '//# sourceMappingURL=dojo.js.map',
                            replacement: ''
                        },
                        {
                            pattern: '//# sourceMappingURL=load-css.js.map',
                            replacement: ''
                        }
                    ]
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    grunt.registerTask('default', ['bower','exec', 'replace', 'clean' ,'string-replace']);
    //grunt.registerTask('rep', ['srep']);
};
