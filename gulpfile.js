var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// // require dependencies
// var gulp    = require('gulp');
// var minifyHtml = require('gulp-minify-html');
// var minifyCss = require('gulp-minify-css');
// var contact = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var jshint = require('gulp-jshint');
// var nodemon = require('gulp-nodemon');
// var notify = require('gulp-notify');

// // creates reference for app files 
// var paths = { 
//   scripts: ['PATH(s) GLOB PATTERN'], 
//   html: ['PATH(s) TO HTML'], 
//   styles: ['PATH(s) TO STYLESHEETS'], 
//   tests: ['PATH(s) TO MOCHA SPECS'], 
//   server: ['SERVER.JS']
// }; 

// // start server with nodemon
// gulp.task('serve', function() {
//   nodemon({script: paths.server.index});
// });

// // lint files 
// gulp.task('jshint', function() {
//   gulp.src(paths.scripts)
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(notify({message: 'linting complete'})); 
// })

// // run mocha specs 
// gulp.task('test', function() {
//   gulp.src(paths.server.specs)
//     .pipe(mocha({reporter: 'spec'}))
//     .pipe(notify({message: 'passed specs'}));
// });

// // concat and uglify files
// gulp.task('scripts', function() {
//   gulp.src(paths.scripts)
//     .pipe(uglify())
//     .pipe(concat('NAME OF CONCATED FILE.js'))
//     .pipe(gulp.dest('PATH TO BUILD DIR'))
//     .pipe(notify({message: 'concat/uglify complete'}));
// });

// // watch, build, and default tasks
// gulp.task('build', ['jshint, scripts']);

// gulp.task('watch', function() {
//   gulp.watch(paths.scripts, ['build']);
// });

// gulp.task('default', ['test', 'serve', 'watch']);
