// inventoryModel.js

const db = require('../database'); // Import the pool from database.js

// Example function to get all vehicles
async function getAllVehicles() {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM vehicles');
    return rows;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to be handled elsewhere
  }
}

module.exports = {
  getAllVehicles,
};
