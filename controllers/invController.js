const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities/index");
async function getVehicleDetails(req, res, next) {
    try {
        const vehicle = await inventoryModel.getVehicleById(req.params.id);
        if (!vehicle) {
            return res.status(404).render("errors/404", { title: "Vehicle Not Found" });
        }
        const vehicleHTML = utilities.buildVehicleHTML(vehicle);
        res.render("inventory/detail", { title: `${vehicle.make} ${vehicle.model}`, vehicleHTML });
    } catch (error) {
        next(error);
    }
}
module.exports = { getVehicleDetails };
