// Database function to fetch vehicle details by ID
async function getDetailByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // Returns a single vehicle record
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    throw error;
  }
}

module.exports = { getDetailByVehicleId, ...otherMethods };
