var format = require('util').format,
    exec = require('child_process').exec,
    escape = function (str) {
        return str.replace(/ /g, '\\ ').replace(/'/g, "\\'")
    }

module.exports = {
    extract: function (source, dest, callback) {
        //console.log(source, 'extracting to', dest)

        source = escape(source)
        dest = escape(dest)

        var command = format('unzip %s', source)
        if (arguments.length > 2) {
            command += format(' -d %s', dest)
            command += format(' && find %s -type f -exec chmod 644 {} \\;', dest)
        }

        exec(command, callback);
    },
    compress: function (source, dest, callback) {
        //console.log(source, 'packing into', dest)

        source = escape(source)
        dest = escape(dest)

        var command = [
            format('cd %s', source),
            format('zip -X %s mimetype', dest),
            format('zip -rg %s . -x \\*.DS_Store mimetype', dest)
        ].join(' && ')

        exec(command, callback);
    }
}
