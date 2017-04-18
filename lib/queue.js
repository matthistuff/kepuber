const maybe = require('./maybe');

/**
 * A simple async concurrent queue implementation
 *
 * @module queue
 */
module.exports = function (concurrency) {
    /*istanbul ignore if*/
    if (!concurrency) {
        concurrency = 4;
    }

    let items = [],
        currRunning = 0,
        terminated = false;

    /**
     * Create a callback function to indicate completion of a thread thread
     *
     * @param {Function} [done] Optional callback when queue has finished
     * @returns {Function}
     */
    const next = function (done) {
            return function (err) {
                currRunning -= 1;

                if (!err) {
                    queue.process(done);
                } else {
                    done(err);
                }
            };
        },
        queue = {
            /**
             * Add item to the processing queue
             *
             * @param {Function} func
             */
            push: function (func) {
                items.push(func);
            },
            /**
             * Start processing the queue
             *
             * @param {Function} [done] Optional callback when queue has finished
             */
            process: function (done) {
                done = maybe(done);

                while (items.length && currRunning < concurrency) {
                    currRunning += 1;
                    items.shift()(next(done));
                }

                if (items.length === 0 && currRunning === 0 && !terminated) {
                    terminated = true;
                    done();
                }
            }
        };

    return queue;
};
