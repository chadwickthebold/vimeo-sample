var gulp = require('gulp'),
		connect = require('gulp-connect'),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat'),
		jshint = require('gulp-jshint'),
		sass = require('gulp-sass'),
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		del = require('del'),
		runSequence = require('run-sequence'),
		ghpages = require('gulp-gh-pages'),
		debug = require('gulp-debug');


var paths = {
	src : {
		root : 'src',
		scripts : 'src/js/*.js',
		html : 'src/*.html',
		styles : 'src/sass/*.scss',
		style_root: 'src/sass/base.scss'
	},
	build : {
		root : 'dist',
		scripts : 'dist/js',
		styles : 'dist/css'
	},
	deploy : './dist/**/*'
}


gulp.task('lint', function() {
	return gulp.src(paths.src.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('clean', function() {
	del(paths.build.root);
});


gulp.task('build:scripts', ['lint'], function() {
	return gulp.src(paths.src.scripts)
//		.pipe(sourcemaps.init())
//		.pipe(concat('app.js'))
//		.pipe(gulp.dest(paths.build.scripts))
//		.pipe(rename('app.min.js'))
//		.pipe(uglify())
//		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.build.scripts));
});


gulp.task('build:sass', function() {
	return gulp.src(paths.src.style_root)
		.pipe(sass())
		.pipe(gulp.dest(paths.build.styles));
});


gulp.task('build:static', function() {
	return gulp.src(paths.src.html)
		.pipe(gulp.dest(paths.build.root));
})


gulp.task('build', ['build:scripts','build:sass', 'build:static']);


gulp.task('serve', function() {
	connect.server({
		root : paths.build.root,
		port: 7878
	})
});


gulp.task('watch', function() {
	gulp.watch(paths.src.scripts, ['build:scripts']);
	gulp.watch(paths.src.styles, ['build:sass']);
	gulp.watch(paths.src.html, ['build:static']);
});


gulp.task('deploy', function() {
	return gulp.src(paths.deploy)
		.pipe(debug())
		.pipe(ghpages());
});


gulp.task('default', function(callback) {
	runSequence('clean', 'build', 'serve', 'watch', callback);
});