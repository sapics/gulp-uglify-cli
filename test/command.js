var assert = require('assert')
var es = require('event-stream')
var File = require('gulp-util').File
var uglifyCli = require('../')
var testData = require('./test-data')

describe('command', function() {

  it('command with comments', function(done) {
    // create the fake file
    var fakeFile = new File({
      contents: new Buffer(testData.code)
    })
    var uglifyStream = uglifyCli('--comments all')
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isBuffer())
      // check the contents
      assert.equal(file.contents.toString('utf8').replace(';', ''), testData.minifiedCodeWithComments)
      done()
    })
  })

})
