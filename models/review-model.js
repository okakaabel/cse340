const pool = require("../database/index")

/* *****************************
*   Add new vehicle review
* *************************** */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = "INSERT INTO reviews (inv_id, account_id, review_rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *"
    const result = await pool.query(sql, [inv_id, account_id, review_rating, review_text])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error " + error)
    return null
  }
}

/* *****************************
*   Get reviews by inventory ID
* *************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInvId error " + error)
    return []
  }
}

/* *****************************
*   Get reviews by account ID
* *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year
      FROM reviews r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
    return []
  }
}

/* *****************************
*   Get review by ID
* *************************** */
async function getReviewById(review_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year
      FROM reviews r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.review_id = $1
    `
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("getReviewById error " + error)
    return null
  }
}

/* *****************************
*   Update review
* *************************** */
async function updateReview(review_id, review_rating, review_text) {
  try {
    const sql = `
      UPDATE reviews
      SET review_rating = $1, review_text = $2
      WHERE review_id = $3
      RETURNING *
    `
    const result = await pool.query(sql, [review_rating, review_text, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error " + error)
    return null
  }
}

/* *****************************
*   Delete review
* *************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rowCount
  } catch (error) {
    console.error("deleteReview error " + error)
    return 0
  }
}

/* *****************************
*   Get average rating by inventory ID
* *************************** */
async function getAverageRatingByInvId(inv_id) {
  try {
    const sql = `
      SELECT AVG(review_rating) AS average_rating, COUNT(*) AS review_count
      FROM reviews
      WHERE inv_id = $1
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAverageRatingByInvId error " + error)
    return { average_rating: 0, review_count: 0 }
  }
}

/* *****************************
*   Check if user already reviewed this vehicle
* *************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = "SELECT review_id FROM reviews WHERE inv_id = $1 AND account_id = $2"
    const result = await pool.query(sql, [inv_id, account_id])
    return result.rowCount > 0 ? result.rows[0].review_id : null
  } catch (error) {
    console.error("checkExistingReview error " + error)
    return null
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
  getAverageRatingByInvId,
  checkExistingReview
}