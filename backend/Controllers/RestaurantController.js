const RestaurantSchema = require("../Models/RestaurantModel");
const User = require("../Models/User");
const Review = require("../Models/reviewSchema")


//Create a restaurant
const createRestaurant = async (req, res) => {
    try{
        const {name, description, address, contactNumber, openingHours, imageUrl, latitude, longitude} = req.body;
        const ownerId = req.user.id;   //for previous version of auth this should be "const ownerId = req.user.user.id"
        const photo = req.file ? req.file.filename: '';

        //check if user is a restaurant owner
        const user = await User.findById(ownerId);
        if(user.role !== 'restaurantOwner'){
            return res.status(403).json({ message: "Only restaurant owners can create restaurants" });
        }

        const newRestaurant = new RestaurantSchema({
            name,
            description,
            address,
            contactNumber,
            openingHours,
            imageUrl,
            photo,
            owner: ownerId,
            location: {
                type: "Point",
                coordinates: [longitude, latitude] // 📌 Note the order: [lng, lat]
            }
        });

        await newRestaurant.save();

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant: newRestaurant
        });

    }catch (err){
        res.status(500).json({
            message: "Error creating restaurant",
            err: err.message
        });
    }
}

//get all restaurnats
const getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await RestaurantSchema.find({});
  
      if (!restaurants || restaurants.length === 0) {
        return res.status(404).json({ message: "No restaurants found!" });
      }
  
      const restaurantsWithRatings = await Promise.all(
        restaurants.map(async (restaurant) => {
          const reviews = await Review.find({ restaurant: restaurant._id });
  
          const averageRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : null;
  
          return {
            ...restaurant.toObject(),
            averageRating: averageRating ? averageRating.toFixed(1) : null,
          };
        })
      );
  
      res.status(200).json({
        message: "Restaurants fetched successfully!",
        restaurants: restaurantsWithRatings,
      });
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      res.status(500).json({
        message: "Error fetching restaurants!",
        err: err.message,
      });
    }
  };
  



// const getAllRestaurants = async (req, res) => {
//     try{
//         const restaurants = await RestaurantSchema.find({});

//         if(!restaurants){
//             return res.status(404).json({ message: "No any Restaurant found!" });
//         }

//         res.status(200).json({ message: "Restaurants fetched successfully!", restaurants });
//     }catch (err) {
//         res.status(500).json({ message: "Error fetching restaurants!", err: err.message });
//     }
// };

//get restaurant by id
const getRestaurantById = async (req, res) => {
    try{
        const { id } = req.params;
        const restaurant = await RestaurantSchema.findById(id);

        if(!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ message: "Restaurant fetched successfully", restaurant });
    }catch (err) {
        res.status(500).json({ message: "Error fetching restaurant", err: err.message })
    }
}

//update restaurant
const updateRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const restaurant = await RestaurantSchema.findById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      if (restaurant.owner.toString() !== userId) {
        return res.status(403).json({ message: "You can only update your own restaurant" });
      }
  
      const {
        name,
        description,
        address,
        contactNumber,
        openingHours,
        isAvailable,
        latitude,
        longitude,
      } = req.body;
  
      const updateData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(address && { address }),
        ...(contactNumber && { contactNumber }),
        ...(openingHours && { openingHours }),
        ...(typeof isAvailable !== "undefined" && { isAvailable }),
      };
  
      // Location update (GeoJSON)
      if (latitude && longitude) {
        updateData.location = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      }
  
      // Handle uploaded image
      if (req.file) {
        updateData.photo = req.file.filename;
      }
  
      const updatedRestaurant = await RestaurantSchema.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      res.status(200).json({
        message: "Restaurant updated successfully",
        restaurant: updatedRestaurant,
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating restaurant", err: err.message });
    }
  };



// const updateRestaurant = async (req, res) => {
//     try{
//         const { id } = req.params;   // res id
//         const updateData = req.body;
//         const userId = req.user.id;

//         const restaurant = await RestaurantSchema.findById(id);
//         if(!restaurant){
//             return res.status(404).json({ message: "Restaurant not found"});
//         }

//         //check if the user is the owner of the restaurnt
//         if (restaurant.owner.toString() != userId){
//             return res.status(403).json({ message: "You can only update your own restaurant"});
//         }

//         const updatedRestaurant = await RestaurantSchema.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true }
//         );

//         res.status(200).json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
//     }catch (err) {
//         res.status(500).json({ message: "Error updating restaurant", err: err.message });
//     }
// }

//toggle restaurant availability
    const toggleRestaurantAvailability = async (req, res) => {
        try{
            const { id } = req. params; //retaurant id
            const userId = req.user.id; //user id

            const restaurant = await RestaurantSchema.findById(id);
            if(!restaurant) {
                return res.status(404).json({ message: "Res=taurant not found" });
            }

            //check if the user is the owner of the restaurant
            if(restaurant.owner.toString() !== userId){
                return res.status(403).json({ message: "You can only update your own restaurant" });
            }

            const updateRestaurant = await RestaurantSchema.findByIdAndUpdate(
                id,
                { isAvailable: !restaurant.isAvailable },
                { new : true }
            );

            res.status(200).json({
                message: `Restaurant ${updateRestaurant.isAvailable ? "open" : "closed"} successfully`,
                restaurant:  updateRestaurant
            });
        } catch (err){
            res.status(500).json({
                message: "Error toggling restaurant availability",
                err: err.message
            });
        }
    };


//delete restaurant
const deleteRestaurant = async (req, res) => {
    try{
        const { id } = req.params; //get restaurant id from URL
        const userId = req.user.id;  //get logged in user id from token
        const userRole = req.user.role; //role of the logged in user

        //find the restaurant by id
        const restaurant = await RestaurantSchema.findById(id);
        if(!restaurant){
            return res.status(404).json({ message: "Restaurant not found" });
        }

        //check if the logged in user is the owner or an admin
        if (restaurant.owner.toString() !== userId && userRole !== 'admin'){
            return res.status(403).json({ message: "You can only delete your own restaurant"});
        }

        //delete restaurant
        await RestaurantSchema.findByIdAndDelete(id);


        res.status(200).json({ message: "Restuant deleted successfully"});
    }catch (err){
        res.status(500).json({ message: "Error deleting restaurant", err: err.message});
    }
}
//get Restaurant by owner
const getRestaurantByOwner = async (req, res) => {
    try{
        const ownerId = req.user.id
        const restaurants = await RestaurantSchema.find({ owner: ownerId });

        res.status(200).json({ message: "Restaurant fetched successfully", restaurants });
    }catch (err) {
        res.status(500).json({ message: "Error fetching restaurants",err: err.message });
    }
};

//restaurant verification by admin
const verifyRestaurant = async (req, res) => {
    try{
        const { id } = req.params;  //get restaurant id from URL
        const { adminApproved } = req.body;    //expect true/false from request body

        const restaurant = await RestaurantSchema.findByIdAndUpdate(id, { adminApproved }, { new: true });

        if(!restaurant){
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ message: `Restaurant ${adminApproved ? "verified" : "unverified"} successfully`, restaurant });
    }catch (err) {
        res.status(500).json({ message: "Error verifying restaurant", err: err.message});
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    toggleRestaurantAvailability,
    deleteRestaurant,
    getRestaurantByOwner,
    verifyRestaurant
}