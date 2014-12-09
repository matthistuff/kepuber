var format = require('util').format,
    exec = require('child_process').exec,
    escape = function (str) {
        return str.replace(/ /g, '\\ ')
    }

module.exports = {
    extract: function (source, dest, callback) {
        console.log(source, 'extracting to', dest)

        var command = format('unzip %s', escape(source))
        if (arguments.length > 2) {
            command += format(' -d %s', escape(dest))
        }

        exec(command, callback);
    },
    compress: function (source, dest, callback) {
        console.log(source, 'packing into', dest)

        source = escape(source)
        dest = escape(dest)

        var command = [
            format('cd %s', source),
            format('zip -X %s mimetype', dest),
            format('zip -rg %s META-INF -x \\*.DS_Store', dest),
            format('zip -rg %s OEBPS -x \\*.DS_Store', dest)
        ].join(' && ')

        exec(command, callback);
    }
}