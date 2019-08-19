var gulp = require('gulp');
var clean = require('del');
var minifyJS = require('gulp-minify');
var minifyHTML = require('gulp-htmlmin');
var minifyIMG = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');

gulp.task('cleanDest', function() {
	return clean(['built/**/*']);
});

gulp.task('minifyHTML', function() {
	return gulp.src(['view/*.html'])
		.pipe(minifyHTML({collapseWhitespace: true}))
		.pipe(gulp.dest('built/view'));
});

gulp.task('minifyIndex', function() {
	return gulp.src(['index.html'])
		.pipe(minifyHTML({collapseWhitespace: true}))
		.pipe(gulp.dest('built/'));
});


gulp.task('minifyCSS', function(){
	return gulp.src(['styles/*.css'])
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('built/styles'));
});

gulp.task('copyRobots', function() {
	return gulp.src(['robots.txt'])
		.pipe(gulp.dest('built/'));
});

gulp.task('minifyJS', function() {
	return gulp.src(['scripts/**/*.js', 'scripts/**/*.map'])
		.pipe(minifyJS({
			ext: {
				src:'.js',
				min: '.js'
			}
		}))
		.pipe(gulp.dest('built/scripts/'));
});

gulp.task('importEngine', function () {
	return gulp.src('../engine/*.js')
		.pipe(minifyJS({
			ext: {
				src: '.js',
				min: '.js'
			}
		}))
		.pipe(gulp.dest('built/scripts/engine'));
});

gulp.task('minifyIMG', function() {
	return gulp.src(['images/**/*.*', '*.ico'])
		.pipe(minifyIMG())
		.pipe(gulp.dest('built/images/'));

});

gulp.task('mini-copy', gulp.parallel('importEngine', 'minifyHTML', 'minifyJS', 'minifyCSS', 'minifyIndex', 'minifyIMG', 'copyRobots'));

gulp.task('build', gulp.series('cleanDest', 'mini-copy', function(done){
	done();
}));