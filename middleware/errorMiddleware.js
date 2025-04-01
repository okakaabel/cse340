const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong! Please try again later." });
};

module.exports = errorHandler;
