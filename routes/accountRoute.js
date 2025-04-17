const regValidate = require('../utilities/accountValidation')
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const express = require("express")
const router = new express.Router()

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginValidationRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management route - requires login to access
router.get(
  "/",
  utilities.checkLogin,  // Use checkLogin instead of checkLoginData
  utilities.handleErrors(accountController.accountManagement)
)

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,  // Use checkLogin instead of checkLoginData
  regValidate.passwordValidationRule(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Process account information update
router.post(
  "/update",
  utilities.checkLogin,  // Use checkLogin instead of checkLoginData
  regValidate.accountUpdateRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,  // Use checkLogin instead of checkLoginData
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Process logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router