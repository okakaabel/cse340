const invModel = require("../models/inventoryModel");
const Util = require("../utilities");

const invController = {};

// Vehicle Detail View Controller
invController.vehicleDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);

    if (!vehicle) {
      return res.status(404).render("error", { message: "Vehicle not found." });
    }

    res.render("detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invController;
