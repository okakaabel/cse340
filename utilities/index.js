const buildVehicleHtml = (vehicle) => {
    return `
        <div class="vehicle-details">
            <h1>${vehicle.make} ${vehicle.model} (${vehicle.year})</h1>
            <div class="vehicle-image">
                <img src="${vehicle.image_url}" alt="${vehicle.make} ${vehicle.model}" />
            </div>
            <div class="vehicle-info">
                <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
                <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
                <p><strong>Make:</strong> ${vehicle.make}</p>
                <p><strong>Model:</strong> ${vehicle.model}</p>
                <p><strong>Year:</strong> ${vehicle.year}</p>
            </div>
        </div>
    `;
};

module.exports = {
    buildVehicleHtml
};
