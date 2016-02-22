var assert = require('assert')
var es = require('event-stream')
var File = require('gulp-util').File
var uglifyCli = require('../')
var testData = require('./test-data')

describe('input file mode', function() {

  it('stream mode', function(done) {
    // create the fake file
    var fakeFile = new File({
      contents: es.readArray(testData.codeArray)
    })
    var uglifyStream = uglifyCli()
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isStream())
      file.contents.pipe(es.wait(function(err, data) {
        // check the contents
        assert.equal(data.toString('utf8').replace(';', ''), testData.minifiedCode)
        done()
      }))
    })
  })

  it('buffer mode', function(done) {
    // create the fake file
    var fakeFile = new File({
      contents: new Buffer(testData.code)
    })
    var uglifyStream = uglifyCli()
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isBuffer())
      // check the contents
      assert.equal(file.contents.toString('utf8').replace(';', ''), testData.minifiedCode)
      done()
    })
  })

  it('null mode', function(done) {
    // create the fake file
    var fakeFile = new File()
    var uglifyStream = uglifyCli()
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isNull())
      assert.equal(file.contents, null)
      done()
    })
  })

})
