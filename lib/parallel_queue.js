var maybe = require('./maybe')

/**
 * A simple async parallel queue implementation
 *
 * @module parallel_queue
 */
module.exports = function () {

    var items = [],
        running = 0,
        /**
         * Creates a callback function to indicate a complete thread
         *
         * @param {Function} [done] Optional callback when queue has finished
         * @returns {Function}
         */
        next = function (done) {
            return function (err) {
                running -= 1

                if (!err) {
                    queue.process(done)
                } else {
                    done(err)
                }
            }
        }

    var queue = {
        /**
         * Adds an item to the queue
         *
         * @param {Function} func
         */
        push: function (func) {
            items.push(func)
        },
        /**
         * Starts processing the queue
         *
         * @param {Function} [done] Optional callback when queue has finished
         */
        process: function (done) {
            done = maybe(done)

            while (items.length) {
                running += 1
                items.shift()(next(done))
            }

            if (running === 0) {
                done()
            }
        }
    }

    return queue;
}