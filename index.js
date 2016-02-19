var through = require('through2')
var gutil = require('gulp-util')
var PluginError = gutil.PluginError
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var os = require('os')
var PLUGIN_NAME = 'gulp-uglify-cli'


function minify(file, opts, cb){
  var command
  if(Array.isArray(opts) || typeof opts === 'string' || !opts){
    command = (Array.isArray(opts) ? opts.join(' ') : opts) || ''
    opts = {}
  } else {
    command = (Array.isArray(opts.command) ? opts.command.join(' ') : opts.command) || ''
  }

  var tmpPath = path.normalize(opts.tmp || path.join(os.tmpdir(), 'uglify-cli-tmp' + Date.now() + '.js'))

  fs.writeFile(tmpPath, file.contents, function(err){
    if(err) return cb(new PluginError(PLUGIN_NAME, err))

    command = tmpPath + ' ' + command + ' -o ' + tmpPath
    if(opts.preCommand){
      command = (Array.isArray(opts.preCommand) ? opts.preCommand.join(' ') : opts.preCommand)
                + ' ' + command
    }
    exec('uglifyjs ' + command, function(err){
      if(err) {
        if(!opts.tmp) fs.unlink(tmpPath)
        return cb(new PluginError(PLUGIN_NAME, err))
      }

      fs.readFile(tmpPath, function(err, data){
        if(err) {
          if(!opts.tmp) fs.unlink(tmpPath)
          return cb(new PluginError(PLUGIN_NAME, err))
        }

        file.contents = data
        cb(null, file)
        if(!opts.tmp) fs.unlink(tmpPath)
      })
    })
  })
}

module.exports = function(opts){
  function transform(file, enc, cb){
    if(file.isNull()){
      return cb(null, file)
    }
    if(file.isStream()){
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }
    minify(file, opts, cb)
  }
  return through.obj(transform)
}