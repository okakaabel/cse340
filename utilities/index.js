const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '<ul id="inv-display">';
  if(data.length > 0){
    data.forEach(vehicle => { 
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  grid += '</ul>';
  return grid;
};

Util.buildVehicleGrid = async function (data) {
  if (data.length > 0) {
    const vehicle = data[0];
    return `
      <div id="singleVehicleWrapper" class="vehicleImage">
        <picture>
          <source media="(max-width: 400px)" srcset="${vehicle.inv_thumbnail}">
          <source media="(max-width: 600px)" srcset="${vehicle.inv_thumbnail}">
          <source media="(max-width: 1200px)" srcset="${vehicle.inv_image}">
          <source media="(min-width: 1201px)" srcset="${vehicle.inv_image}">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy">
        </picture>
        <ul id="singleVehicleDetails" class="flex-outer">
          <li><h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2></li>
          <li><strong>Price: </strong>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>
          <li><strong>Description: </strong>${vehicle.inv_description}</li>
          <li><strong>Miles: </strong>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</li>
        </ul>
      </div>`;
  } else {
    return `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }
};

/* ****************************************
 * Render Error View
 **************************************** */
Util.renderError = function (res, error) {
  res.status(500).render("error", {
    title: "Server Error",
    message: error.message || "An unexpected error occurred.",
  });
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification select list
* ************************************* */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check user authorization, block unauthorized users
 * ************************************ */
Util.checkAuthorization = async (req, res, next) => {
  // auth : 0
  let auth = 0
  // logged in ? next : 0
  if (res.locals.loggedin) {
    const account = res.locals.accountData
    // admin ? 1 : 0
    account.account_type == "Admin" 
      || account.account_type == "Employee" ? auth = 1 : auth = 0 
  }
  // !auth ? 404 : next()
  if (!auth) {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
    return
  } else {
    next()
  }
}

Util.checkAuthorization = (req, res, next) => {
  if (!res.locals.accountData) {
    req.flash("notice", "You are not logged in.")
    return res.redirect("/account/login")
  }
  if (res.locals.accountData.account_type == "Employee" ||
    res.locals.accountData.account_type == "Admin"
  ) {
    next()
  } else {
    req.flash("notice", "You are not authorized to view this page.")
    return res.redirect("/account/login")
  }
}

/* ************************
 * Constructs unarchived messages on account_id
 ************************** */
Util.getAccountMessages = async function (account_id) {
  let data = await messageModel.getMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No new messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => { 
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`; 
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

/* ************************
 * Constructs archived messages on account_id
 ************************** */
Util.getArchivedMessages = async function (account_id) {
  let data = await messageModel.getArchivedMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No archived messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => {
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`;
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

/* ****************************************
* Build the star rating HTML
* *************************************** */
Util.buildStarRating = function (rating) {
  rating = parseFloat(rating) || 0
  const fullStars = Math.floor(rating)
  const halfStar = (rating - fullStars) >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  
  let starsHtml = ''
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span class="star full-star">★</span>'
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHtml += '<span class="star half-star">★</span>'
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span class="star empty-star">☆</span>'
  }
  
  return starsHtml
}

/* ****************************************
* Format date to readable string
* *************************************** */
Util.formatDate = function (dateString) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

module.exports = Util