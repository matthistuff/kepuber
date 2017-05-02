const queue = require('../queue'),
    reg = /<(a|span|p)+[^>]*\/>/gi,
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

    book.files.forEach(function (item) {
        q.push(function (done) {
            item.read(replace(item, done));
        });
    });

    q.process(modifierDone);
};
