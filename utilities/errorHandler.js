function errorHandler(err, req, res, next) {
    console.error(err.stack);
    if (err.status === 404) {
        res.status(404).render("errors/404");
    } else {
        res.status(500).render("errors/500");
    }
}

module.exports = errorHandler;
