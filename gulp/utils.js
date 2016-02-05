'use strict';
import fs from 'fs'
import gulp from 'gulp'
import webpack_stream from 'webpack-stream'
import del from 'del'
import loadPlugins from 'gulp-load-plugins'
import named from 'vinyl-named'
import semver from 'semver'
import webpack from 'webpack'
import tag_version from 'gulp-tag-version'

const $ = loadPlugins();

export const readJSON = filename => {
  const data = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(data);
};

export const keysOf = obj => {
  const result = [];
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result.push(prop);
    }
  }
  return result;
};

export const valuesOf = obj => {
  const result = [];
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result.push(obj[prop]);
    }
  }
  return result;
};

export const showError = function (error) {
  console.log(error);
  this.emit('end');
};

export const gulpJS = (webpackConfig) => {
  // Javascript pipeline
  gulp.task('js:build', () => {
    const sources = valuesOf(webpackConfig.entry);
    const targets = keysOf(webpackConfig.entry);
    gulp.src(sources)
      .pipe(named(targets))
      .pipe(webpack_stream(webpackConfig, webpack))
      .on('error', showError)
      .pipe(gulp.dest(webpackConfig.output.path))
      .pipe($.filter('*.js'))
      .pipe($.rename({extname: '.min.js'}))
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(webpackConfig.output.path));
  });

  gulp.task('js:clean', () => del('dist/**/*.js'));

  gulp.task('js:watch', ['js:build'], () => gulp.watch('src/js/**/*.js', ['js:build']));

};

// Git pipeline
export const gulpGit = () => {
  const {version} = readJSON('package.json');
  ['patch', 'minor', 'major'].forEach(importance => {
    gulp.task(`bump:${importance}`, () => {
      const newVersion = semver.inc(version, importance);
      return gulp.src('package.json')
        .pipe($.bump({version: newVersion}))
        .pipe(gulp.dest('./'))
        .pipe($.git.commit(`Update version to ${newVersion}`))
        .pipe(tag_version());
    });
  });
};

/*
 npm i -D \
 babel-loader
 babel-preset-es2015
 babel-preset-stage-0
 babel-preset-stage-2
 babel-register
 del
 expect
 gulp
 gulp-bump
 gulp-filenames
 gulp-filter
 gulp-git
 gulp-load-plugins
 gulp-rename
 gulp-sourcemaps
 gulp-tag-version
 gulp-uglify
 mocha
 vinyl-named
 webpack
 webpack-stream
 */
