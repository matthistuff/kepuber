var util = require('util'),
    queue = require('../parallel_queue'),

    annotate = function (item, done) {
        return function (err, data) {
            if (!err) {
                item.write(data.replace(reg, replacer))
            }
            done()
        }
    },

    index = 1,
    reg = /<(h\d|p)([^>]*)>/gi,
    replacer = function (match, tag, attributes) {
        if (attributes && attributes.indexOf('id=') !== -1) {
            return match
        }
        if (!attributes) {
            attributes = ''
        }

        attributes += util.format(' id="kobo.%s.1"', index)
        index += 1;

        return util.format('<%s%s>', tag, attributes)
    }

module.exports = function (book, done) {
    var stack = queue()

    book.files.forEach(function (item) {
        stack.push(function (done) {
            item.read(annotate(item, done))
        })
    })

    stack.process(done)
}