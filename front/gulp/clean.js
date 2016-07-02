"use strict";

var gulp = require('gulp'),
        del = require('del');


gulp.task('clean', function () {
    del.sync([
        gulp.publicPath + '/*.html',
        gulp.publicPath + '/views/*.html',
        gulp.publicPath + '/css/*.css',
        gulp.publicPath + '/js/*.js'
    ]);
})