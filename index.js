var through = require('through2');
var pluginError = require('gulp-util').PluginError;

var File = require('vinyl');

var firstFileBase = null;
var manifest = {};

function relPath(base, filePath) {
    if (filePath.indexOf(base) !== 0) {
        return filePath.replace(/\\/g, '/');
    }

    var newPath = filePath.substr(base.length).replace(/\\/g, '/');

    if (newPath[0] === '/') {
        return newPath.substr(1);
    }

    return newPath;
}

module.exports = {
    rev:function(){
        return through.obj(function (file, enc, cb) {
            // 判断文件类别,生成文件内容或返回结果
            if (file.isNull()) {

                cb(null, file);
            } else if (file.isBuffer()) {

                //file.contents = Buffer.concat([file.contents, prefixText]);
            } else if (file.isStream()) {
                throw new pluginError('gulp-rev-manifest', 'Please to buffer!');
            }

            if (!file.path) {
                cb();
                return;
            }

            firstFileBase = firstFileBase || file.base;

            var revisionedFile = relPath(firstFileBase, file.path);

            manifest[revisionedFile] = revisionedFile;
            cb(null,file);
        });
    },
    manifest: function (fileName,opts) {
        return through.obj(function (file, enc, cb) {
            cb();
        },function(cb){
            var file = new File({
                base:'/',
                path: '/'
            });
            file.basename = fileName || 'rev-manifest.json';
            file.contents = new Buffer(JSON.stringify(manifest).replace(/,/g,',\n'));

            this.push(file);
            cb(null,file);
        });
    }
};
