const utilities = require("../utilities"); // Make sure utilities.js is at the correct path
const baseController = {}

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav() // Ensure utilities.getNav() exists and works fine
  res.render("index", {
    title: "Home",
    nav,
    errors: null
  });
}

module.exports = baseController;
