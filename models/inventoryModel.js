const pool = require("../database/db");

const getVehicleDetails = (vehicleId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM vehicles WHERE inventory_id = ?';
        db.query(query, [vehicleId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Vehicle not found.'));
            resolve(results[0]);  // Resolve with the first result (should be one vehicle)
        });
    });
};

module.exports = {
    getVehicleDetails
};