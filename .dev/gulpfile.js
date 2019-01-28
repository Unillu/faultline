var gulp = require('gulp');
var sass = require('gulp-sass');

// Generate SCSS for all images in images folder
gulp.task('cssimage', function(){
  return gulp.src(['app/images/*.png', 'app/images/*.jpg', '!app/images/*_2x.*'])
    .pipe(cssimage({css: false, scss: true, retina: true, root: 'images/', prefix: 'img-', name: '_image-mixins.scss'}))
    .pipe(replace('-50pc', '_2x'))
    .pipe(replace('(min-device-pixel-ratio: 2) and (min-resolution: 192dpi)', 'screen and (min-resolution: 2dppx)'))
    .pipe(gulp.dest('app/src/scss/components'))
});

// Compile all SCSS
gulp.task('sass', function() {
  return gulp.src([
    'app/src/style.scss',
  ])
      // .pipe($.newer('.tmp/styles'))
      // .pipe($.sourcemaps.init())
      .pipe(sass({
        precision: 10
      }))
      // .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(gulp.dest('.tmp/styles'))

      // Concatenate and minify styles
      // .pipe($.size({title: 'styles'}))
      // .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('../'))
      // .pipe(gulp.dest('.tmp/styles'));
});