var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gulpSourcemaps  = require("gulp-sourcemaps"),
    livereload = require('gulp-livereload'),
    connect = require("gulp-connect"),
    cleanCSS = require("gulp-clean-css"),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    svgSprite = require("gulp-svg-sprites");

var path = {
    HTML: './src/*.html',
    SASS: './src/scss/style.scss',
    JS: './src/js/script.js',
    LIB: './src/js/lib/*.js',
    IMG: './src/images/*.svg',
    FONT: './src/fonts/*',
    DEST: './www/',
    DEST_JS: './www/js',
    DEST_CSS: './www/css',
    DEST_IMG: './www/images/',
    DEST_FONT: './www/fonts/',
};

gulp.task('css', function() {
    return gulp.src(path.SASS)
        .pipe(gulpSourcemaps.init())
        .pipe(sass())
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest(path.DEST_CSS))
        .pipe(cleanCSS())
        // .pipe(livereload())
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src([path.LIB, path.JS])
    .pipe(concat('scriptAll.js'))
    .pipe(rename({
       suffix: '.min'
   }))
   .pipe(gulp.dest(path.DEST_JS));
});

gulp.task('cleanCSS', function () {
    gulp.src('./www/css/style.css')
        .pipe(cleanCSS({keepBreaks: true}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('www/css'))
    ;
});

gulp.task('copyHtmlFiles', function () {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST))
        .pipe(connect.reload());
});

gulp.task('copyImgFiles', function () {
    return gulp.src(path.IMG)
        .pipe(gulp.dest(path.DEST_IMG))
        .pipe(connect.reload());
});

gulp.task('copyFontFiles', function () {
    return gulp.src(path.FONT)
        .pipe(gulp.dest(path.DEST_FONT))
        .pipe(connect.reload());
});

gulp.task('sprites', ['copyImgFiles'], function () {
    return gulp.src('src/images/icons/*.svg')
        .pipe(svgSprite({
            cssFile: "scss/_sprite.scss",
            svg: {
                sprite: "images/cities.svg"
            }
        }))
        .pipe(gulp.dest("src/"));
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(path.SASS, ['css']);
    gulp.watch(path.JS, ['js']);
    gulp.watch(path.IMG, ['copyImgFiles']);
    gulp.watch(path.HTML, ['copyHtmlFiles']);
    livereload.listen();
});

gulp.task('default', ["watch", "connect", "css", "cleanCSS", "js", "copyImgFiles", "copyFontFiles", "copyHtmlFiles", "sprites"]);
