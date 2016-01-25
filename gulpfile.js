'use strict'

var gulp = require('gulp');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var stylus = require('gulp-stylus');
var nib = require('nib');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

gulp.task('server',function(){
	connect.server({
		root:'./app',
		port: 3000,
		hostname: '0.0.0.0',
		middleware: function(connect, opt){
			return [historyApiFallback()]
		},
		livereload: true
	});
});

gulp.task('html',function(){
	gulp.src('./app/**/*.html')
	.pipe(connect.reload());
});

//nib, añade de forma automatica las propiedades css para firefox, iE, webkit
gulp.task('stylus',function(){
	gulp.src('./app/styles/*.styl')
	.pipe(stylus({ use:nib() }))
	.pipe(gulp.dest('./app/styles/'))
	.pipe(connect.reload());
});

gulp.task('jshint',function(){
	return gulp.src('./app/js/**/*.js')
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

// Inyecta en el index.html todos los archivos js y css
gulp.task('inject', function(){
	var sources = gulp.src(['./app/js/**/*.js','./app/styles/*.css']);
	gulp.src('index.html', {cwd: './app'})
	.pipe(inject(sources, {
		read: false,
		ignorePath: '/app'
	}))
	.pipe(gulp.dest('./app'));
});

// Inyecta las librerias instaladas via bower
gulp.task('bower',function(){
	gulp.src('./app/index.html')
    .pipe(wiredep({
    	directory: './app/lib'
    }))
	.pipe(gulp.dest('./app'));
});

gulp.task('watch',function(){
	gulp.watch(['./app/**/*.html'],['html']);
	gulp.watch(['./app/styles/*.styl'],['stylus','inject']);
	gulp.watch(['./app/js/*.js','./gulpfile.js'],['jshint','inject']);
	gulp.watch(['./bower.json'],['bower']);
});

gulp.task('default',['server','inject','bower','watch']);
