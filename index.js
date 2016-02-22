var through = require('through2')
var gutil = require('gulp-util')
var PluginError = gutil.PluginError
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var os = require('os')
var pk = Date.now()

const PLUGIN_NAME = 'gulp-uglify-cli'

function getCommandString(command) {
  command = Array.isArray(command) ? command.join(' ') : command
  return command ? ' ' + command.trim() + ' ' : ' '
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
    : path.join(os.tmpdir(), 'uglify-' + (pk++).toString(36) + '.js'))
  return {tmpPath: tmpPath,
          command: 'uglifyjs' + opts.preCommand + tmpPath + opts.command
                     + '-o ' + tmpPath
         }
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
