const invModel = require("../models/inventorymodel");

const Util = {};

/* *************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building navigation: ", error);
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
};

/* *************************
 * Builds classification grid
 ************************** */
Util.buildClassificationGrid = async function (data) {
  try {
    let grid = "";
    if (data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach((vehicle) => {
        grid += '<li>';
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><img src="' +
          vehicle.inv_thumbnail +
          '" alt="Image of ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += "<hr />";
        grid +=
          '<h2><a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details">' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          "</a></h2>";
        grid +=
          '<span>$' +
          new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
          "</span>";
        grid += "</div>";
        grid += "</li>";
      });
      grid += "</ul>";
    } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  } catch (error) {
    console.error("Error building classification grid: ", error);
    return '<p class="notice">Sorry, there was an error displaying vehicles.</p>';
  }
};

/* *************************
 * Builds inventory detail view
 ************************** */
Util.buildInventoryDetail = async function (data) {
  try {
    let detail = '<div class="detail-container">';
    detail += '<div class="detail-image">';
    detail +=
      '<img src="' +
      data.inv_image +
      '" alt="Image of ' +
      data.inv_make +
      " " +
      data.inv_model +
      '" />';
    detail += "</div>";
    detail += '<div class="detail-info">';
    detail += "<h2>" + data.inv_make + " " + data.inv_model + "</h2>";
    detail +=
      '<p class="price">Price: $' +
      new Intl.NumberFormat("en-US").format(data.inv_price) +
      "</p>";
    detail += '<p class="year">Year: ' + data.inv_year + "</p>";
    detail +=
      '<p class="mileage">Mileage: ' +
      new Intl.NumberFormat("en-US").format(data.inv_miles) +
      " miles</p>";
    detail += '<p class="color">Color: ' + data.inv_color + "</p>";
    detail += '<p class="description">' + data.inv_description + "</p>";
    detail += "</div>";
    detail += "</div>";
    return detail;
  } catch (error) {
    console.error("Error building inventory detail: ", error);
    return '<p class="notice">Sorry, there was an error displaying vehicle details.</p>';
  }
};

/* *************************
 * Middleware for handling errors
 ************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = Util;