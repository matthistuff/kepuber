/*global expect, sinon, describe, it, before, beforeEach*/
var rewire = require('rewire'),
    file = rewire('../lib/file')

describe('File helper', function () {
    var fs = {
        readFile: sinon.stub(),
        writeFile: sinon.stub(),
        unlink: sinon.stub()
    }

    before(function () {
        file.__set__('fs', fs)
    })

    beforeEach(function () {
        fs.readFile.reset()
        fs.writeFile.reset()
        fs.unlink.reset()
    })

    it('should read files from the disk', function (done) {
        var f = file('myFile.txt')

        f.read(function (err, contents) {
            expect(err).to.be.null
            expect(contents).to.equal('myFile')

            done()
        })

        fs.readFile.callArgWith(2, null, 'myFile')
    })

    it('should set the content of the file', function (done) {
        var f = file('myFile.txt')

        f.write('myTest')

        f.read(function (err, contents) {
            expect(contents).to.equal('myTest')
            done()
        })
    })

    it('should return the content directly for already opened files', function (done) {
        var f = file('myFile.txt')

        f.read(function (err, contents) {
            expect(contents).to.equal('myFile')

            f.write('myNewFile')

            fs.readFile.reset()

            f.read(function (err, contents) {
                expect(fs.readFile).to.not.have.been.called
                expect(contents).to.equal('myNewFile')

                done()
            })
        })

        fs.readFile.callArgWith(2, null, 'myFile')
    })

    it('should write files to the disk', function (done) {
        var f = file('myFile.txt')

        fs.writeFile.callsArgWith(3, null)

        f.write('myTest')
        f.persist(function (err) {
            expect(err).to.be.null

            done()
        })
    })

    it('should not write opened or modified files to disk', function (done) {
        var f = file('myFile.txt')

        f.persist(function (err) {
            expect(err).to.be.null
            expect(fs.writeFile).to.not.have.been.called

            done()
        })
    })

    it('should destroy files on the disk', function (done) {
        var f = file('myFile.txt')

        f.destroy(function (err) {
            expect(err).to.be.null

            done()
        })

        fs.unlink.callArgWith(1, null)
    })
})