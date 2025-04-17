const pool = require("../database/index")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account data on id (desired output == 1)
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4',
      [account_firstname, account_lastname, account_email, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("updateaccountinfo error " + error)
    return 0
  }
}

/* *****************************
* Change account password on account_id (desired output == 1)
* ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id = $2',
      [account_password, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("changeaccountpassword error " + error)
    return 0
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  getAccountById,
  updateAccount, 
  updatePassword 
}