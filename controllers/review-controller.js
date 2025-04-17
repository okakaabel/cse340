const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")
const reviewValidate = require("../utilities/review-validation")

const reviewCont = {}

/* ***************************
 *  Display reviews for a vehicle
 * ************************** */
reviewCont.displayReviews = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  if (!vehicleData[0]) {
    req.flash("notice", "That vehicle doesn't exist.")
    return res.redirect("/inv")
  }
  
  const reviews = await reviewModel.getReviewsByInvId(inv_id)
  const ratingData = await reviewModel.getAverageRatingByInvId(inv_id)
  const nav = await utilities.getNav()
  const vehicle = vehicleData[0]
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  
  // Check if user has already reviewed this vehicle
  let userReview = null
  if (res.locals.accountData) {
    const existingReviewId = await reviewModel.checkExistingReview(inv_id, res.locals.accountData.account_id)
    if (existingReviewId) {
      userReview = await reviewModel.getReviewById(existingReviewId)
    }
  }
  
  res.render("reviews/vehicle-reviews", {
    title: `Reviews for ${vehicleName}`,
    nav,
    vehicle,
    reviews,
    averageRating: parseFloat(ratingData.average_rating || 0).toFixed(1),
    reviewCount: ratingData.review_count,
    userReview,
    errors: null,
  })
}

/* ***************************
 *  Display add review form
 * ************************** */
reviewCont.displayAddReviewForm = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  if (!vehicleData[0]) {
    req.flash("notice", "That vehicle doesn't exist.")
    return res.redirect("/inv")
  }
  
  // Check if user is logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to leave a review.")
    return res.redirect(`/account/login`)
  }
  
  // Check if user has already reviewed this vehicle
  const existingReviewId = await reviewModel.checkExistingReview(inv_id, res.locals.accountData.account_id)
  if (existingReviewId) {
    req.flash("notice", "You have already reviewed this vehicle. You can edit your review instead.")
    return res.redirect(`/reviews/vehicle/${inv_id}`)
  }
  
  const nav = await utilities.getNav()
  const vehicle = vehicleData[0]
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  
  res.render("reviews/add-review", {
    title: `Review ${vehicleName}`,
    nav,
    vehicle,
    inv_id,
    errors: null,
  })
}

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  const { inv_id, review_rating, review_text } = req.body
  const account_id = res.locals.accountData.account_id
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  // Process validation results
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const vehicle = vehicleData[0]
    const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    
    return res.render("reviews/add-review", {
      title: `Review ${vehicleName}`,
      nav,
      vehicle,
      inv_id,
      review_rating,
      review_text,
      errors: errors.array(),
    })
  }
  
  // Add the review
  const result = await reviewModel.addReview(inv_id, account_id, review_rating, review_text)
  
  if (result) {
    req.flash("notice", "Your review has been added.")
    res.redirect(`/reviews/vehicle/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, there was an error adding your review.")
    res.redirect(`/reviews/add/${inv_id}`)
  }
}

/* ***************************
 *  Display edit review form
 * ************************** */
reviewCont.displayEditReviewForm = async function (req, res, next) {
  const review_id = parseInt(req.params.reviewId)
  const review = await reviewModel.getReviewById(review_id)
  
  if (!review) {
    req.flash("notice", "That review doesn't exist.")
    return res.redirect("/account")
  }
  
  // Check if user is logged in and owns the review
  if (!res.locals.accountData || res.locals.accountData.account_id !== review.account_id) {
    req.flash("notice", "You don't have permission to edit this review.")
    return res.redirect(`/reviews/vehicle/${review.inv_id}`)
  }
  
  const nav = await utilities.getNav()
  const vehicleName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
  
  res.render("reviews/edit-review", {
    title: `Edit Review for ${vehicleName}`,
    nav,
    review,
    errors: null,
  })
}

/* ***************************
 *  Process edit review
 * ************************** */
reviewCont.updateReview = async function (req, res) {
  const { review_id, review_rating, review_text } = req.body
  const review = await reviewModel.getReviewById(review_id)
  
  // Check if user owns the review
  if (!res.locals.accountData || res.locals.accountData.account_id !== review.account_id) {
    req.flash("notice", "You don't have permission to edit this review.")
    return res.redirect(`/reviews/vehicle/${review.inv_id}`)
  }
  
  // Process validation results
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const vehicleName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
    
    return res.render("reviews/edit-review", {
      title: `Edit Review for ${vehicleName}`,
      nav,
      review: {
        ...review,
        review_rating,
        review_text,
      },
      errors: errors.array(),
    })
  }
  
  // Update the review
  const result = await reviewModel.updateReview(review_id, review_rating, review_text)
  
  if (result) {
    req.flash("notice", "Your review has been updated.")
    res.redirect(`/reviews/vehicle/${review.inv_id}`)
  } else {
    req.flash("notice", "Sorry, there was an error updating your review.")
    res.redirect(`/reviews/edit/${review_id}`)
  }
}

/* ***************************
 *  Process delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.params.reviewId)
  const review = await reviewModel.getReviewById(review_id)
  
  if (!review) {
    req.flash("notice", "That review doesn't exist.")
    return res.redirect("/account")
  }
  
  // Check if user owns the review or is admin
  const isOwner = res.locals.accountData && res.locals.accountData.account_id === review.account_id
  const isAdmin = res.locals.accountData && res.locals.accountData.account_type === "Admin"
  
  if (!isOwner && !isAdmin) {
    req.flash("notice", "You don't have permission to delete this review.")
    return res.redirect(`/reviews/vehicle/${review.inv_id}`)
  }
  
  // Delete the review
  const result = await reviewModel.deleteReview(review_id)
  
  if (result) {
    req.flash("notice", "The review has been deleted.")
    
    // Redirect to different places based on who deleted it
    if (isAdmin && !isOwner) {
      res.redirect(`/reviews/vehicle/${review.inv_id}`)
    } else {
      res.redirect("/account/reviews")
    }
  } else {
    req.flash("notice", "Sorry, there was an error deleting the review.")
    res.redirect(`/reviews/vehicle/${review.inv_id}`)
  }
}

/* ***************************
 *  Display user's reviews in account dashboard
 * ************************** */
reviewCont.displayUserReviews = async function (req, res, next) {
  // Check if user is logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to view your reviews.")
    return res.redirect("/account/login")
  }
  
  const account_id = res.locals.accountData.account_id
  const reviews = await reviewModel.getReviewsByAccountId(account_id)
  const nav = await utilities.getNav()
  
  res.render("reviews/user-reviews", {
    title: "Your Reviews",
    nav,
    reviews,
  })
}

module.exports = reviewCont