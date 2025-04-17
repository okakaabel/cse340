// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.checkAuthorization, utilities.handleErrors(invController.buildManagement))
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by single vehicle view
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

//inventory controller to process the route and return the data as JSON.
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id", invController.editInventoryView, utilities.handleErrors);

// To handle the incoming request.
router.post("/update/", invController.updateInventory)

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Routes for inventory management
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;