var fs = require('fs')

module.exports = function (file) {
    var contents = '',
        open = false,
        modified = false,
        readCallback = function (userCallback) {
            return function (err, data) {
                if (!err) {
                    open = true
                    contents = data
                }
                userCallback(err, data)
            }
        }

    return {
        read: function (callback) {
            if (!open) {
                contents = fs.readFile(file, 'utf8', readCallback(callback))
            } else {
                callback(null, contents)
            }
        },
        write: function (newContents) {
            open = true
            modified = true
            contents = newContents
        },
        persist: function (callback) {
            if (open && modified) {
                fs.writeFile(file, contents, 'utf8', callback)
            } else {
                callback(null)
            }
        },
        destroy: function (callback) {
            open = false
            fs.unlink(file, callback)
        }
    }
}