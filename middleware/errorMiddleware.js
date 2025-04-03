const utilities = require("../utilities");

async function handleErrors(err, req, res, next) {
  let nav;
  try {
    nav = await utilities.getNav();
  } catch (error) {
    nav = "<ul><li><a href='/'>Home</a></li></ul>";
    console.error("Error getting navigation for error page: ", error);
  }

  const statusCode = err.status || 500;
  let message = statusCode === 404 ? err.message : "Sorry, there was an unexpected server error.";

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  res.status(statusCode).render("errors/error", {
    title: `${statusCode} Error`,
    message,
    nav,
  });
}

module.exports = handleErrors;