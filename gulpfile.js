var gulp = require("gulp"),
    browserSync = require("browser-sync"),
    changed = require("gulp-changed"),
    size = require("gulp-size"),
    sass = require("gulp-sass"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    path = require('path'),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include');

gulp.dest(function(file){
  return path.join(build_dir, path.dirname(file.path));
});

gulp.task("clean", function () {
  gulp.src('./build', {read: false})
    .pipe(clean());
});

gulp.task("html", function() {
  return gulp.src(["./src/*.html"])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './src'
    }))
    .pipe(gulp.dest("build/"));
});

gulp.task("js", function() {
  return gulp.src([
    "./src/*.js",
    "node_modules/bootstrap/dist/js/bootstrap.js"
  ])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest("build/javascripts"));
});

gulp.task("images", function() {
  return gulp.src(["./src/**/*.jpg", "./src/**/*.png", "./src/**/*.gif", "./src/**/*.svg"])
    .pipe(gulp.dest("build/"));
});

gulp.task("zips", function() {
  return gulp.src(["./src/**/*.zip"])
    .pipe(gulp.dest("build/"));
});

gulp.task("fonts", function() {
  return gulp.src(["./src/fonts/**"])
    .pipe(gulp.dest("build/fonts/"));
});

gulp.task("video", function() {
  return gulp.src(["./src/**/*.mp4", "./src/**/*.webm"])
    .pipe(gulp.dest("build/"));
});

gulp.task("css", function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'})) // remove compression from the css
    .pipe(autoprefixer('last 2 versions', { cascade: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/stylesheets'))
    .pipe(size({title: 'styles'}))
});

gulp.task("browser-sync", ["html","css"], function() {
  browserSync({
    server: {
      baseDir: "./build/",
      injectChanges: true,
      files: ["./build/**/*"],
    }
  });
});


gulp.task("build", ["html","css","js","images","fonts","zips","video"])
gulp.task("watch", function() {
  // Watch .html files
  gulp.watch("src/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.scss", ["css", browserSync.reload]);
  gulp.watch("src/**/*.js", ["html", browserSync.reload]);
  gulp.watch("src/**/*.jpg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.png", ["images", browserSync.reload]);
  gulp.watch("src/**/*.svg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.gif", ["images", browserSync.reload]);
  gulp.watch("src/**/*.zip", ["zips"]);
  gulp.watch("src/**/*.mp4", ["video"]);
  gulp.watch("src/**/*.webm", ["video"]);
});

gulp.task("default", ["build","browser-sync","watch"]);
