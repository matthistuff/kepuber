/*global expect, sinon, describe, it*/
var queue = require('../../lib/queue')

describe('Queue', function () {
    var job = function (callDone) {
        var f = function (done) {
            f.done = done;

            if (callDone) {
                done()
            }
        }

        return f
    }

    it('should expose a factory function', function () {
        expect(queue).to.be.a('function')
    })

    it('should process a non concurrent queue', function () {
        var q = queue(1),
            first = job(),
            second = job(true),
            done = sinon.spy()

        sinon.spy(first)
        sinon.spy(second)

        q.push(first)
        q.push(second)

        q.process(done)

        expect(first).to.have.been.called
        expect(second).to.not.have.been.called

        first.done()

        expect(second).to.have.been.called
        expect(done).to.have.been.called
    })

    it('should process a concurrent queue', function () {
        var q = queue(2),
            first = job(),
            second = job(),
            third = job(),
            fourth = job(),
            done = sinon.spy()

        sinon.spy(first)
        sinon.spy(second)
        sinon.spy(third)
        sinon.spy(fourth)

        q.push(first)
        q.push(second)
        q.push(third)
        q.push(fourth)

        q.process(done)

        expect(first).to.have.been.called
        expect(second).to.have.been.called
        expect(third).to.not.have.been.called
        expect(fourth).to.not.have.been.called

        first.done()

        expect(third).to.have.been.called
        expect(fourth).to.not.have.been.called

        second.done()

        expect(fourth).to.have.been.called

        third.done()

        expect(done).to.not.have.been.called

        fourth.done()

        expect(done).to.not.been.called
    })

    it('should allow jobs to throw an error', function () {
        var q = queue(),
            first = job(),
            done = sinon.spy()

        q.push(first)

        q.process(done)

        first.done('error!')

        expect(done.calledWith('error!')).to.be.ok
    })
})