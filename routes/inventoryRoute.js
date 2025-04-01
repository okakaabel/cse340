const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const errorController = require("../controllers/errorController");

// Define the route for vehicle detail view
router.get("/inv/detail/:inv_id", invController.vehicleDetailView);

// Footer error handling route
router.get("/trigger-error", errorController.triggerError);

module.exports = router;
