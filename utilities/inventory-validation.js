const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string with no spaces or special characters
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name cannot contain spaces or special characters.")
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification name already exists. Please use a different name.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),
      
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid vehicle make."),
      
    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid vehicle model."),
      
    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle description."),
      
    // inv_image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),
      
    // inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),
      
    // inv_price is required and must be numeric
    body("inv_price")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid price."),
      
    // inv_year is required and must be numeric
    body("inv_year")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid year."),
      
    // inv_miles is required and must be numeric
    body("inv_miles")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide valid mileage."),
      
    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid color."),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classifications,
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
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data for updating and return errors or continue to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
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
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classificationSelect,
      inv_id,
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
    })
    return
  }
  next()
}

module.exports = validate