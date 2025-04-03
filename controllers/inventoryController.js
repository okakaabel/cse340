const invModel = require("../models/inventorymodel");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (!data || data.length === 0) {
      throw new Error("No vehicles found for this classification");
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    if (isNaN(inv_id)) {
      throw new Error("Invalid inventory ID");
    }
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      throw new Error("Vehicle not found");
    }
    const detailHTML = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;