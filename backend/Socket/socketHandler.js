const { redisClient } = require("../Auth/redisClient");
const {getNearByRidersUtility} = require("../Utils/getNearByRiders")
const ORDER_QUEUE_KEY = "LIVE_ORDER_QUEUE";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Driver connected : ${socket.id}`);

    socket.on("riderLocation", async (data) => {
      const { location, riderId, riderName } = data;
      if (!location.lat || !location.lng || !riderId || !riderName) {
        console.error("Rider data cannot be null");
        return;
      }
      await redisClient.geoAdd("DRIVERS", {
        longitude: location.lng,
        latitude: location.lat,
        member: riderId, 
      });

      await redisClient.hSet(`DRIVER:${riderId}`, {
        riderName: riderName,
        longitude: location.lng,
        latitude: location.lat,
        socketId:socket.id
      });

      const availableDrivers = await redisClient.zRange("DRIVERS", 0, -1);

      const drivers = await Promise.all(
        availableDrivers.map(async (driver) => {
          const driverData = await redisClient.hGetAll(`DRIVER:${driver}`);
          if (driverData && driverData.riderName) {
            return {
              riderId: driver,
              riderName: driverData.riderName,
              lng: driverData.longitude,
              lat: driverData.latitude,
            };
          }
        })
      );
      const validDrivers = drivers.filter((driver) => driver != null);

      if (validDrivers.length > 0) {
        console.log("valid drivers",validDrivers)
        io.emit("updatedRider", validDrivers);
      }
    });

    socket.on("order_delivery_request",async(data)=>{
      const {orderId,order,user} = data
      

      if(!orderId || !order || !user.location){
        console.log("Order information must be available to send delivery requests!");
        return;
      }

      let nearByRiders2 = []
      await getNearByRidersUtility({
        lat:user.location.lat,
        lng:user.location.lng,
        radius:10
      })
      .then((riders)=>{
        console.log("riders ",riders)
        nearByRiders2 = riders
      }).catch((error)=>{
        console.log("error finding near by riders",error)
      })

      console.log("Near by riders ",nearByRiders2);

      if(nearByRiders2.length ===0){
        console.log("no riders found")
        socket.emit("no_riders_found",{orderId});
        return;
      }

      const orderQueue = {
        user,
        order,
        riderQueue:nearByRiders2,
        currentIndex:0,
        status:"pending"
      }
      await redisClient.hSet(ORDER_QUEUE_KEY,orderId,JSON.stringify(orderQueue));

      const closetsRiderId = nearByRiders2[0];
      const closestRiderInfo = await redisClient.hGetAll(`DRIVER:${closetsRiderId}`);
      const closetsRiderSocketId = closestRiderInfo.socketId

      console.log("socket closets",closetsRiderSocketId)
      if(closetsRiderSocketId){
        io.to(closetsRiderSocketId).emit("delivery_request",{orderId,order,client:user})
      }
    })
  });
};

module.exports = { socketHandler };