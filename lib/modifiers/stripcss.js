const queue = require('../queue');

module.exports = function (book, modifierDone) {
    const q = queue();

    book.styles.forEach(function (item) {
        q.push(function (done) {
            item.write('');
            done();
        });
    });

    q.process(modifierDone);
};
