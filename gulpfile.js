var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var nodemon = require('gulp-nodemon');

var paths = {
  babel: ['src_babel/**/*.js']
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('babel', ['clean'], function () {
  return gulp.src(paths.babel)
    .pipe(babel({ optional: ["bluebirdCoroutines", "runtime"], stage: 1 }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
  nodemon({
    script: 'server.js',
    ignore: [
      "public",
      "node_modules"
    ],
    execMap: {
      "js": "node --harmony"
    }
  })
})

gulp.task('default', ['clean', 'babel', 'watch']);