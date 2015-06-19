var util = require('util'),
    glob = require('glob'),
    file = require('./file'),
    queue = require('./parallel_queue')

module.exports = function (root) {
    var path = function (string) {
            return util.format('%s/%s', root, string)
        },
        all = function (pattern) {
            return glob.sync(path(pattern), {nocase: true}).map(function (item) {
                return file(item)
            })
        },

        index = all('{ops,oebps}/*.opf'),
        files = all('**/*.{htm,html,xhtml}'),
        styles = all('**/*.css'),
        fonts = all('**/*.{ttf,otf,woff}')

    return {
        root: root,
        index: index,
        files: files,
        styles: styles,
        fonts: fonts,
        persist: function (done) {
            var stack = queue(),
                allFiles = [].concat(index, files, styles).forEach(function (item) {
                    stack.push(function (next) {
                        item.persist(next)
                    })
                })

            stack.process(done)
        }
    }
}