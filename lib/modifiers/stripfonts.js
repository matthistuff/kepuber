var queue = require('../parallel_queue'),

    fontfacereg = /@font-face[^}]+}\n?/gi,
    fontreg = /font-family.+;/gi,
    indexreg = /<item.+x-font-.+\/>\n?/gi

module.exports = function (book, done) {
    var stack = queue()

    book.fonts.forEach(function (item) {
        stack.push(function (done) {
            item.destroy(done)
        })
    })

    book.styles.forEach(function (item) {
        stack.push(function (done) {
            item.read(function (err, data) {
                item.write(
                    data
                        .replace(fontfacereg, '')
                        .replace(fontreg, '')
                )
                done()
            })
        })
    })

    book.index.forEach(function (item) {
        stack.push(function (done) {
            item.read(function (err, data) {
                item.write(data.replace(indexreg, ''))
                done()
            })
        })
    })

    stack.process(done)
}