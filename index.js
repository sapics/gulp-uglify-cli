var through = require('through2')
var gutil = require('gulp-util')
var PluginError = gutil.PluginError
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var os = require('os')
var pk = Date.now()

const PLUGIN_NAME = 'gulp-uglify-cli'

function createOptions(opts) {
  var command, options = {}
  if (Array.isArray(opts) || typeof opts === 'string' || !opts) {
    command = opts
    opts = {}
  } else {
    command = opts.command
  }
  command = Array.isArray(command) ? command.join(' ') : command || ''

  options.tmpPath = path.normalize(opts.tmp ? opts.tmp
    : path.join(os.tmpdir(), 'uglify-cli-' + (pk++) + '.js'))
  options.command = 'uglifyjs '
    + (Array.isArray(opts.preCommand)
      ? opts.preCommand.join(' ') : opts.preCommand || '')
    + ' ' + options.tmpPath + ' ' + command + ' -o ' + options.tmpPath
  return options
}

function minify(file, options, cb) {
  exec(options.command, function(err) {
    if (err) {
      return cb(new PluginError(PLUGIN_NAME, err))
    }
    if (options.isBuffer) {
      fs.readFile(options.tmpPath, function(err, data) {
        if (err) {
          return cb(new PluginError(PLUGIN_NAME, err))
        }
        file.contents = data
        setTimeout(function() {
          fs.unlink(options.tmpPath)
        }, 5000)
        cb(null, file)
      })
    } else {
      file.contents = fs.createReadStream(options.tmpPath)
      cb(null, file)
    }
  })
}

module.exports = function uglifyCli(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      var options = createOptions(opts)
      fs.writeFile(options.tmpPath, file.contents, function(err) {
        if (err) {
          return cb(new PluginError(PLUGIN_NAME, err))
        }
        options.isBuffer = true
        minify(file, options, cb)
      })
      return
    }

    if (file.isStream()) {
      var options = createOptions(opts)
      var writeStream = fs.createWriteStream(options.tmpPath)
      writeStream.on('close', function() {
        minify(file, options, cb)
      })
      writeStream.on('error', function(err) {
        cb(new PluginError(PLUGIN_NAME, err))
      })
      return file.contents.pipe(writeStream)
    }
    cb(null, file)
  })
}
