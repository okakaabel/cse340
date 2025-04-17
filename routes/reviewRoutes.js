// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/review-controller")
const reviewValidate = require("../utilities/review-validation")
const utilities = require("../utilities")

// Route to display reviews for a specific vehicle
router.get("/vehicle/:invId", utilities.handleErrors(reviewController.displayReviews))

// Route to display the add review form
router.get("/add/:invId", utilities.checkLogin, utilities.handleErrors(reviewController.displayAddReviewForm))

// Route to process the add review form
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  utilities.handleErrors(reviewController.addReview)
)

// Route to display the edit review form
router.get("/edit/:reviewId", utilities.checkLogin, utilities.handleErrors(reviewController.displayEditReviewForm))

// Route to process the edit review form
router.post(
  "/edit",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  utilities.handleErrors(reviewController.updateReview)
)

// Route to process deleting a review
router.get("/delete/:reviewId", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview))

// Route to display user's reviews in account section
router.get("/user", utilities.checkLogin, utilities.handleErrors(reviewController.displayUserReviews))

module.exports = router