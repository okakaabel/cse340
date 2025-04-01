const fs = require('fs');
console.log(fs.readdirSync(__dirname));  // Log files in the current directory
const database = require('../database.js');

const invModel = {};

// Retrieve vehicle details by ID using a Prepared Statement
invModel.getVehicleById = async function (inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Database query error: ", error);
    throw error;
  }
};

module.exports = invModel;


