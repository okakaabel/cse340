const express = require("express");
const router = express.Router();
const utilities = require("../utilities");

// Route to trigger 500 error
router.get("/trigger-error", utilities.handleErrors(async (req, res, next) => {
  throw new Error("Intentional 500 Error - Test Error Handling");
}));

module.exports = router;