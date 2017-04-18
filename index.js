const tmp = require('tmp'),
    zip = require('./lib/zip'),
    epub = require('./lib/epub'),
    queue = require('./lib/queue'),
    maybe = require('./lib/maybe'),

    init = function (root, cleanup, callback) {
        return function (err) {
            if (err) {
                throw err;
            }

            const book = epub(root),
                modifiers = queue(1),
                runner = function (callable) {
                    return function (done) {
                        callable(book, done);
                    };
                },
                thrower = function (success, error) {
                    return function (err) {
                        if (err) {
                            if (error) {
                                error(err);
                            }
                            throw err;
                        }
                        success();
                    };
                },

                instance = {
                    use: function (callable) {
                        modifiers.push(runner(callable));

                        return instance;
                    },
                    save: function (file, done) {
                        done = maybe(done);

                        modifiers.process(thrower(function () {

                            book.persist(thrower(function () {

                                zip.compress(root, file, thrower(function () {
                                    cleanup();
                                    done();
                                }));

                            }));

                        }));
                    }
                };

            callback(instance);
        };
    };

module.exports = function (input, callback) {
    tmp.dir({unsafeCleanup: true, mode: parseInt('0750', 8)}, function (err, path, cleanup) {
        if (err) {
            throw err;
        }

        zip.extract(input, path, init(path, cleanup, callback));
    });
};
