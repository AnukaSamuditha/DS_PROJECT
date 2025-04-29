const MenuItemSchema = require("../Models/MenuItemModel");
const User = require("../Models/User");
const RestaurantSchema = require("../Models/RestaurantModel");

// Create a menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, preparationTime, imageUrl } = req.body;

    const restaurantId = req.params.id;
    const userId = req.user.user.id; // 🔥 updated here

    const photo = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const restaurant = await RestaurantSchema.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: "You can only add menu items to your own restaurant" });
    }

    const newMenuItem = new MenuItemSchema({
      name,
      description,
      price,
      category,
      preparationTime,
      photo: photo || null,
      imageUrl: !photo ? imageUrl : null, // use imageUrl if photo not uploaded
      restaurant: restaurantId,
    });

    await newMenuItem.save();

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: newMenuItem,
    });

  } catch (err) {
    res.status(500).json({ message: "Error creating menu item", error: err.message });
  }
};

// Get menu items by restaurant
const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const menuItems = await MenuItemSchema.find({ restaurant: restaurantId });

    if (menuItems.length === 0) {
      return res.status(404).json({ message: "No menu items available in this restaurant" });
    }

    res.status(200).json({
      message: "Menu items fetched successfully",
      menuItems,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching menu items", err: err.message });
  }
};

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItemSchema.find();

    if (menuItems.length === 0) {
      return res.status(404).json({ message: "No menu items found." });
    }

    res.status(200).json({ message: "Menu items fetched successfully", menuItems });

  } catch (err) {
    res.status(500).json({ message: "Error fetching all menu items", err: err.message });
  }
};

// Toggle availability of a menu item
const toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const userId = req.user.user.id; // 🔥 updated here

    const menuItem = await MenuItemSchema.findById(menuItemId).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: "You can only update menu items of your own restaurant" });
    }

    const updatedMenuItem = await MenuItemSchema.findByIdAndUpdate(
      menuItemId,
      { isAvailable: !menuItem.isAvailable },
      { new: true }
    );

    res.status(200).json({
      message: `Menu item ${updatedMenuItem.isAvailable ? "available" : "unavailable"} successfully`,
      menuItem: updatedMenuItem,
    });

  } catch (err) {
    res.status(500).json({ message: "Error toggling menu item availability", err: err.message });
  }
};

// Update a menu item
const updatedMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const updateData = req.body;
    const userId = req.user.user.id; // 🔥 updated here
    const photo = req.file ? req.file.filename : null;

    const menuItem = await MenuItemSchema.findById(menuItemId).populate("restaurant");

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: "You can only update items from your own restaurant" });
    }

    menuItem.name = updateData.name || menuItem.name;
    menuItem.description = updateData.description || menuItem.description;
    menuItem.price = updateData.price || menuItem.price;
    menuItem.category = updateData.category || menuItem.category;
    menuItem.preparationTime = updateData.preparationTime || menuItem.preparationTime;

    if (photo) {
      menuItem.photo = photo;
      menuItem.ImageUrl = null;
    } else if (updateData.imageUrl) {
      menuItem.ImageUrl = updateData.imageUrl;
    }

    await menuItem.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem,
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating menu item", error: err.message });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const userId = req.user.user.id; // 🔥 updated here

    const menuItem = await MenuItemSchema.findById(menuItemId).populate('restaurant');
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your restaurant's menu items" });
    }

    await MenuItemSchema.findByIdAndDelete(menuItemId);

    res.status(200).json({ message: "Menu item deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting menu item", err: err.message });
  }
};

