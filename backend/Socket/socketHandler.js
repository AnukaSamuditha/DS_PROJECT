const {redisClient} = require('../Auth/redisClient');

const socketHandler = (io) =>{
    io.on("connection",(socket)=>{
        console.log(`Driver connected : ${socket.id}`);
        

        socket.on("riderLocation",async(data)=>{
            const {location,riderId,riderName} = data;
            if(!location || !riderId||!riderName){
                console.error("Rider data cannot be null")
                return;
            }
            await redisClient.geoAdd("DRIVERS",{longitude:location.lng,latitude:location.lat,member:riderId})
            io.emit("updatedRider",{riderId,riderName,lng:location.lng,lat:location.lat})
        })

    })
}

module.exports = {socketHandler};