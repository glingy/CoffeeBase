var gulp        = require('gulp');
var browserify  = require('browserify');
var uglify      = require('uglifyify');
var coffeeify   = require('coffeeify');
var watchify    = require('watchify');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync');
var source      = require('vinyl-source-stream');
var del         = require('del');


watchify.args.debug = true;

var bundler = watchify(browserify({entries: 'src/main.coffee', debug: true, extensions: '.coffee'}));

bundler.on('error', function (err) {
    gutil.log('Error!');
    browserSync.notify("Browserify Error!");
    this.emit("end");
})

/*bundler.transform(babelify.configure({
    sourceMapRelative: 'src/'
}));*/

bundler.transform(coffeeify, {
  sourceMap: true,
  bare: true,
  header: false
});

bundler.transform(uglify, {

})

bundler.on('update', bundle);

function bundle() {
  return bundler
    .bundle()
    .on('error', (e) => {gutil.log("Error!", e)})
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.stream());
}

gulp.task('bundle', function () {
    return bundle();
});

gulp.task('copy', () => {
  del('dev/static/*')
  gulp.src('static/**/*')
    .pipe(gulp.dest('dev/static/'))
  gulp.src('index.html')
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.stream());
})

gulp.task('reload', () => {
  browserSync.reload()
})

gulp.task('default', ['bundle', 'copy'], function () {
  gulp.watch(['static/**/*', 'index.html'], ['copy'])
  browserSync.init({
      server: "dev"
  });
});
