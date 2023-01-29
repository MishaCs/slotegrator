"use strict"

const {src, dest} = require("gulp");
const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
const sass = require('gulp-sass')(require('sass'));
const plumber = require("gulp-plumber");
const del = require("delete");

const srcPath = "src/";
const distPath = "dist/";


const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        images: distPath + "assets/img/",
        fonts: distPath + "assets/fonts/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html:   srcPath + "**/*.html",
        js:     srcPath + "assets/js/**/*.js",
        css:    srcPath + "assets/scss/**/*.scss",
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

function html() {
    return src(path.src.html, { base: srcPath })
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
    .pipe(plumber({
        errorHandler : function(err) {
            notify.onError({
                title:    "SCSS Error",
                message:  "Error: <%= error.message %>"
            })(err);
            this.emit('end');
        }
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({stream: true}));
}

function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "JS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
}

function fonts() {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
    return src(path.src.images, {base: srcPath + "assets/img/"})
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}));
}

function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, fonts, images))
const watch = gulp.parallel(build, watchFiles, serve)


exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build
exports.watch = watch
exports.default = watch