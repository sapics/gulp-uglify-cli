# gulp-uglify-cli

Minify javascript by [UglifyJs2](https://github.com/mishoo/UglifyJS2) with gulp.

## Installation

```
npm i uglify-js -g
npm i gulp-uglify-cli --save-dev
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
`uglify({preCommand: 'license.js', command: '-c -m --screw-ie8', tmp: 'tmp.js'})`
If you have an error 'Access Denied' in 'gulp-uglify-cli', please try to use `tmp` option.
