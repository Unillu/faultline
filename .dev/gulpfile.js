var browserSync = require('browser-sync').create();

var gulp = require('gulp');
var cssimage = require('gulp-css-image');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cache');
var del = require('del');

// Cleans old files
gulp.task('clean', async function() {
  return del.sync(['../images', '../fonts', '../style.css', '.tmp'], {force: true});
})

// Generate SCSS for all images in images folder
gulp.task('cssimage', function(){
  return gulp.src(['app/images/*.png', 'app/images/*.jpg', '!app/images/*_2x.*'])
    .pipe(cssimage({css: false, scss: true, retina: true, root: 'images/', prefix: 'img-', name: '_image-mixins.scss'}))
    .pipe(replace('-50pc', '_2x'))
    .pipe(replace('(min-device-pixel-ratio: 2) and (min-resolution: 192dpi)', 'screen and (min-resolution: 2dppx)'))
    .pipe(gulp.dest('app/src/scss/components'))
});

// Minify images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg)')
    // .pipe(cache(imagemin()))
    .pipe(gulp.dest('../images'))
});

// Copy fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('../fonts'))
})

// Compile all SCSS
gulp.task('sass', function() {

  return gulp.src('app/src/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({
        precision: 10
      }))
      .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: 'app/src'}))
      .pipe(gulp.dest('../'))
});

// Watch files
gulp.task('watch', function(){
  browserSync.init({
      files: [
        {
          options: {
            ignored: ".*",
          },
        },
      ],
      port: 8890,
      proxy: 'http://localhost:8888',
      reloadOnRestart: true,
      browser: 'google chrome'
    })

  gulp.watch('app/images/*.+(png|jpg)', gulp.series(['cssimage', 'images']))
  gulp.watch(['app/src/scss/**/*.scss', 'app/src/style.scss'], gulp.series('sass')).on('change', browserSync.reload)
})

// Builds production
gulp.task('build', async function(){
  gulp.series('clean', gulp.parallel('sass', 'images', 'fonts'))
})
