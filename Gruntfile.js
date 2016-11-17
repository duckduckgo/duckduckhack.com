
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var static_dir = 'root/static/';
    var templates_dir = 'src/templates/';
    var js_dir = 'src/js';

    // Libraries that we need.
    var moment = 'bower_components/moment/min/moment.min.js';

    var build_tasks = [
        'exec:bower',
        'exec:deleteBuildFiles',
        'handlebars:compile',
	    'concat:js',
        'concat:libs_build',
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        static_dir: static_dir,
        templates_dir: templates_dir,

        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: ['sass', 'diff'],
                    groups: {
                        'Commit:' : ['exec:commit_static'],
                        'Revert:' : ['exec:revert']
                    }
                }
            }
        },

        /*
         * concat js files in issues_dir and copy to static_dir
         */
        concat: {
            js: {
                src: [templates_dir + 'handlebars_tmp', js_dir + 'issues.js'],
                dest: static_dir + 'js/issues.js'
            },
	        libs_build: {
		        src: [static_dir + 'js/issues.js', moment],
		        dest: static_dir + 'js/moment.js'
	        },
        },

        /*
         * Compiles handlebar templates and add to Handlebars.templates namespace
         */
        handlebars: {
            compile: {
                options: {
                    namespace: "Handlebars.templates",
                    processName: function(filepath) {
                        var parts = filepath.split('/');
                        return parts[parts.length - 1].replace('.handlebars','');
                    }
                },
                files: {
                    '<%= templates_dir %>/handlebars_tmp' : '<%= templates_dir %>/*.handlebars'
                }
            }
        },


        /*
         * Removes dev versions of JS and CSS files
         */
        remove: {
            dev: {
                trace: true,
                fileList: [
                    templates_dir + 'handlebars_tmp',
                    static_dir + 'js/issues.js',
                ]
            }
        },

	gitrm: {
            old_releases: {
                options: { 
                    force: 'true'
                },
                files: {
                    src: [
                        static_dir + 'js/issues.js',
                    ]
                }
            }
        },


        /*
         * Removes console.log
         */
        removelogging: {
            dist: {
                src: static_dir + 'js/issues.js'
            }
        },
        

        exec: {
            revert: "./script/revert_pkg_version.pl",
            revert_release: "./script/revert_pkg_version.pl release",
            deleteBuildFiles: "mkdir -p build && rm -r build",
            bower: "bower install",
	        commit_static: "git add root/static/* package.json && git commit -m 'Release DDH version: <%= pkg.version %>'",
        },

        /*
         * Bumps the version number in package.json
         */
        bump: {
            options: {
                files: ['package.json'],
                commit: false,
                createTag: false,
                push: false,
            }
        },

    });

    grunt.registerTask('build', 'Compiles templates, builds JS and CSS files.', build_tasks);
    grunt.registerTask('default', build_tasks);
}
