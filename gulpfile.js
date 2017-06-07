const gulp = require('gulp'),
    uglify = require('gulp-uglify');
    concat = require('gulp-concat');
    notify = require('gulp-notify');
    less = require('gulp-less');
    sourcemaps = require('gulp-sourcemaps');
    minifyCSS = require('gulp-minify-css');
    imagemin = require('gulp-imagemin');
    pngcrush = require('imagemin-pngcrush');
    autoprefixer = require('gulp-autoprefixer');
    csscomb = require('gulp-csscomb');
    watch = require('gulp-watch');
    rigger = require('gulp-rigger');
    browserSync = require('browser-sync');
    reload = browserSync.reload;

const paths = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.less',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

gulp.task('html:build', function () {
    gulp.src(paths.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(paths.build.html))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({message: "Мы собрали для тебя разметку, человеческая особь!"}));
});

gulp.task('js:build', function () {
    gulp.src(paths.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.js))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({message: "ДЖС готов!"}));
});

gulp.task('style:build', function () {
    gulp.src(paths.src.style)
        .pipe(less())
        .pipe(autoprefixer('last 5 versions'))
        .pipe(csscomb())
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css))
        .pipe(notify({message: "Стили готовы!"}))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('image:build', function () {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.build.img))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({message: "Картинки готовы!"}));
});

gulp.task('fonts:build', function () {
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./build/",
            index: "index.html"
        }
    });
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function () {
    watch([paths.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([paths.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([paths.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([paths.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([paths.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['watch', 'browser-sync']);
