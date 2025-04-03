function buildVehicleHTML(vehicle) {
  return `
      <div class="vehicle-container">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
          <div class="vehicle-details">
              <h1>${vehicle.make} ${vehicle.model} (${vehicle.year})</h1>
              <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
              <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
              <p><strong>Description:</strong> ${vehicle.description}</p>
          </div>
      </div>`;
}
module.exports = { buildVehicleHTML };
