var gulp = require('gulp');
var concat = require('gulp-concat');
var cssconcat = require('gulp-concat-css');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');

var production = process.env.NODE_ENV === 'production';

gulp.task('set-production', function () {
	return production = 'development';
});

/// Bundle Libraries
gulp.task('vendor', function () {
	return gulp.src([
		"node_modules/bootstrap/dist/js/bootstrap.min.js",
		"node_modules/angular/angular.min.js",
		"node_modules/angular-cookies/angular-cookies.min.js",
		"node_modules/angular-ui-router/release/angular-ui-router.min.js",
		"node_modules/angular-sanitize/angular-sanitize.min.js",
		"node_modules/angular-markdown-directive/markdown.js",
		"node_modules/angular-scroll/angular-scroll.min.js",
		"node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
		"node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"
	]).pipe(concat('vendor.js'))
		.pipe(gulpif(production, uglify({ mangle: false })))
		.pipe(gulp.dest('app/build'));
})

// /// Bundle CSS Libraries
// gulp.task('css-vendor', function () {
// 	return gulp.src([
// 	]).pipe(cssconcat('vendor.css'))
// 		.pipe(gulpif(production, cssmin()))
// 		.pipe(gulp.dest('app/build'));
// });

// Static Server + watching scss/html files
gulp.task('serve', ['styles', 'scripts'], function () {

	browserSync.init({
		server: "./app"
	});

	gulp.watch('./app/scss/**/*.scss', ['styles']);
	gulp.watch('./app/js/**/*.js', ['scripts']);
	gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

gulp.task('scripts', function () {
	var pipe = gulp.src([
		'app/js/utils/**/*.js',
		production ? 'app/js/config.production.js' : 'app/js/config.js',
		'app/js/activation.js',
		'app/js/resetPassword.js',
		'app/js/app.js',
		'app/js/controllers/**/*.js',
		'app/js/directives/**/*.js',
		'app/js/filters/**/*.js',
		'app/js/services/**/*.js',
		'app/js/directives/**/*.js'
	]);

	if (production) {
		pipe = pipe.pipe(babel({
			presets: ['env']
		}));
	} else {
		// pipe = pipe.pipe(babel({
		// 	presets: ['env']
		// }));
	}


	pipe = pipe.pipe(concat('main.js'))
		.pipe(gulpif(production, uglify({ mangle: false })))
		.pipe(gulp.dest('./app/build'));

	return pipe;
});

gulp.task('styles', function () {
	return gulp.src('app/scss/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(production, cssmin()))
		.pipe(gulp.dest('app/build'));
})


gulp.task('default', ['vendor', 'styles', 'scripts', 'serve']);
gulp.task('build:prod', ['set-production', 'vendor', 'styles', 'scripts']);
