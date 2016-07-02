"use strict";

var gulp = require('gulp');

gulp.env = 'aa';

gulp.task('deploy', ['buildHtml', 'buildCss', 'buildJs']);
