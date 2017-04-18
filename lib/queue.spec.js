const test = require('ava'),
    sinon = require('sinon'),
    queue = require('./queue'),
    job = function (callDone) {
        return function (done) {
            if (callDone) {
                done();
            } else {
                this.done = done;
            }
        };
    };

test('queue should return a function', t => {
    t.is(typeof queue, 'function');
});

test('queue should process a non concurrent queue', t => {
    const q = queue(1),
        first = sinon.spy(job()),
        second = sinon.spy(job(true)),
        done = sinon.spy();

    q.push(first.bind(first));
    q.push(second);

    q.process(done);

    t.true(first.calledOnce);
    t.true(second.notCalled);
    t.true(done.notCalled);

    first.done();

    t.true(second.calledOnce);
    t.true(done.calledOnce);
});


test('queue should process a concurrent queue', t => {
    const q = queue(2),
        first = sinon.spy(job()),
        second = sinon.spy(job()),
        third = sinon.spy(job()),
        fourth = sinon.spy(job()),
        done = sinon.spy();

    q.push(first.bind(first));
    q.push(second.bind(second));
    q.push(third.bind(third));
    q.push(fourth.bind(fourth));

    q.process(done);

    t.true(first.calledOnce);
    t.true(second.calledOnce);
    t.true(third.notCalled);
    t.true(fourth.notCalled);

    first.done();

    t.true(third.calledOnce);
    t.true(fourth.notCalled);

    second.done();

    t.true(fourth.calledOnce);

    third.done();

    t.true(done.notCalled);

    fourth.done();

    t.true(done.calledOnce);
});
