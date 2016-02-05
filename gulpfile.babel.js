'use strict';
import gulp from 'gulp'
import {gulpGit, gulpJS, showError} from './gulp/utils'

//const $ = loadPlugins();

const Config = {
  dist: './dist',
  webpack: require('./webpack.config.babel').configuration
};

gulpJS(Config.webpack);
gulpGit();

// Watchers
gulp.task('watch', ['js:watch']);

// Root tasks
gulp.task('clean', ['js:clean']);
gulp.task('build', ['js:build']);
gulp.task('default', ['build']);
