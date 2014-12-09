var util = require('util'),
    glob = require('glob'),
    file = require('./file'),
    queue = require('./queue')

module.exports = function (root) {
    var index = [],
        files = [],
        styles = [],
        fonts = [],

        all = function (pattern) {
            return glob.sync(path(pattern)).map(function (item) {
                return file(item)
            })
        },
        path = function (string) {
            return util.format('%s/%s', root, string)
        }

    index = all('OEBPS/*.opf')
    files = all('**/*.html')
    styles = all('**/*.css')
    fonts = all('**/*.{ttf,otf,woff}')

    return {
        root: root,
        index: index,
        files: files,
        styles: styles,
        fonts: fonts,
        persist: function (done) {
            var stack = queue(),
                all = [].concat(index, files, styles).forEach(function (item) {
                    stack.push(function (next) {
                        item.persist(next)
                    })
                })

            stack.process(done)
        }
    }
}