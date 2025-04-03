const express = require('express');
const router = express.Router();

// Ensure you're importing the controller correctly
const inventoryController = require('../controllers/inventoryController');  // Check this path

// Check the route handler and ensure you're referencing the correct function in the controller
router.get('/vehicle/:id', inventoryController.showVehicleDetails);  // Ensure this function is defined in the controller

module.exports = router;
