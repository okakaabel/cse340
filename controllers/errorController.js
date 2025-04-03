function triggerError(req, res, next) {
    next(new Error("Intentional Server Error"));
}
module.exports = { triggerError };
