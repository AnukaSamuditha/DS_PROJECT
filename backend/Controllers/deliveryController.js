const {redisClient} = require('../Auth/redisClient');
const {Client} = require('@googlemaps/google-maps-services-js')
require('dotenv').config();

exports.getNearByRiders = async(req,res)=>{
    const {lat,lng,radius} = req.body
    try{

        const nearByDrivers = await redisClient.geoSearch("DRIVERS",{
            longitude:lng,
            latitude:lat,
        },{
            radius:radius,
            unit:'km',
            sort:'ASC',
            count:10
        })

        return nearByDrivers;

    }catch(error){
        console.log("Error in finding near by riders ",error.message);
        return [];
    }
}

exports.getLocationByCoords = async(req,res)=>{
    const {lat,lng} = req.body; 
    const client = new Client();

    try{

        if(!lat || !lng){
            return res.status(400).json({
                message:"latitude and longitude cannot be undefined"
            })
        }

        const addresses = await client.reverseGeocode({
            params:{
                latlng:{lat,lng},
                key:process.env.GOOGLE_API
            },
            timeout:4000
        })

        const address = addresses.data.results[0]?.formatted_address || "Unknown Address"

        res.status(200).json({
            message:"Coords converted to a readable location successfully",
            address:address,
            data:res.data
        })

    }catch(error){
        res.status(500).json({
            message:"Error in converting coords to readable location format.",
            error:error.message
        })
    }


}