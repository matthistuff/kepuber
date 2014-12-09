/**
 * A simple async queue implementation
 *
 * @module queue
 */
module.exports = function () {

    var items = [],
        running = false,
        /**
         * Creates a callback function to process the next item in the queue
         *
         * @param {Function} [done] Optional callback when queue has finished
         * @returns {Function}
         */
        next = function (done) {
            return function (err) {
                running = false

                if (!err) {
                    queue.process(done)
                } else {
                    if (done) {
                        done(err)
                    }
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
            if (running) {
                if (done) {
                    done(new Error('queue already running'))
                    return
                }
            }

            if (items.length > 0) {
                running = true
                items.shift()(next(done))
            } else {
                if (done) {
                    done()
                }
            }
        }
    }

    return queue;
}