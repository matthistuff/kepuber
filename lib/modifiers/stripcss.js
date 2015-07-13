var queue = require('../queue')

module.exports = function (book, modifierDone) {
    var q = queue()

    book.styles.forEach(function (item) {
        q.push(function (done) {
            item.write('')
            done()
        })
    })

    q.process(modifierDone)
}