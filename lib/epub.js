const util = require('util'),
    glob = require('glob'),
    file = require('./file'),
    queue = require('./queue');

module.exports = function (root) {
    const path = function (string) {
            return util.format('%s/%s', root, string);
        },
        all = function (pattern) {
            return glob.sync(path(pattern), {nocase: true}).map(function (item) {
                return file(item);
            });
        },

        index = all('**/*.opf'),
        files = all('**/*.{htm,html,xhtml}'),
        styles = all('**/*.css'),
        fonts = all('**/*.{ttf,otf,woff}');

    return {
        root: root,
        index: index,
        files: files,
        styles: styles,
        fonts: fonts,
        persist: function (done) {
            const q = queue();

            [].concat(index, files, styles).forEach(function (item) {
                q.push(function (next) {
                    item.persist(next);
                });
            });

            q.process(done);
        }
    };
};
