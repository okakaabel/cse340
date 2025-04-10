const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { validationResult } = require("express-validator");
const ticketModel = require("../models/supportTicket-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  try {let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })} catch {
    console.error("Error in buildRegistration:", err);
    next(err);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
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
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    return res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Validate input
  if (!account_email || !account_password) {
    req.flash("notice", "Email and password are required.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    // Fetch account data by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(account_password, accountData.account_password);
    if (!isValidPassword) {
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    // Create JWT payload
    const payload = {
      account_id: accountData.account_id,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
      first_name: accountData.account_firstname,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    // Configure cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000, // 1 hour
      secure: process.env.NODE_ENV !== "development", // Secure in production
      sameSite: "strict", // Prevent CSRF
    };

    // Set JWT in a cookie
    res.cookie("jwt", token, cookieOptions);

    // Flash success message and redirect
    req.flash("notice", "Login successful. Welcome back!");
    return res.redirect("/account/account");
  } catch (error) {
    console.error("Login Error:", error);

    // Flash error message and redirect back to login page
    req.flash("notice", "An error occurred during login. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}


/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account Management",
    nav,
    firstName: res.locals.account_firstname,
    accountType: res.locals.account_type,
    errors: null,
  });
}

async function buildUpdateView(req, res, next) {
  console.log("res.locals.accountData:", res.locals.accountData);
  console.log("res.locals.loggedIn:", res.locals.loggedIn);

  try {
    let nav = await utilities.getNav();
    const accountEmail = res.locals.accountData?.account_email;

    if (!accountEmail) {
      req.flash("notice", "Account email not found. Please log in.");
      return res.redirect("/account/login");
    }

    const account = await accountModel.getAccountByEmail(accountEmail);

    if (!account) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    res.render("account/update", {
      title: "Update Account",
      nav,
      locals: account,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildUpdateView:", error);
    next(error);
  }
}



/* ****************************************
 *  Update account info and rebuild update account info page
 * ************************************ */
async function updateAccount(req, res, next) {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      errors: errors.array(),
      locals: req.body,
      nav,
    });
  }

  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccountById(
      parseInt(account_id),
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Account update failed. Please try again.");
      res.status(500).redirect("/account/update");
    }
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("notice", "An error occurred while updating the account. Please try again.");
    res.status(500).redirect("/account/update");
  }
}

/* ****************************************
 *  Change passwork logic
 * ************************************ */
async function changePassword(req, res, next) {
  const { new_password, account_id } = req.body;
  const hashedPassword = await bcrypt.hash(new_password, 10);
  await accountModel.updatePassword(account_id, hashedPassword);
  res.redirect("/account");
}

/* ***************************
 *  Render Ticket Submission View
 * ************************** */
async function buildSubmitTicketView(req, res) {
    try {
        const nav = await utilities.getNav();
        res.render("account/tickets", {
            title: "Submit a Ticket",
            nav,
            errors: null,
            flash: req.flash(),
        });
    } catch (error) {
        console.error("Error rendering ticket submission view:", error);
        req.flash("error", "Unable to load the page.");
        res.redirect("/account");
    }
}

/* ***************************
 *  Submit a New Ticket
 * ************************** */
async function submitTicket(req, res) {
    const { title, description, priority } = req.body;
    const accountId = res.locals.accountData.account_id;

    try {
        await ticketModel.createTicket(accountId, title, description, priority);
        req.flash("notice", "Your ticket has been submitted.");
        res.redirect("/account/myTickets");
    } catch (error) {
        console.error("Error submitting ticket:", error);
        req.flash("error", "Failed to submit ticket.");
        const nav = await utilities.getNav();
        res.render("account/tickets", {
            title: "Submit a Ticket",
            nav,
            errors: null,
            flash: req.flash(),
        });
    }
}

/* ***************************
 *  Render User Tickets View
 * ************************** */
async function buildUserTicketsView(req, res) {
    const accountId = res.locals.accountData.account_id;
    const nav = await utilities.getNav();
    const tickets = await ticketModel.getUserTickets(accountId);

    res.render("account/manageTicket", {
        title: "My Tickets",
        nav,
        tickets,
        user: res.locals.accountData,
        flash: req.flash(),
    });
}

/* ***************************
 *  Render Admin Tickets View
 * ************************** */
async function buildAdminTicketsView(req, res) {
    const nav = await utilities.getNav();
    const tickets = await ticketModel.getAllTickets();

    res.render("/account/manageTicket", {
        title: "Manage Tickets",
        nav,
        tickets,
        user: res.locals.accountData,
        flash: req.flash(),
    });
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccount, 
  buildUpdateView, updateAccount, changePassword, buildSubmitTicketView, submitTicket, buildUserTicketsView, buildAdminTicketsView }