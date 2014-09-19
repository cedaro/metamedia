/*jshint node:true */

module.exports = function(grunt) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'assets/js/*.js',
				'!assets/js/*.min.js',
			]
		},

		less: {
			dist: {
				options: {
					cleancss: true
				},
				files: [
					{
						src: 'assets/css/less/metamedia.less',
						dest: 'assets/css/metamedia.min.css'
					},
				]
			}
		},

		makepot: {
			plugin: {
				options: {
					mainFile: 'metamedia.php',
					potHeaders: {
						poedit: true
					},
					type: 'wp-plugin'
				}
			}
		},

		uglify: {
			dist: {
				files: [
					{
						src: 'assets/js/metamedia.js',
						dest: 'assets/js/metamedia.min.js'
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
				files: ['assets/css/less/*.less'],
				tasks: ['less']
			}
		},

	});

	grunt.registerTask('default', ['jshint', 'uglify', 'less', 'watch']);
};
