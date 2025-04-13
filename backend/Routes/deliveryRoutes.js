const express = require('express');
const router = express.Router();
const {authenticate,authorize} = require('../Auth/auth');
const {getNearByRiders,getLocationByCoords,enableDelivering,getDeliveryStatus} = require('../Controllers/deliveryController');

router.post("/coords",authenticate,authorize(['driver']),getLocationByCoords);
router.post("/nearby-drivers",authenticate,authorize(['driver']),getNearByRiders);
router.patch("/:id/deliver",authenticate,authorize(['driver']),enableDelivering);
router.get("/:id/status",authenticate,authorize(['driver']),getDeliveryStatus);

module.exports = router;