var queue = require('../queue')

module.exports = function (book, done) {
    var stack = queue()

    book.styles.forEach(function (item) {
        stack.push(function (done) {
            item.write('')
            done()
        })
    })

    stack.process(done)
}