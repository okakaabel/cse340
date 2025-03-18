const { body, validationResult } = require("express-validator");
const utilities = require("../utilities")
const { getClassifications } = require("../models/inventory-model");
/**
 * Validation rules for new inventory
 */
const newInventoryRules = () => [
  body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be at least 3 characters."),
  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be at least 3 characters."),
  body("inv_year")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Invalid year."),
  body("inv_description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters."),
  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a non-negative integer."),
  body("inv_color")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters."),
];

/**
 * Middleware to check data for new inventory
 */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const classifications = await getClassifications();
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      classifications: classifications.rows,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/**
 * Middleware to check data for updating inventory
 */
const checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      try {
        const classifications = await getClassifications();
        let nav = await utilities.getNav()
        return res.render("./inventory/edit-inventory", {
          title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
          nav,
          classifications: classifications.rows,
          errors: errors.array(),
          inv_id: req.body.inv_id,
          ...req.body,
        });
      } catch (err) {
        console.error("Error in checkUpdateData:", err);
        req.flash("notice", "An error occurred while fetching classifications.");
        res.redirect(`/inv/edit/${req.body.inv_id}`);
      }
    } else {
      next();
    }
  };

module.exports = { newInventoryRules, checkInventoryData, checkUpdateData };