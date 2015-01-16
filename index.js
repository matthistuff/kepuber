var tmp = require('tmp'),
    zip = require('./lib/zip'),
    epub = require('./lib/epub'),
    queue = require('./lib/queue'),

    init = function (root, cleanup, callback) {
        return function (err) {
            if (err) {
                throw err
            }

            var book = epub(root),
                modifiers = queue(),
                runner = function (callable) {
                    return function (done) {
                        callable(book, done)
                    }
                },
                thrower = function (success, error) {
                    return function (err) {
                        if (err) {
                            if (error) {
                                error(err)
                            }
                            throw err
                        }
                        success()
                    }
                },

                instance = {
                    use: function (callable) {
                        modifiers.push(runner(callable))

                        return instance
                    },
                    save: function (file, done) {
                        modifiers.process(thrower(function () {

                            book.persist(thrower(function () {

                                zip.compress(root, file, thrower(function () {
                                    cleanup()
                                    if (done) {
                                        done()
                                    }
                                }))

                            }))

                        }))
                    }
                }

            callback(instance)
        }
    }

module.exports = function (input, callback) {
    tmp.dir({unsafeCleanup: true, mode: 0750}, function (err, path, cleanup) {
        if (err) {
            throw err
        }

        zip.extract(input, path, init(path, cleanup, callback))
    });
}