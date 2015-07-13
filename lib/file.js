var fs = require('fs')

module.exports = function (file) {
    var content = '',
        open = false,
        modified = false,
        readCallback = function (userCallback) {
            return function (err, data) {
                if (!err) {
                    open = true
                    content = data
                }
                userCallback(err, data)
            }
        }

    return {
        read: function (callback) {
            if (!open) {
                content = fs.readFile(file, 'utf8', readCallback(callback))
            } else {
                callback(null, content)
            }
        },
        write: function (newContent) {
            open = true
            modified = true
            content = newContent
        },
        persist: function (callback) {
            if (open && modified) {
                fs.writeFile(file, content, 'utf8', callback)
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