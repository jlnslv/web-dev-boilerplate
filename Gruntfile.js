'use strict';

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
	return connect.static(path.resolve(point));
};

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';'
			},
			plugins: {
				// the files to concatenate
				src: ['components/jquery/jquery.js'],
				// the location of the resulting JS file
				dest: 'public/scripts/plugins.js'
			},

			main: {
				src: ['assets/scripts/core.js'],
				dest: 'public/scripts/main.js'
			},

			app: {
				src: ['assets/scripts/plugins.js', 'assets/scripts/main.js'],
				dest: 'public/scripts/app.js'
			}
		},

		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '/*! <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				report: 'gzip'
			},
			dist: {
				options: {
					sourceMap: 'public/scripts/source-map.js'
				},
				files: {
					'public/scripts/modernizr.js': ['components/modernizr/modernizr.js'],
					'public/scripts/app.min.js': ['<%= concat.app.dest %>']
				}
			}
		},

		compass: {
			dist: {
				options: {
					sassDir: 'assests/styles',
					cssDir: 'public/styles',
					environment: 'production'
				}
			},
			dev: {
				options: {
					sassDir: 'assests/styles',
					cssDir: 'public/styles'
				}
			}
		},

		cssmin: {
			minify: {
				options: {
					banner: '/* My minified css file */',
					report: 'gzip'
				},
				files: {
					'public/styles/main.css': ['public/styles/screen.css']
				}
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: {
					'dist/img.png': 'src/img.png',
					'dist/img.jpg': 'src/img.jpg'
				}
			},
			dev: {
				options: {
					optimizationLevel: 0
				},
				files: {
					'dev/img.png': 'src/img.png',
					'dev/img.jpg': 'src/img.jpg'
				}
			}
		},

		livereload: {
			port: 35729 // Default livereload listening port.
		},

		connect: {
			livereload: {
				options: {
					port: 9001,
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, options.base)];
					}
				}
			}
		},

		// Configuration to be run (and then tested)
		regarde: {
			txt: {
				files: '**/*.txt',
				tasks: ['livereload']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-livereload');

	grunt.registerTask('default', ['concat']);
	grunt.registerTask('build', ['concat', 'uglify', 'compass', 'cssmin', 'imagemin']);
	grunt.registerTask('livereload', ['livereload-start', 'connect', 'regarde']);
};