// Get a single menu item by ID
const getSingleMenuItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const menuItem = await MenuItemSchema.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ menuItem });

  } catch (err) {
    res.status(500).json({ message: "Error fetching menu item", err: err.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItemsByRestaurant,
  getAllMenuItems,
  toggleMenuItemAvailability,
  updatedMenuItem,
  deleteMenuItem,
  getSingleMenuItem,
};














// const MenuItemSchema = require("../Models/MenuItemModel");
// const User = require("../Models/User");
// const RestaurantSchema = require("../Models/RestaurantModel")

// //create menuItem
// const createMenuItem = async (req, res) => {
//     try {
//       const {
//         name,
//         description,
//         price,
//         category,
//         preparationTime,
//         imageUrl,
//       } = req.body;
  
//       const restaurantId = req.params.id;
//       const userId = req.user.id;
  
//       // Uploaded image file (if any)
//       const photo = req.file ? req.file.filename : null;
  
//       // Check required fields
//       if (!name || !description || !price || !category) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }
  
//       // Find restaurant and verify ownership
//       const restaurant = await RestaurantSchema.findById(restaurantId);
//       if (!restaurant) {
//         return res.status(404).json({ message: "Restaurant not found" });
//       }
  
//       if (restaurant.owner.toString() !== userId) {
//         return res.status(403).json({ message: "You can only add menu items to your own restaurant" });
//       }
  
//       const newMenuItem = new MenuItemSchema({
//         name,
//         description,
//         price,
//         category,
//         preparationTime,
//         photo: photo || null,
//         imageUrl: !photo ? imageUrl : null, // use imageUrl only if photo not uploaded
//         restaurant: restaurantId,
//       });
  
//       await newMenuItem.save();
  
//       res.status(201).json({
//         message: "Menu item created successfully",
//         menuItem: newMenuItem,
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Error creating menu item", error: err.message });
//     }
//   };
  




// //get menuItems by Restaurant
// const getMenuItemsByRestaurant = async (req, res) => {
//     try{
//         const restaurantId = req.params.id;
//         const menuItems = await MenuItemSchema.find({ restaurant: restaurantId });

//         if(menuItems.length === 0) {
//             return res.status(404).json({ message: "No any menuItems avaiable on this restaurant" });
//         }
//         res.status(200).json({
//             message: "Menu Item fetched successfully",
//             menuItems
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Error fetching menu items",
//             err: err.message
//         })
//     }
// };


// //get all menuitems
// const getAllMenuItems = async (req, res) => {
//     try{
//         const menuItems = await MenuItemSchema.find();

//         if(menuItems.length === 0){
//             return res.status(404).json({ message: "No any menu Item found." });
//         }

//         res.status(200).json({ message: "Menu items fetched successfully", menuItems });
//     }catch (err) {
//         res.status(500).json({ message: "Error Fetching all of menu items", err: err.message })
//     }
// };


// //toggle Availability of menuItems
// const toggleMenuItemAvailability = async (req, res) => {
//     try{
//         const menuItemId = req.params.id;
//         const userId = req.user.id;

//         const menuItem = await MenuItemSchema.findById(menuItemId).populate('restaurant');

//         if(!menuItem) {
//             return res.status(404).json({ message: "Menu Item not found" });
//         }

//         if(menuItem.restaurant.owner.toString() !== userId){
//             return res.status(403).json({ message: "You can only update menu items of your own restaurant" });
//         }

//         const updatedMenuItem = await MenuItemSchema.findByIdAndUpdate( menuItemId, { isAvailable: !menuItem.isAvailable }, { new: true });

//         res.status(200).json({ message: `Menu Item ${updatedMenuItem.isAvailable? "available" : "unavailable"} successfully`, menuItem: updatedMenuItem });
//     } catch (err) {
//         res.status(500).json({ message: "Error toggling menu item avaiability", err: err.message });
//     }
// };


// //update menuItem
// const updatedMenuItem = async (req, res) => {
//     try {
//       const menuItemId = req.params.id;
//       const updateData = req.body;
//       const userId = req.user.id;
//       const photo = req.file ? req.file.filename : null;
  
//       const menuItem = await MenuItemSchema.findById(menuItemId).populate("restaurant");
  
//       if (!menuItem) {
//         return res.status(404).json({ message: "Menu item not found" });
//       }
  
//       if (menuItem.restaurant.owner.toString() !== userId) {
//         return res.status(403).json({ message: "You can only update items from your own restaurant" });
//       }
  
//       // Update fields
//       menuItem.name = updateData.name || menuItem.name;
//       menuItem.description = updateData.description || menuItem.description;
//       menuItem.price = updateData.price || menuItem.price;
//       menuItem.category = updateData.category || menuItem.category;
//       menuItem.preparationTime = updateData.preparationTime || menuItem.preparationTime;
  
//       // Handle image
//       if (photo) {
//         menuItem.photo = photo;
//         menuItem.ImageUrl = null; // prioritize uploaded image
//       } else if (updateData.imageUrl) {
//         menuItem.ImageUrl = updateData.imageUrl;
//       }
  
//       await menuItem.save();
  
//       res.status(200).json({
//         message: "Menu item updated successfully",
//         menuItem,
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Error updating menu item", error: err.message });
//     }
//   };

// //delete menuItem
// const deleteMenuItem = async (req, res) => {
//     try{
//         const menuItemId = req.params.id;
//         const userId = req.user.id;

//         const menuItem = await MenuItemSchema.findById(menuItemId).populate('restaurant');
//         if(!menuItem) {
//             return res.status(404).json({ message: "MenuItem not found" });
//         }

//         if(menuItem.restaurant.owner.toString() !== userId) {
//             return res.status(403).json({ message: "You can only delete your restaurant's MenuItems" })
//         }

//         await MenuItemSchema.findByIdAndDelete(menuItemId);

//         res.status(200).json({ message: "Menu Item deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "" })
//     }
// }


// // Get a single menu item by ID
// const getSingleMenuItem = async (req, res) => {
//     try {
//       const itemId = req.params.id;
//       const menuItem = await MenuItemSchema.findById(itemId);
  
//       if (!menuItem) {
//         return res.status(404).json({ message: "Menu item not found" });
//       }
  
//       res.status(200).json({ menuItem });
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching menu item", err: err.message });
//     }
//   };
  

// module.exports = {
//     createMenuItem,
//     getMenuItemsByRestaurant,
//     getAllMenuItems,
//     toggleMenuItemAvailability,
//     updatedMenuItem,
//     deleteMenuItem,
//     getSingleMenuItem
// }