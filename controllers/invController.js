// Update for the vehicle detail view route
async function vehicleDetailView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);
    const nav = await utilities.getNav();

    // Fetch vehicle data from model
    const itemData = await invModel.getDetailByVehicleId(inv_id);
    
    if (!itemData) {
      return next(new Error('Vehicle not found'));
    }

    // Format the price and mileage
    itemData.inv_price = formatPrice(itemData.inv_price);
    itemData.inv_miles = formatMileage(itemData.inv_miles);

    // Use the utility function to build vehicle page HTML
    const vehicleHTML = await utilities.buildVehiclePage(itemData);

    res.render('inventory/detail', {
      title: `${itemData.inv_make} ${itemData.inv_model} Details`,
      nav,
      vehicleHTML,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

// Format price to include commas and currency symbol
function formatPrice(price) {
  return "$" + new Intl.NumberFormat("en-US").format(price);
}

// Format mileage to include commas
function formatMileage(mileage) {
  return new Intl.NumberFormat("en-US").format(mileage) + " miles";
}

module.exports = {
  vehicleDetailView,
};
