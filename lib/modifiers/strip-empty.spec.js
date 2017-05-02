const test = require('ava'),
    file = require('../file'),
    stripEmpty = require('./strip-empty');

function createBook(content) {
    const f = file('test');

    f.write(content);

    return {
        files: [
            f
        ]
    };
}

test('stripEmpty should remove empty a and span tags', t => {
    const book = createBook(`<p>aa<a id="abc"/></p><span id="span"/>`);

    stripEmpty(book, function () {
        book.files[0].read(function (err, content) {
            t.is(content, '<p>aa</p>');
        });
    });
});

test('stripEmpty should keep any other empty tag', t => {
    const book = createBook(`<meta name="test"/>
<link href="test"/>`);

    stripEmpty(book, function () {
        book.files[0].read(function (err, content) {
            t.is(content, `<meta name="test"/>
<link href="test"/>`);
        });
    });
});

