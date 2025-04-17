const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
    })
  }

/* ****************************************
*  Deliver Account Management View
* *************************************** */
async function accountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const message = req.flash("notice"); 
  const errors = req.flash("errors"); 

  // Check if the user is logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    message,
    errors,
    accountData: res.locals.accountData
  });
}

/* ****************************************
*  Deliver Account Update View
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  
  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/");
  }
  
  // Check if the logged-in user matches the requested account
  if (res.locals.accountData.account_id !== account_id) {
    req.flash("notice", "Access denied.");
    return res.redirect("/account/");
  }
  
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  
  // Check if email already exists and belongs to someone else
  if (req.body.account_email != res.locals.accountData.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      req.flash("notice", "Email already exists. Please use a different email.");
      return res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  }
  
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  
  if (updateResult) {
    // Get updated account data
    const updatedAccountData = await accountModel.getAccountById(account_id);
    
    // Update JWT with new information
    delete updatedAccountData.account_password;
    const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }
    
    req.flash("notice", "Account information updated successfully.");
  } else {
    req.flash("notice", "Failed to update account information.");
  }
  
  return res.redirect("/account/");
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  
  // Hash the password
  let hashedPassword;
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "There was an error processing your request.");
    return res.status(500).redirect("/account/update/" + account_id);
  }
  
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id);
  
  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
  } else {
    req.flash("notice", "Failed to update password.");
  }
  
  return res.redirect("/account/");
}

/* ****************************************
*  Process Account Logout
* *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  return res.redirect("/");
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

module.exports = { 
  buildLogin, 
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  buildAccountUpdate,
  updateAccount,
  updatePassword,
  accountLogout
}