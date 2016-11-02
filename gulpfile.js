var gulp = require("gulp");
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');


gulp.task('default', function() {
  return gulp.src(['./index.js', './src/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});
