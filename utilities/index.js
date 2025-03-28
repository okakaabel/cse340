const invModel = require("../models/inventory-model");

// Build the vehicle page HTML from data
Util.buildVehiclePage = async function (data) {
  let vehicleTemplate = "";

  if (data) {
    vehicleTemplate += '<section id="vehicle-details">';

    vehicleTemplate += '<div class="vehicle-container">';

    vehicleTemplate += '<div class="vehicle-image-container">';
    vehicleTemplate += `<img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">`;
    vehicleTemplate += "</div>";

    vehicleTemplate += '<div class="vehicle-details-container">';
    vehicleTemplate += `<h2>${data.inv_make} ${data.inv_model}</h2>`;
    vehicleTemplate += "<p>";
    vehicleTemplate += `<strong>Year:</strong> ${data.inv_year}<br>`;
    vehicleTemplate += `<strong>Color:</strong> ${data.inv_color}<br>`;
    vehicleTemplate += `<strong>Miles:</strong> ${data.inv_miles}<br>`;
    vehicleTemplate += "</p>";
    vehicleTemplate += `<p>${data.inv_description}</p>`;
    vehicleTemplate += `<p class="price">Price: ${data.inv_price}</p>`;
    vehicleTemplate += "</div>";
    vehicleTemplate += "</div>";
    vehicleTemplate += "</section>";
  } else {
    vehicleTemplate =
      '<p class="notice">Sorry, the vehicle you are looking for could not be found.</p>';
  }

  return vehicleTemplate;
};
