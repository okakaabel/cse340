// Define the route for vehicle detail view
router.get('/inv/detail/:inv_id', invCont.vehicleDetailView);

// Footer error handling route
router.get('/trigger-error', errorController.triggerError);
