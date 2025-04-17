const { body } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // rating is required and must be between 1-5
    body("review_rating")
      .notEmpty()
      .withMessage("Please select a rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
      
    // review text is required and must be string
    body("review_text")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Review must be at least 10 characters long")
      .isLength({ max: 1000 })
      .withMessage("Review cannot exceed 1000 characters"),
  ]
}

module.exports = validate