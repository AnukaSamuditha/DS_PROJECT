const express = require('express');
const router = express.Router();
const {authenticate,authorize} = require('../Auth/auth');
const {getNearByRiders,getLocationByCoords} = require('../Controllers/deliveryController');

router.post("/convert-coords",authenticate,authorize(['driver']),getLocationByCoords);
router.post("/nearby-drivers",authenticate,authorize(['driver']),getNearByRiders);


module.exports = router;