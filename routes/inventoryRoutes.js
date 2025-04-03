const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
router.get("/:id", inventoryController.getVehicleDetails);
module.exports = router;
