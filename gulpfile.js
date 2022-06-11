const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const pug = require('gulp-pug');
var ts = require('gulp-typescript');
 
function tsTask() {
  return src('src/ts/script.ts')
    .pipe(ts({
      noImplicitAny: true,
      outFile: 'bundle.js'
    }))
    .pipe(dest('dist/js'))
}

//Pug Task 
function pugTask() {
  return src('src/views/*.pug')
    .pipe(pug())
    .pipe(dest('dist'))
}

//Sass Task
function scssTask() {
  return src('src/scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

//Javascript Task
//function jsTask() { 
  //return src('src/js/script.js', { sourcemaps: true })
    //.pipe(terser())
    //.pipe(dest('dist/js', { sourcemaps: '.' }))
//}

//Browser Task
function browserSyncServer(cb) {
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
  cb();
}

function browserReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask() {
  watch('src/views/**/*.pug', series(pugTask, browserReload));
  watch(['src/scss/**/*.scss', 'src/ts/**/*.ts'], series(scssTask, tsTask, browserReload));
}

//default gulp
exports.default = series(
  pugTask,
  scssTask,
  tsTask,
  browserSyncServer,
  watchTask
);
