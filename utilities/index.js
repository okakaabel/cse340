const invModel = require("../models/inventoryModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building navigation:", error.message);
    throw new Error("Could not retrieve classifications.");
  }
};

/* **************************************
 * Middleware For Handling Errors
 ************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.loggedIn = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.accountData = decoded;
    res.locals.loggedIn = true;
    res.locals.firstName = decoded.first_name;
    res.locals.accountType = decoded.account_type;
    return next();
  } catch (err) {
    req.flash("notice", "Session expired or invalid. Please log in again.");
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware to check login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
