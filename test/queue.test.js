/*global describe, it*/
var expect = require('chai').expect,
    queue = require('../lib/queue')

describe('Queue', function () {
    it('should expose a factory function', function () {
        expect(queue).to.be.a('function')
    })
})