const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const autoClose = require('browser-sync-close-hook');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const ejs = require('gulp-ejs');
const reload = browserSync.reload;

const sassTask = function buildSass() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .on('end', () => {
      console.log('Successfully Built SASS');
      browserSync.reload();
    });
};

const jsTask = function buildJS() {
  return gulp.src([
    'src/js/**/*.js',
    '!src/js/**/*.spec.js',
  ])
  .pipe(concat('app.js'))
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minify({
    ext: {
      min: '.min.js',
    },
  }))
  .pipe(gulp.dest('dist/js/'))
  .on('end', () => {
    console.log('Successfully Built JS');
  });
};

const imgTask = function buildImages() {
  return gulp.src('src/images/*')
   .pipe(imagemin([
     imagemin.optipng({ optimizationLevel: 5 }),
   ]))
   .pipe(gulp.dest('dist/images'))
   .on('end', () => {
     console.log('Successfully compressed images');
   });
};

gulp.task('build-sass', sassTask);
gulp.task('build-js', jsTask);
gulp.task('build-images', imgTask);

gulp.task('build-dist', () => {
  gulp.src('src/index.ejs')
   .pipe(ejs({}, {}, { ext: '.html' }))
   .pipe(gulp.dest('./dist'))
   .on('end', () => {
     console.log('Successfully Built ejs');
     // run sass/js tasks
     sassTask();
     jsTask();
     imgTask();
   });
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose,
    },
  });
  browserSync({
    proxy: 'localhost:2007',
    port: 2008,
    notify: false,
    ui: false,
  });
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
    ],
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', [
  'browser-sync',
  'build-sass',
  'build-js',
], () => {
  watch([
    '**/*.ejs',
  ], reload);
  gulp.watch([
    'src/styles/**/*.scss',
  ], ['build-sass']);
  gulp.watch([
    'src/js/**/*.js',
  ], ['build-js']);
});
