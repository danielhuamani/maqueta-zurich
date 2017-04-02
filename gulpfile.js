var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var swig = require('gulp-swig');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var nib = require('nib');
var historyApiFallback = require('connect-history-api-fallback');
var directorio = {

  html_dist: 'src/build/',
  html: 'src/templates/**/*.html',
  stylus: 'src/static/stylus/*.styl',
  stylus_blocks: 'src/static/stylus/**/*.styl',


};

gulp.task('stylus', function () {
  gulp.src(directorio.stylus)
    .pipe(plumber())
    .pipe(stylus({
      use: nib(),
      compress: true

      }))
    .pipe(gulp.dest('src/static/css/'))
    .pipe(connect.reload());

});
gulp.task('stylus_blocks', () => {
  return gulp.src(directorio.stylus_blocks)
    .pipe(plumber())
    .pipe(stylus({
      use: nib()
    }))
    .pipe(gulp.dest('src/static/css/'))
    .pipe(connect.reload())
});

function range (input) {
  console.log(input)
  var num = parseInt(input)
  return Array.from(Array(num).keys())
}

var opt = {
      setup: function(swig) {
        swig.setFilter('range', range);

      },
      load_json: true,
      defaults: {
        cache: false
      },
      data: {
        STATIC_URL : '/static/'
      }
    }

gulp.task('templates', function() {

  return gulp.src(directorio.html)
    .pipe(plumber())
    .pipe(swig(opt))
    .pipe(gulp.dest(directorio.html_dist))
    .pipe(connect.reload());


});
/*gulp.task('templates_blocks', function() {

  return gulp.src(directorio.jade_blocks)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
      }))
    .pipe(gulp.dest('src/templates/html'))
    .pipe(connect.reload());


});*/
gulp.task('watch', function() {

  gulp.watch('src/static/stylus/*.styl', ['stylus']),
  gulp.watch('src/templates/**/*.html', ['templates'])
  gulp.watch(directorio.stylus_blocks, ['stylus_blocks'])

});

//creacioon  del server para el livereload

gulp.task('connect', function() {
  connect.server({
    root: 'src/',
    hostname: '0.0.0.0',
    livereload: true,
    port: '3000',
    open: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback() ];
    }
  });
});
gulp.task('default', ['stylus', 'templates', 'stylus_blocks','watch', 'connect']);
//creacioon  del server para el livereload
