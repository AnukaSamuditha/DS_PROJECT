const express = require('express');
const router = express.Router();
const {createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, toggleRestaurantAvailability, deleteRestaurant, getRestaurantByOwner, verifyRestaurant} = require("../Controllers/RestaurantController");
const {authenticate, authorize} = require("../Auth/auth");
const upload = require('../middlewares/upload');

router.post("/create-restaurant", authenticate, authorize(['restaurantOwner']), upload.single('photo'), createRestaurant);
router.get("/get-restaurants", authenticate, authorize(['regular','admin','rider','restaurantOwner']), getAllRestaurants);
router.get("/get-restaurant/:id", authenticate, authorize(['regular','admin','rider','restaurantOwner']), getRestaurantById);
//router.patch("/update-restaurant/:id", authenticate, authorize(['restaurantOwner']), updateRestaurant);
router.patch("/update-restaurant/:id",authenticate, authorize(['restaurantOwner']), upload.single("photo"),updateRestaurant);
router.patch("/availability-restaurant/:id", authenticate, authorize(['restaurantOwner']), toggleRestaurantAvailability);
router.delete("/restaurant-delete/:id", authenticate, authorize(['admin', 'restaurantOwner']), deleteRestaurant);
router.get("/owned-restaurants", authenticate, authorize(['restaurantOwner']), getRestaurantByOwner);
router.patch("/restaurant-verification/:id", authenticate, authorize(['admin']), verifyRestaurant);

module.exports = router;