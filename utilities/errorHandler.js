module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("errors/500", { title: "500 - Server Error" });
};
