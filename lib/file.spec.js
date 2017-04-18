const test = require('ava'),
    sinon = require('sinon'),
    fs = require('fs'),
    file = require('./file');

test.afterEach.always(() => {
    ['readFile', 'writeFile', 'unlink'].forEach(method => {
        if (typeof fs[method].restore === 'function') {
            fs[method].restore();
        }
    });
});

test('file should read files from the disk', t => {
    sinon.stub(fs, 'readFile');

    const f = file('myFile.txt');

    f.read(function (err, contents) {
        t.is(err, null);
        t.is('myFile', contents);
    });

    fs.readFile.callArgWith(2, null, 'myFile');
});

test('file should return the content directly for already opened files', t => {
    sinon.stub(fs, 'readFile');
    sinon.stub(fs, 'writeFile');

    const f = file('myFile.txt');

    f.read(function (err, contents) {
        t.is(contents, 'myFile');

        f.write('myNewFile');

        fs.readFile.reset();

        f.read(function (err, contents) {
            t.true(fs.readFile.notCalled);
            t.is(contents, 'myNewFile');
        });
    });

    fs.readFile.callArgWith(2, null, 'myFile');
});

test('file should write files to the disk', t => {
    sinon.stub(fs, 'writeFile');

    const f = file('myFile.txt');

    fs.writeFile.callsArgWith(3, null);

    f.write('myTest');
    f.persist(function (err) {
        t.is(err, null);
    });
});

test('file should not write opened or modified files to disk', t => {
    sinon.spy(fs, 'writeFile');

    const f = file('myFile.txt');

    f.persist(function (err) {
        t.is(err, null);
        t.true(fs.writeFile.notCalled);
    });
});

test('file should destroy files on the disk', t => {
    sinon.stub(fs, 'unlink');

    const f = file('myFile.txt');

    f.destroy(function (err) {
        t.is(err, null);
    });

    fs.unlink.callArgWith(1, null);
});
