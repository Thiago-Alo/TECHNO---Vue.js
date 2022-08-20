// Adiciona os modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
  return gulp
    //CAMINHO CSS
    .src('css/scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      }),
    )
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

// Tarefa de gulp para a função de SASS
// gulp.task('sass', function (done) {
//   compilaSass();
//   done();
// });
exports.compilaSass = compilaSass;

// Função para juntar o JS
function gulpJS() {
  return gulp
    //CAMINHO JS
    .src('js/components/**/*.js')
    //ARQUIVO QUE SERÁ CRIADO
    .pipe(concat('script.js'))
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

// gulp.task('mainjs', gulpJS);
exports.gulpJS = gulpJS;


// JS Plugins
function pluginJS() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/moment/min/moment.min.js',
      'js/plugins/*.js',
    ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

// gulp.task('pluginjs', pluginJS);
exports.pluginJS = pluginJS;

// Função para iniciar o browser
function browser() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
}

// Tarefa para iniciar o browser-sync
// gulp.task('browser-sync', browser);
exports.browser = browser;

// Função de watch do Gulp
function watch() {
  //CAMINHOS DO WATCH
  gulp.watch('css/scss/**/*.scss', compilaSass);
  gulp.watch('js/components/**/*.js', gulpJS);
  gulp.watch('js/plugins/**/*.js', pluginJS);
  gulp.watch(['*.html']).on('change', browserSync.reload);
}

// Inicia a tarefa de watch
// gulp.task('watch', watch);
exports.watch = watch;

// Tarefa padrão do Gulp, que inicia o watch e o browser-sync
exports.default = gulp.parallel(watch, browser, compilaSass, gulpJS, pluginJS)
