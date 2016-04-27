var assert = require('assert')
var es = require('event-stream')
var File = require('gulp-util').File
var uglifyCli = require('../')
var testData = require('./test-data')
var os = require('os')
var path = require('path')
var fs = require('fs')
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

  it('array command with comments', function(done) {
    // create the fake file
    var fakeFile = new File({
      contents: new Buffer(testData.code)
    })
    var uglifyStream = uglifyCli(['--comments', 'all'])
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isBuffer())
      // check the contents
      assert.equal(file.contents.toString('utf8').replace(';', ''), testData.minifiedCodeWithComments)
      done()
    })
  })

  it('hash command with comments', function(done) {
    // create the fake file
    var fakeFile = new File({
      contents: new Buffer(testData.code)
    })
    var outputPath = path.join(os.tmpdir(), 'uglify-test.js')
    var uglifyStream = uglifyCli({command: '--comments all', output: outputPath})
    uglifyStream.write(fakeFile)
    uglifyStream.once('data', function(file) {
      assert(file.isBuffer())
      // check the contents
      assert.equal(file.contents.toString('utf8').replace(';', ''), testData.minifiedCodeWithComments)

      try{
        fs.accessSync(outputPath)
      }catch(e){
        assert.equal(true, false, 'Not exist output file')
      }
      done()
    })
  })
})
