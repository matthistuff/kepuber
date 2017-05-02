const test = require('ava'),
    file = require('../file'),
    annotator = require('./annotator');

function createBook(content) {
    const f = file('test');

    f.write(content);

    return {
        files: [
            f
        ]
    };
}

test('annotator should add ids to hx and p', t => {
    const book = createBook(`<h1></h1><h2 id="h2id"></h2><p></p>`);

    annotator(book, function () {
        book.files[0].read(function (err, content) {
            t.is(content, '<h1 id="kobo.1.1"></h1><h2 id="h2id"></h2><p id="kobo.2.1"></p>');
        });
    });
});

