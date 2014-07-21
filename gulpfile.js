var gulp = require('gulp');
var client = require('tiny-lr')();
var lr_port = 35729;
var refresh = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

// The gulpfile has been set up to create a dist file for deployment. 
// It has not been used in our workflow and it will be up to you to 
// impletement it if you so choose. 

// creates reference for app files 
var paths = { 
  scripts: ['./www/js/*.js', 'www/lib/**/*.js'], 
  html: ['./www/html/*.html'], 
  styles: ['./www/css/*.css'], 
  specs: ['./specs/*.js'], 
  server: ['server.js'], 
  dist: ['./dist/**/*.js', './dist/**/*.css', './dist/**/*.html']
}; 

// live reload server
gulp.task('reload', function () {
  client.listen(lr_port, function (err) {
    if(err) {
      console.error(err);
    }
  });
});

// start server using nodemon
gulp.task('serve', function() {
  nodemon({script: paths.server, ignore: 'node_modules/**/*.js'})
    .on('restart', function () {
      refresh(client);
    });
});

// lint js files 
gulp.task('lint', function() {
  return gulp.src('./www/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

// concat and uglify js files
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({message: 'scripts task complete'}))
    .pipe(refresh(client));
});

// minify css files
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(notify({message: 'styles task complete'}))
    .pipe(refresh(client));
});

// minify html files
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist/assets/html'))
    .pipe(rename({suffix: 'min'}))
    .pipe(notify({message: 'html task complete'}))
    .pipe(refresh(client));
});

// clean dist files before deployment
gulp.task('clean', function() {
  return gulp.src(paths.dist, {read: false})
    .pipe(clean())
});

// update files on change
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint', 'scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.html, ['html']);
});

gulp.task('default', ['reload', 'serve', 'clean', 'lint', 'scripts', 'styles', 'html', 'watch']);

