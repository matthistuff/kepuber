let index = 1;
const util = require('util'),
    queue = require('../queue'),
    reg = /<(h\d|p)([^>]*)>/gi,
    replacer = function (match, tag, attributes) {
        if (attributes && attributes.indexOf('id=') !== -1) {
            return match;
        }
        if (!attributes) {
            attributes = '';
        }

        attributes += util.format(' id="kobo.%s.1"', index);
        index += 1;

        return util.format('<%s%s>', tag, attributes);
    },
    annotate = function (item, done) {
        return function (err, data) {
            if (!err) {
                item.write(data.replace(reg, replacer));
            }
            done();
        };
    };

module.exports = function (book, modifierDone) {
    const q = queue();

    book.files.forEach(function (item) {
        q.push(function (done) {
            item.read(annotate(item, done));
        });
    });

    q.process(modifierDone);
};
