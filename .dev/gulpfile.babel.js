/**
 *
 *  MODIFIED: Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();

var cssimage = require('gulp-css-image');
var replace = require('gulp-replace');

// Optimize images
gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('../images'))
    .pipe($.size({title: 'images'}))
);

// Generate SCSS for all images in images folder
gulp.task('cssimage', function(){
  return gulp.src(['app/images/*.png', 'app/images/*.jpg', '!app/images/*_2x.*'])
    .pipe(cssimage({css: false, scss: true, retina: true, root: 'images/', prefix: 'img-', name: '_image-mixins.scss'}))
    .pipe(replace('-50pc', '_2x'))
    .pipe(replace('(min-device-pixel-ratio: 2) and (min-resolution: 192dpi)', 'screen and (min-resolution: 2dppx)'))
    .pipe(gulp.dest('app/src/scss/components'))
});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/src/style.scss',
    'app/style.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))

    // Concatenate and minify styles
    // .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('../'))
    .pipe(gulp.dest('.tmp/styles'));
});

// Build production files, the default task
gulp.task('default', cb =>
  runSequence(
    'cssimage',
    'styles',
    'images',
    cb
  )
);
