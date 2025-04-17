const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/** Build a single vehicle inventory */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const vehicle = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();
  const VehicleMake = data[0].inv_make;
  const VehicleModel = data[0].inv_model;
  const VehicleYear = data[0].inv_year;

  res.render("./inventory/vehicle", {
    title: VehicleYear + " " + VehicleMake + " " + VehicleModel,
    nav: nav,
    vehicle: vehicle,
    inv_id: inv_id,
  });
};

/* ***************************
/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect, // I have added this line
    errors: null,
  });
};

invCont.buildManagementView = async function (req, res, next){
  let nav = await utilities.getNav()
  
  // Add this line to create the classification select list
  const classificationSelect = await utilities.buildClassificationList()
  
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect, // Add this to pass the select list to the view
    errors: null,
  })
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    );
    let nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the addition failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Deliver add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classifications,
    errors: null,
  });
};


/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;

  const inventoryResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (inventoryResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the addition failed.");
    let classifications = await utilities.buildClassificationList(classification_id);
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classifications,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
module.exports = invCont;