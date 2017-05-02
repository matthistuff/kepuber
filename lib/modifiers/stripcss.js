const queue = require('../queue'),
    reg = /\s*<link[^>]*type="text\/css"[^>]*\/>\n?/gi,
    indexreg = /\s*<item.+text\/css.+\/>\n?/gi,
    replace = function (item, done) {
        return function (err, data) {
            if (!err) {
                item.write(data.replace(reg, ''));
            }
            done();
        };
    };

module.exports = function (book, modifierDone) {
    const q = queue();

    book.styles.forEach(function (item) {
        q.push(function (done) {
            item.destroy(done);
        });
    });

    book.files.forEach(function (item) {
        q.push(function (done) {
            item.read(replace(item, done));
        });
    });

    book.index.forEach(function (item) {
        q.push(function (done) {
            item.read(function (err, data) {
                item.write(data.replace(indexreg, ''));
                done();
            });
        });
    });

    q.process(modifierDone);
};
