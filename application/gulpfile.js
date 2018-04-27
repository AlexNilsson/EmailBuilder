var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var less = require('gulp-less');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var es6transpiler = require('gulp-es6-transpiler');

var buildFolter = require('./config.json').buildFolder;

/* Available tasks

 gulp compile_less - compile main stylesheet (app.min.css)
 gulp less:watch - autocompile *.less when have changes

 gulp common_scripts - common scripts/plugins used in template
 gulp app_js - concatenate/minify /app (without /app/bower_components) files (app.min.js) in /build folder

 gulp copy_files - copy needed files from /app to /_dist
 gulp build - build /_dist folder (minified js/css)

 */

gulp.task('common_scripts', function() {
    return gulp.src([
        "app/bower_components/vue/dist/vue.min.js",
        "app/bower_components/tinymce/tinymce.js",
        "app/bower_components/alertifyjs/dist/js/alertify.js",
        "app/bower_components/Sortable/Sortable.js",
        "app/bower_components/jquery-powertip/src/*.js",
        "app/bower_components/vue.draggable/dist/vuedraggable.js"
    ])
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/'));
});

gulp.task('compile_less', function() {
    return gulp.src('app/app.less')
        .pipe(less())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./app/'))
});

gulp.task('less:watch', function () {
    gulp.watch(['app/app.less', 'app/md/*.less'], ['compile_less']);
});

gulp.task('es6:watch', function () {
    gulp.watch(['app/app.js', 'app/builder/*.js'], ['es6_compile']);
});

gulp.task('copy_files', ['common_scripts', 'compile_less'], function() {
    gulp.src('app/bower_components/tinymce/**/*', { "base" : "./app" })
        .pipe(gulp.dest(buildFolter));

    return gulp.src([
        'app/**',
        '!app/{bower_components,bower_components/**}',
        'app/md/icons/**',
        '!app/**/*.less',
        '!app/app.js'
    ], { "base" : "./app" }).pipe(gulp.dest(buildFolter));
});

gulp.task('es6_compile', function () {
    return gulp.src(['app/app.js', 'app/builder/*.js']).pipe(es6transpiler({
        disallowUnknownReferences: false
    })).pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app'))
});

gulp.task('app_js', function() {
    return gulp.src([
        'app/app.js',
        'app/builder/*.js'
    ]).pipe(concat('app.min.js'))
        .pipe(es6transpiler({
            disallowUnknownReferences: false
        }))
        .pipe(uglify())
        .pipe(gulp.dest(buildFolter))
});

gulp.task('build', ['copy_files', 'app_js'], function() {
    var target = gulp.src(buildFolter + '/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(buildFolter + '/app.min.js', { read: false });

    return target.pipe(inject(sources, { ignorePath: buildFolter, addRootSlash: false, relative: false }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(buildFolter));
});

gulp.task('watch', ['less:watch', 'es6:watch']);