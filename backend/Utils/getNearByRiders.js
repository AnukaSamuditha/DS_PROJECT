const { redisClient } = require("../Auth/redisClient")

exports.getNearByRidersUtility = async ({lat,lng,radius}) => {
    
    try {
      const nearByDrivers = await redisClient.geoSearch(
        "DRIVERS",
        {
          longitude: lng,
          latitude: lat,
        },
        {
          radius: radius,
          unit: "km",
          sort: "ASC",
          count: 5,
        }
      );
  
      return nearByDrivers;
    } catch (error) {
      console.log("Error in finding near by riders ", error.message);
      return [];
    }
  };