"use strict";

var gulp = require('gulp'),
        concat = require('gulp-concat'),
        fileSort = require('gulp-angular-filesort'),
        ngAnnotate = require('gulp-ng-annotate'),
        mainBowerFiles = require('main-bower-files'),
        less = require('gulp-less'),
        es = require('event-stream'),
        insert = require('gulp-insert'),
        flatten = require('gulp-flatten');
        //nginclude = require('gulp-nginclude');

gulp.task('buildCss', function () {
    var bowerCss = gulp.src(mainBowerFiles('**/*.css'));
    var lessCss = gulp.src(gulp.srcPath + '/assets/css/**/*.less')
            .pipe(less());

    return es.merge(lessCss, bowerCss)
            .pipe(concat('app.css'))
            .pipe(gulp.dest(gulp.publicPath + '/css'));
});


gulp.task('buildJs', function () {
    gulp.src(mainBowerFiles('**/*.js'))
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest(gulp.publicPath + '/js'));

    var src = [
      gulp.srcPath + '/**/*.js'
    ];

    if(gulp.env == "live"){
      src.push('!' + gulp.srcPath + '/**/mocks.js');
    }

    return gulp.src(src)
            .pipe(ngAnnotate())
            .pipe(fileSort())
            .pipe(concat('app.js'))
            .pipe(insert.prepend("var env = '" + gulp.env + "';"))
            .pipe(insert.append("angular.bootstrap(document, ['bivlioApp']);"))
            .pipe(gulp.dest(gulp.publicPath + '/js'));
});

gulp.task('buildHtml', function () {
    gulp.src(gulp.srcPath + '/app/components/**/*.html')
            .pipe(flatten())
            .pipe(gulp.dest(gulp.publicPath + '/views'));

    return gulp.src(gulp.srcPath + '/index.html')
            .pipe(gulp.dest(gulp.publicPath));
});
