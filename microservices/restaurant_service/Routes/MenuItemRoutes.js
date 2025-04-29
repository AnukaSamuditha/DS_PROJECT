const express = require('express');
const router = express.Router();
const {authenticate, authorize} = require("../Auth/auth");
const { createMenuItem, getMenuItemsByRestaurant, getAllMenuItems, toggleMenuItemAvailability, deleteMenuItem, updatedMenuItem, getSingleMenuItem } = require("../Controllers/MenuItemController");
const upload = require('../middlewares/upload');

router.post("/create-menuItem/:id", authenticate, authorize(['restaurantOwner']), upload.single('photo'), createMenuItem);
router.get("/restaurant-menuItems/:id", authenticate, authorize(['regular','admin','rider','restaurantOwner']), getMenuItemsByRestaurant);
router.get("/all-menuItems", authenticate, authorize(['regular','admin','rider','restaurantOwner']), getAllMenuItems);
router.patch("/availability-menuItem/:id", authenticate, authorize(['restaurantOwner']), toggleMenuItemAvailability);
router.patch("/update-menuItem/:id", authenticate, authorize(['restaurantOwner']),  upload.single("photo"), updatedMenuItem);
router.delete("/delete-menuItem/:id", authenticate, authorize(['restaurantOwner']), deleteMenuItem);
router.get("/get-menuItem/:id", authenticate, authorize(['regular','admin','rider','restaurantOwner']), getSingleMenuItem);



module.exports = router;