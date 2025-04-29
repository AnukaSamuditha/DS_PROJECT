const { redisClient } = require("../Auth/redisClient");
const { Client } = require("@googlemaps/google-maps-services-js");
const User = require("../Models/User");
require("dotenv").config();

exports.getNearByRiders = async (req, res) => {
  const { lat, lng, radius } = req.body;
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

exports.getDrivers = async (req, res) => {
  try {
    const currentDrivers = [];
    const availableDrivers = await redisClient.zRange("DRIVERS", 0, -1);

    const drivers = availableDrivers.map(async (driver) => {
      const driverData = await redisClient.hGetAll(`DRIVER:${driver}`);
      if (driverData && driverData.riderName) {
        currentDrivers.push({
          riderId: driver,
          riderName: driverData.riderName,
          longitude: driverData.longitude,
          latitude: driverData.latitude,
        });
      }
    });

    if (validDrivers.length > 0) {
      return res.status(200).json({});
    }
  } catch (error) {
    console.log("error in");
  }
};

exports.getLocationByCoords = async (req, res) => {
  const { lat, lng } = req.body;
  const client = new Client();
  try {
    if (!lat || !lng) {
      return res.status(400).json({
        message: "latitude and longitude cannot be undefined",
      });
    }

    const addresses = await client.reverseGeocode({
      params: {
        latlng: {
          lat: parseFloat(lat),

          lng: parseFloat(lng),
        },
        key: process.env.GOOGLE_API,
      },
      timeout: 4000,
    });

    const address =
      addresses.data.results[0]?.formatted_address || "Unknown Address";

    res.status(200).json({
      message: "Coords converted to a readable location successfully",
      address: address,
      data: res.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in converting coords to readable location format.",
      error: error.message,
    });
  }
};

exports.enableDelivering = async (req, res) => {
  const { id } = req.params;
  
  try {

    if(!id){
        return res.status(400).json({
            message:"Driver id is required"
        })
    }

    const driver = await User.findById(id).select('isDelivering username role');
    if (!driver) {
      return res.status(404).json({
        message: "Invalid driver info!",
      });
    }

    driver.isDelivering = !driver.isDelivering;
    if(!driver.isDelivering){
        await redisClient.zRem("DRIVERS",driver._id.toString());
    }
    const updatedDriver = await driver.save();

    res.status(200).json({
      message: `isDelivering ${updatedDriver.isDelivering ? "enabled" : "disabled"} on the driver ${updatedDriver.username}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occured while enabling the delivery!",
      error: error.message,
    });
  }
};

exports.getDeliveryStatus = async(req,res)=>{
    const {id} = req.params;
    try{
        if(!id){
            return res.status(400).json({
                message:"Driver id is required"
            })
        }
        const result = await User.findById(id).select('isDelivering');

        if(!result) {
            return res.status(404).json({
                message:"Invalid driver id"
            })
        }

        res.status(200).json({
            message:"isDelivering fetched successfully",
            result
        })

    }catch(error){
        res.status(500).json({
            message: "Error occured while getting isDelivering!",
            error: error.message,
          });
    }
}