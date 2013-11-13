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
				'assets/scripts/*.js',
				'!assets/scripts/*.min.js',
			]
		},

		less: {
			dist: {
				options: {
					cleancss: true
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

	grunt.registerTask('default', ['jshint', 'uglify', 'less', 'watch']);
};
