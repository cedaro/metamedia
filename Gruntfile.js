'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				bitwise: true,
				browser: true,
				curly: false,
				eqeqeq: true,
				eqnull: true,
				es5: true,
				esnext: true,
				immed: true,
				jquery: true,
				latedef: true,
				newcap: true,
				noarg: true,
				node: true,
				smarttabs: true,
				strict: false,
				trailing: true,
				undef: true,
				globals: {
					metamedia: true,
					metamediaL10n: true,
					wp: true
				}
			},
			all: [
				'Gruntfile.js',
				'assets/scripts/*.js',
				'!assets/scripts/*.min.js',
			]
		},

		less: {
			dist: {
				options: {
					yuicompress: true
				},
				files: [
					{
						src: 'assets/styles/less/metamedia.less',
						dest: 'assets/styles/metamedia.min.css'
					},
				]
			}
		},

		uglify: {
			dist: {
				files: [
					{
						src: 'assets/scripts/metamedia.js',
						dest: 'assets/scripts/metamedia.min.js'
					}
				]
			}
		},

		watch: {
			js: {
				files: ['<%= jshint.all %>'],
				tasks: ['jshint', 'uglify']
			},
			less: {
				files: ['assets/styles/less/*.less'],
				tasks: ['less']
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'jshint',
		'less',
		'uglify',
		'watch'
	]);

};