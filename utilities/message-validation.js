const accountModel = require("../models/account-model")
// const messageModel = require("../models/message-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Message Validation Rules
 * ********************************* */
validate.messageRules = () => {
  return [
    body("message_to")
    .trim()
    .isNumeric()
    .withMessage('Please select a recipient'),

    body("message_subject")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Subject must be longer than 3 characters"),

    body("message_body")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please include a message"),
  ]
}

/* ******************************
 * Check message data and return errors or continue to inbox
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
  const { message_to, message_from, message_subject, message_body } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let accountSelect = await utilities.getAccountSelect(message_to)
    res.render("./inbox/sendmessage", {
      errors,
      title: "New Message",
      nav,
      accountSelect, 
      message_from, 
      message_subject, 
      message_body
    })
    return
  }
  next()
}

/*  **********************************
 *  Add Reply Validation Rules
 * ********************************* */
validate.replyRules = () => {
  return [
    body("reply_message")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please include a message"),
  ]
}

/* ******************************
 * Check message data and return errors or continue to inbox
 * ***************************** */
validate.checkReplyData = async (req, res, next) => {
  const { message_to, message_from, message_subject, message_body, reply_message } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let fromAccount = await accountModel.getAccountById(message_from)
    res.render("./inbox/replymessage", {
      errors,
      title: "Reply",
      nav,
      account_firstname: fromAccount.account_firstname,
      account_lastname: fromAccount.account_lastname,
      message_to,
      message_from,
      message_subject, 
      message_body,
      reply_message,
    })
    return
  }
  next()
}

module.exports = validate