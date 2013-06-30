'use strict';

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
					config: 'config.prod.rb'
				}
			},
			dev: {
				options: {
					config: 'config.rb'
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
					'public/styles/screen.css': ['public/styles/main.css']
				}
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: {
					'public/images/cat.jpg' : 'assets/images/cat.jpg'
				}
			},
			dev: {
				options: {
					optimizationLevel: 0
				},
				files: {
					'public/images/cat.jpg' : 'assets/images/cat.jpg'
				}
			}
		},

		watch: {
			options: {
				debounceDelay: 250,
				livereload: true
			},
			css: {
				files: ['assets/styles/**/*.scss'],
				tasks: ['compass:dev']
			},
			js: {
				files: ['assets/scripts/**/*.js']
			},
			html: {
				files: ['*.html']
			}
		},

		'bower-install': {
			// Point to the html file that should be updated
			// when you run `grunt bower-install`
			html: 'index.html',

			// Optional:
			// If your scripts shouldn't contain a certain
			// portion of a url, it can be excluded
			// ignorePath: 'app/'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['bower-install', 'compass:dev']);
	grunt.registerTask('build', ['concat', 'uglify', 'compass:dist', 'cssmin', 'imagemin:dist']);
	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['concat', 'uglify', 'compass:dist', 'cssmin', 'imagemin:dev', 'watch']);
		}

		grunt.task.run([
			'bower-install',
			'compass:dev',
			'watch'
		]);
	});
};