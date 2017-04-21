var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var swig = require('gulp-swig');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var nib = require('nib');
var directorio = {
  html_dist: 'src/build/',
  css_dist: 'src/static/css/build/',
  css_dist_files: 'src/static/css/build/**/*.css',
  css: 'src/static/css/',
  html: 'src/templates/**/*.html',
  stylus: 'src/static/stylus/*.styl',
  stylus_blocks: ['src/static/stylus/**/*.styl', '!src/static/stylus/base/variables.styl'],
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
var glob_time_offset = 5128;

function makeid(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 8; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function StartsWith(s1, s2) {
  return (s1.length >= s2.length && s1.substr(0, s2.length) == s2);
}

gulp.task('stylus_blocks', () => {
  return gulp.src(directorio.stylus_blocks)
    .pipe(plumber())
    .pipe(stylus({
      use: nib(),
      compress: false,
      import: ['nib','../base/variables']
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(directorio.css_dist))
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
        STATIC_URL : '/static/',
        make_id : makeid()
      }
    }

gulp.task('templates', function() {
  return gulp.src(directorio.html)
    //.pipe(plumber())
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

gulp.task('concat_css', function () {
  setTimeout(function () {
    return gulp.src(directorio.css_dist_files)
    //.pipe(plumber())
    .pipe(concat('main.css'))
    //.pipe(plumber.stop())
    .pipe(gulp.dest(directorio.css)).on('end', function(){
        console.log('>>>>>>>>>> Empaquetado de css Completado ...');
      })
    .pipe(connect.reload());
  }, glob_time_offset);
  glob_time_offset = 369;
});

function styl_com_con(file){
  if (StartsWith(file.path,"/")){
    file_name = file.path.split('/')[file.path.split('/').length - 1];
  }else{
    file_name = file.path.split('\\')[file.path.split('\\').length - 1];
  }
  console.log('>>>>>>>>>> Compiling '+file_name+' : running tasks...');
  gulp.src(file.path)
  .pipe(plumber())
  .pipe(stylus({ use: nib(),  import: ['nib','../base/variables']}))
  .pipe(plumber.stop())
  .pipe(gulp.dest(file.path.replace('stylus','css/build')))
  console.log('>>>>>>>>>> Compiled! '+file_name);
}

//creacioon  del server para el livereload
gulp.task('connect', function() {
  connect.server({
    root: 'src/',
    hostname: '0.0.0.0',
    livereload: true,
    port: '3000',
    open: true
  });
});

gulp.task('watch', function() {
  //gulp.watch('src/static/stylus/*.styl', ['stylus'])
  gulp.watch(directorio.stylus_blocks, ['concat_css']).on('change', function(file) {return styl_com_con(file);});
  gulp.watch('src/templates/**/*.html', ['templates']);
  //gulp.watch(directorio.stylus_blocks, ['stylus_blocks']);
});

gulp.task('default', ['stylus_blocks','templates', 'connect','watch','concat_css']);
//creacioon  del server para el livereload
