var gulp = require('gulp');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('server',function(){
	connect.server({
		root:'./app',
		port: 3000,
		hostname: '0.0.0.0',
		livereload: true
	});
});

gulp.task('html',function(){
	gulp.src('./app/*.html')
	.pipe(connect.reload());
});

//nib, añade de forma automatica las propiedades css para firefox, iE, webkit
gulp.task('stylus',function(){
	gulp.src('./app/styles/*.styl')
	.pipe(stylus({ use:nib() }))
	.pipe(gulp.dest('./app/styles/'))
	.pipe(connect.reload());
})

gulp.task('watch',function(){
	gulp.watch(['./app/**/*.html'],['html']);
	gulp.watch('./app/styles/*.styl',['stylus']);
});

gulp.task('default',['server','watch']);
