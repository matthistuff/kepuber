const queue = require('../queue'),
    fontfacereg = /@font-face[^}]+}\n?/gi,
    fontreg = /font-family.+;/gi,
    indexreg = /\s*<item.+application\/(x-font-woff|font-woff|vnd.ms-opentype).+\/>\n?/gi;

module.exports = function (book, modifierDone) {
    const q = queue();

    book.fonts.forEach(function (item) {
        q.push(function (done) {
            item.destroy(done);
        });
    });

    book.styles.forEach(function (item) {
        q.push(function (done) {
            item.read(function (err, data) {
                item.write(
                    data
                        .replace(fontfacereg, '')
                        .replace(fontreg, '')
                );
                done();
            });
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
