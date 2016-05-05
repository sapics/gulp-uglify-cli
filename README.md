# gulp-uglify-cli  [![NPM version](https://badge.fury.io/js/gulp-uglify-cli.svg)](https://badge.fury.io/js/gulp-uglify-cli)

Minify javascript by [UglifyJs2](https://github.com/mishoo/UglifyJS2) with command line options for [gulp](https://github.com/gulpjs/gulp).

## Installation

```
npm i -g uglify-js
npm i --save-dev gulp-uglify-cli
```

## Usage

```javascript
var uglify = require('gulp-uglify-cli')

gulp.task('minifyjs', function(){
  return gulp.src('index.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})
```

## Options

You can use all command line options in [UglifyJs2](https://github.com/mishoo/UglifyJS2#usage).

- String command line option

	`uglify('-c -m --screw-ie8')`

- Array command line option

	`uglify(['-c', '-m', '--screw-ie8'])`

- Hash option

	`uglify({preCommand: 'license.js', command: '-c -m --screw-ie8'})`

	By setting `output` option, you can output file directly.

	`uglify({command: '-c', output: '/home/test/output.js'})`

	By setting `uglifyjs` option, you can use custom uglifyjs path.

	`uglify({command: '-c', uglifyjs: '/home/node_modules/.bin/uglifyjs'})`	

	If you have an error 'Permission Denied' in 'gulp-uglify-cli', please try to use `tmp` option which is accessible file path.

	`uglify({command: '-c', tmp: '/tmp/_tmp.js'})`
