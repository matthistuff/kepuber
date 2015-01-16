module.exports = function (func) {
    if (func) {
        return func
    }

    return function () {
    }
}