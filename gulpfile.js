var gulp = require("gulp");
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var size = require('gulp-size');
var header = require("gulp-header");
var include = require('gulp-include');
var comment = '\/*\r\n* Spark v0.1.2\r\n* Copyright 2016, Kabir Shah\r\n* https:\/\/github.com\/KingPixil\/\/\r\n* Free to use under the MIT license.\r\n* https:\/\/kingpixil.github.io\/license\r\n*\/\r\n';


gulp.task('build', function() {
  return gulp.src(['./src/index.js'])
    .pipe(include())
    .pipe(concat('spark.js'))
    .pipe(header(comment))
    .pipe(size())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
  return gulp.src('./dist/spark.js')
    .pipe(uglify())
    .pipe(concat('spark.min.js'))
    .pipe(header(comment))
    .pipe(size())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build', 'minify']);
