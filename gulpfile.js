/**
 * @author Alicia Sykes <alicia@aliciasykes.com>
 * Created on 20/07/2015
 * To run script run "gulp" in the command line
 * To just watch files run "gulp watch"
 * To just clean the public directory run "gulp clean"
 * To view commnted version of this file visit:
 * https://gist.github.com/Lissy93/1eb7a804b7250d714e02
 */

/* Include the necessary modules */
var gulp    = require('gulp');
var gutil   = require('gulp-util');      // For logging stats and warnings
var gsize   = require('gulp-filesize');  // It's nice to know file size after minifing
var jshint  = require('gulp-jshint');    // For checking JavaScript for warnings
var concat  = require('gulp-concat');    // For joining together multiple files
var uglify  = require('gulp-uglify');    // For minimising files
var coffee  = require('gulp-coffee');    // For compiling coffee script into js
var cofLint = require('gulp-coffeelint');// For checking coffee script for errors
var less    = require('gulp-less');      // For compiling Less into CSS
var cssLint = require('gulp-csslint');   // For checking the awesomeness of css
var minCss  = require('gulp-minify-css');// For minifying css
var uncss   = require('gulp-uncss');     // For deleting unused CSS rules
var changed = require('gulp-changed');   // For only updating changed files
var footer  = require('gulp-footer');    // For adding footer text into files
var nodemon = require('gulp-nodemon');   // For the super cool instant refreshing server
var bSync   = require('browser-sync');   // Syncs the place between multiple browsers for dev
var es      = require('event-stream');   // For working with streams rather than temp dirs
var del     = require('del');            // For removing everything from last builds

/* Define constants */
var CONFIG = {
    SOURCE_ROOT     : "sources",    // Folder name for all js and css source
    DEST_ROOT       : "public",     // Folder name for the results root
    JS_DIR_NAME     : "scripts",    // Name of JavaScript directory
    CSS_DIR_NAME    : "styles",     // Name of CSS directory
    JS_FILE_NAME    : "all.min.js", // Name of output JavaScript file
    CSS_FILE_NAME   :"all.min.css", // Name of output CSS file
    FOOTER_TEXT     : ""            // Optional footer text for output files
};


/* Clean the work space */
gulp.task('clean', function (cb) {
    del([
        CONFIG.DEST_ROOT+'/scripts/**/*',
        CONFIG.DEST_ROOT+'/styles/**/*'
    ], cb);
});

/* JavaScript Tasks */
gulp.task('scripts',  function(){
    var jsSrcPath = CONFIG.SOURCE_ROOT + '/'+CONFIG.JS_DIR_NAME+'/**/*';
    var jsResPath = CONFIG.DEST_ROOT + '/'+CONFIG.JS_DIR_NAME;

    var jsFromCs = gulp.src(jsSrcPath+'.coffee')
        .pipe(cofLint())
        .pipe(cofLint.reporter())
        .pipe(coffee());

    var jsFromPlain = gulp.src(jsSrcPath+'.js');

   return es.merge(jsFromCs, jsFromPlain)
       .pipe(changed(jsResPath))
       .pipe(jshint())
       .pipe(jshint.reporter('jshint-stylish'))
       .pipe(concat(CONFIG.JS_FILE_NAME,{newLine: ';'}))
       .pipe(uglify())
       .pipe(footer(CONFIG.FOOTER_TEXT))
       .pipe(gsize())
       .pipe(gulp.dest(jsResPath))
       .on('error', gutil.log);
});

/* CSS Tasks */
gulp.task('styles',  function(){
    var cssSrcPath = CONFIG.SOURCE_ROOT + '/'+CONFIG.CSS_DIR_NAME+'/**/*';
    var cssResPath = CONFIG.DEST_ROOT + '/'+CONFIG.CSS_DIR_NAME;

    var cssFromLess = gulp.src(cssSrcPath+'.less')
        .pipe(less());

    var cssFromVanilla = gulp.src(cssSrcPath+'.css');

    return es.merge(cssFromLess, cssFromVanilla)
        .pipe(changed(cssResPath))
        .pipe(cssLint())
        .pipe(cssLint.reporter())
        .pipe(concat(CONFIG.CSS_FILE_NAME))
        .pipe(minCss({compatibility: 'ie8'}))
        .pipe(gsize())
        .pipe(gulp.dest(cssResPath))
        .on('error', gutil.log);

});


/* Configure files to watch for changes */
gulp.task('watch', function() {
    gulp.watch(CONFIG.SOURCE_ROOT+'/**/*.{js,coffee}', ['scripts']);
    gulp.watch(CONFIG.SOURCE_ROOT+'/**/*.{css,less}',  ['styles']);
});

/* Start Nodemon */
gulp.task('demon', function () {
    gulp.start('scripts', 'styles');
    nodemon({
        script: './bin/www',
        ext: 'js coffee css less html',
        ignore: ['public/**/*'],
        env: { 'NODE_ENV': 'development'}
    })
        .on('start', function(){
            gulp.start('scripts', 'styles');
        })
        .on('change', ['watch'])
        .on('restart', function () {
            console.log('restarted!');
        });
});



/* Nodemon task for monitory for changes with live restarting */
gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: './bin/www',
        watch: ['source/**/*']
    })
        .on('start', function onStart() {
            if (!called) { cb(); }
            called = true;
        })
        .on('restart', function onRestart() {
            setTimeout(function reload() {
                bSync.reload({
                    stream: false
                });
            }, 500);
        });
});

gulp.task('browser-sync', ['nodemon', 'scripts', 'styles'], function () {
    bSync.init({
        files: [CONFIG.SOURCE_ROOT+'/**/*.*'],
        proxy: 'http://localhost:3000',
        port: 4000,
        browser: ['google chrome']   // Default browser to open
    });
    gulp.watch(CONFIG.SOURCE_ROOT+'/**/*.{js,coffee}', ['scripts']);
    gulp.watch(CONFIG.SOURCE_ROOT+'/**/*.{css,less}',  ['styles']);
    gulp.watch(CONFIG.SOURCE_ROOT+"/**/*").on('change', bSync.reload);
    gulp.watch("views/**/*.jade").on('change', bSync.reload);
});



/* Default Task */
gulp.task('default', ['clean', 'browser-sync']);