const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');

const showVehicleDetails = (req, res, next) => {
    const vehicleId = req.params.id;

    // Get the vehicle details using the model
    inventoryModel.getVehicleDetails(vehicleId)
        .then(vehicle => {
            // Wrap the vehicle information in HTML using utility function
            const vehicleHtml = utilities.buildVehicleHtml(vehicle);
            res.render('inventory/vehicle-detail', { 
                title: `${vehicle.make} ${vehicle.model}`,
                vehicleHtml: vehicleHtml,
                vehicle: vehicle
            });
        })
        .catch(error => {
            next(error);  // Pass the error to the error handler middleware
        });
};

module.exports = {
    showVehicleDetails
};
