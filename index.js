var through = require('through2')
var gutil = require('gulp-util')
var PluginError = gutil.PluginError
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var os = require('os')
var randomBytes = require('crypto').randomBytes

const PLUGIN_NAME = 'gulp-uglify-cli'

function getCommandString(command) {
  command = Array.isArray(command) ? command.join(' ') : command
  return command ? ' ' + command.trim() + ' ' : ' '
}

function randomHex(){
	return randomBytes(64).toString('hex')
}

function _createOptions(opts){
  var command, options = {}
  if (Array.isArray(opts) || typeof opts === 'string' || !opts) {
    command = opts
    opts = {}
  } else {
    for (var k in opts) {
      options[k] = opts[k]
    }
    command = opts.command
  }

  options.command = getCommandString(command)
  options.preCommand = getCommandString(opts.preCommand)
  return options
}

function createOptions(opts) {
  var tmpPath = path.normalize(opts.tmp ? opts.tmp
    : path.join(os.tmpdir(), 'uglify-' + randomHex() + '.js'))
  var outputPath = opts.output || tmpPath
  return {tmpPath: tmpPath,
          outputPath: outputPath,
          command: (opts.uglifyjs || 'uglifyjs') + opts.preCommand + tmpPath + opts.command
                     + '-o ' + outputPath
         }
}

function minify(file, options, cb) {
  exec(options.command, function(err) {
    if (err) {
      return cb(new PluginError(PLUGIN_NAME, err))
    }
    if (options.isBuffer) {
      fs.readFile(options.outputPath, function(err, data) {
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
      file.contents = fs.createReadStream(options.outputPath)
      cb(null, file)
    }
  })
}

module.exports = function uglifyCli(opts) {
  var _options = _createOptions(opts)
  return through.obj(function(file, enc, cb) {
    var options = createOptions(_options)
    if (file.isBuffer()) {
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
