'use strict';

module.exports = function(grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// configurable paths
	var folderConfig = {
		app: 'app',
		dist: 'prod'
	};

	grunt.initConfig({
		folder: folderConfig,
		watch: {
			compass: {
				files: ['<%= folder.app %>/assets/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass:server']
			},
			styles: {
				files: ['<%= folder.app %>/assets/styles/{,*/}*.css'],
				tasks: ['copy:styles']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= folder.app %>/*.html',
					'.tmp/assets/styles/{,*/}*.css',
					'{.tmp,<%= folder.app %>}/assets/scripts/{,*/}*.js',
					'<%= folder.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						folderConfig.app
					]
				}
			},
			dist: {
				options: {
					open: true,
					base: folderConfig.dist
				}
			}
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= folder.dist %>/*',
						'!<%= folder.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= folder.app %>/assets/scripts/{,*/}*.js',
				'!<%= folder.app %>/assets/scripts/vendor/*'
			]
		},
		compass: {
			options: {
				sassDir: '<%= folder.app %>/assets/styles',
				cssDir: '.tmp/assets/styles',
				generatedImagesDir: '.tmp/assets/images/generated',
				imagesDir: '<%= folder.app %>/assets/images',
				javascriptsDir: '<%= folder.app %>/assets/scripts',
				fontsDir: '<%= folder.app %>/assets/styles/fonts',
				importPath: '<%= folder.app %>/bower_components',
				httpImagesPath: '/assets/images',
				httpGeneratedImagesPath: '/assets/images/generated',
				httpFontsPath: '/assets/styles/fonts',
				relativeAssets: false
			},
			dist: {
				options: {
					generatedImagesDir: '<%= folder.dist %>/assets/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},
		'bower-install': {
			app: {
				html: '<%= folder.app %>/index.html',
				ignorePath: '<%= folder.app %>/'
			}
		},
		rev: {
			dist: {
				files: {
					src: [
						'<%= folder.dist %>/assets/scripts/{,*/}*.js',
						'<%= folder.dist %>/assets/styles/{,*/}*.css',
						'<%= folder.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
						'<%= folder.dist %>/assets/styles/fonts/{,*/}*.*'
					]
				}
			}
		},
		useminPrepare: {
			options: {
				dest: '<%= folder.dist %>'
			},
			html: '<%= folder.app %>/index.html'
		},
		usemin: {
			options: {
				dirs: ['<%= folder.dist %>']
			},
			html: ['<%= folder.dist %>/{,*/}*.html'],
			css: ['<%= folder.dist %>/assets/styles/{,*/}*.css']
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= folder.app %>/assets/images',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: '<%= folder.dist %>/assets/images'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= folder.app %>/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= folder.dist %>/assets/images'
				}]
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.app %>',
					dest: '<%= folder.dist %>',
					src: [
						'*.{ico,png,txt}',
						'/assets/images/{,*/}*.{webp,gif}',
						'/assets/styles/fonts/{,*/}*.*'
					]
				}]
			},
			dist: {
				expand: true,
				dot: true,
				cwd: '.tmp/assets/styles',
				dest: '.tmp/assets/styles/',
				src: '{,*/}*.css'
			}
		},
		modernizr: {
			devFile: '<%= folder.app %>/bower_components/modernizr/modernizr.js',
			outputFile: '<%= folder.dist %>/bower_components/modernizr/modernizr.js',
			files: [
				'<%= folder.dist %>/assets/scripts/{,*/}*.js',
				'<%= folder.dist %>/assets/styles/{,*/}*.css',
				'!<%= folder.dist %>/assets/scripts/vendor/*'
			],
			uglify: true
		},
		concurrent: {
			server: [
				'compass'
			],
			dist: [
				'compass',
				'copy:dist',
				'imagemin',
				'svgmin'
			]
		}
	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'modernizr',
		'copy:dist',
		'rev',
		'usemin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'build'
	]);
};