const test = require('ava'),
    maybe = require('./maybe');

test('maybe helper should expose a function', t => {
    t.is(typeof maybe, 'function');
});

test('maybe helper should return the same function it gets passed', t => {
    const f = function () {
    };

    t.is(maybe(f), f);
});

test('maybe helper should return an anonymous function if it isn\'t passed one', t => {
    const f = maybe(undefined);

    t.is(typeof f, 'function');
    t.is(f(), undefined);
});
