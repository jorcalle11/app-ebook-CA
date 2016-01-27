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
var templateCache = require('gulp-angular-templatecache');
var gulpif = require('gulp-if');
var uncss =require('gulp-uncss');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task('server',function(){
	connect.server({
		root:'./app',
		port: 3000,
		hostname: '0.0.0.0',
		livereload: true,
		middleware: function(connect, opt){
			return [historyApiFallback()]
		}
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

// production
gulp.task('templates', function(){
	var options = {
		root: 'views/',
	    moduleName: 'templates',
		standalone: true
	}

	gulp.src('./app/views/**/*.html')
	.pipe(templateCache(options))
	.pipe(gulp.dest('./app/js'));
});

gulp.task('compress', function(){
	gulp.src('./app/index.html')
	.pipe(useref())
	.pipe(gulpif('*.js', uglify({ mangle:false })))
	.pipe(gulpif('*.css', minifyCss()))
	.pipe(gulp.dest('./dist'));
});

gulp.task('copy', function(){
	gulp.src('./app/index.html')
	.pipe(useref())
	.pipe(gulp.dest('./dist'));
	gulp.src('./app/lib/font-awesome/fonts/**')
	.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('serve-dist',function(){
	connect.server({
		root:'./dist',
		port: 9000,
		hostname: '0.0.0.0',
		livereload: true,
		middleware: function(connect, opt){
			return [historyApiFallback()]
		}
	})
});

gulp.task('build', ['compress','copy']);

gulp.task('default',['server','inject','bower','watch']);
