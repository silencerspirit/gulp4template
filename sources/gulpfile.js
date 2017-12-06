'use strict';

var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  notify = require("gulp-notify"),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
  pugInheritance = require('gulp-pug-inheritance')


gulp.task('scripts', function () {
  return gulp.src([
      'libs/jquery/jquery-3.2.1.min.js',
      'libs/smoothscroll_polyfill/smoothscroll.min.js',
      'js/common.js', // Всегда в конце
    ])
    .pipe(concat('scripts.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('../js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('pug', function () {
  return gulp.src('pug/*.pug')
    .pipe(pugInheritance({
      basedir: 'pug', 
      extension: '.pug', 
      skip: 'node_modules'
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('../'))
})

gulp.task('sass', function () {
  return gulp.src('sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({})
      .on("error", notify.onError({
        message: "Error: <%= error.message %>",
        title: "Sass"
      })))
    // .pipe(rename({
    //   suffix: '.min',
    //   prefix: ''
    // }))
    .pipe(autoprefixer({
      browsers: ['last 15 versions']
    }))
    // .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('imagemin', function () {
  return gulp.src('img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('../img'))
})

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: '../'
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  })
  gulp.watch("../*.html").on('change', browserSync.reload)
})

gulp.task('watch', function () {
  gulp.watch('pug/**/*.pug', gulp.series('pug'))
  gulp.watch('sass/**/*.sass', gulp.series('sass'))
  gulp.watch('./img/**/*', gulp.series('imagemin'))
  gulp.watch(['libs/**/*.js', 'js/common.js'], gulp.series('scripts'))
})
gulp.task('default', gulp.series(
  gulp.parallel('pug', 'sass', 'scripts', 'imagemin'),
  gulp.parallel('watch', 'browser-sync')
))