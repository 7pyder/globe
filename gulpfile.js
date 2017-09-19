const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const jsFiles = [
	"src/js/webvr-polyfill.js",
	"src/js/three.js",
	"src/js/VRControls.js",
	"src/js/VREffect.js",
	"src/js/ray.js",
	"src/js/screenfull.js",
	"src/js/main.js"
];

gulp.task('default', function () {
	gulp.src(jsFiles)
		.pipe(sourcemaps.init())
		// .pipe(babel({
		// 	presets: ['env']
		// }))
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build'))
});