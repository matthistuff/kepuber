/*global expect, describe, it*/
var maybe = require('../lib/maybe')

describe('Maybe helper', function () {
    it('should expose a function', function () {
        expect(maybe).to.be.a('function')
    })

    it('should return the same function it gets passed', function () {
        var f = function () {
        }

        expect(maybe(f)).to.equal(f)
    })

    it('should return an anonymous function if it isn\'t passed one', function () {
        var f = maybe(undefined)

        expect(f).to.be.a('function')
        expect(f()).to.be.undefined
    })
})