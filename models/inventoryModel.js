const pool = require("../database/db-sql-code");
async function getVehicleById(id) {
    try {
        const result = await pool.query("SELECT * FROM inventory WHERE inventory_id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        throw error;
    }
}
module.exports = { getVehicleById };
