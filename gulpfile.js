var gulp = require("gulp");
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var size = require('gulp-size');


gulp.task('build', function() {
  return gulp.src(['./index.js', './src/*.js'])
    .pipe(concat('spark.js'))
    .pipe(size())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
  return gulp.src('./dist/spark.js')
    .pipe(concat('spark.min.js'))
    .pipe(size())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build', 'minify']);
