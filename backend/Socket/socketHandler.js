const { redisClient } = require("../Auth/redisClient");
const { getNearByRidersUtility } = require("../Utils/getNearByRiders");
const ORDER_QUEUE_KEY = "LIVE_ORDER_QUEUE";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Driver connected : ${socket.id}`);

    socket.on("riderLocation", async (data) => {
      const { location, riderId, riderName } = data;
      if (!location || !location.lat || !location.lng || !riderId || !riderName) {
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
        socketId: socket.id,
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
        console.log("valid drivers", validDrivers);
        io.emit("updatedRider", validDrivers);
      }
    });

    socket.on("order_delivery_request", async (data) => {
      const { orderId, order, user } = data;

      if (!orderId || !order || !user.location) {
        console.log(
          "Order information must be available to send delivery requests!"
        );
        return;
      }

      let nearByRiders = [];
      await getNearByRidersUtility({
        lat: user.location.lat,
        lng: user.location.lng,
        radius: 20,
      })
        .then((riders) => {
          console.log("riders ", riders);
          nearByRiders = riders;
        })
        .catch((error) => {
          console.log("error finding near by riders", error);
        });

      console.log("Near by riders ", nearByRiders);

      if (nearByRiders.length === 0) {
        console.log("no riders found");
        socket.emit("no_riders_found", { orderId });
        return;
      }

      const updatedUser = {
        ...user,
        socketId: socket.id,
      };

      const orderQueue = {
        user: updatedUser,
        order,
        riderQueue: nearByRiders,
        currentIndex: 0,
        status: "pending",
        assignedRider: "",
      };
      await redisClient.hSet(
        ORDER_QUEUE_KEY,
        orderId,
        JSON.stringify(orderQueue)
      );

      const closetsRiderId = nearByRiders[0];
      const closestRiderInfo = await redisClient.hGetAll(
        `DRIVER:${closetsRiderId}`
      );
      const closetsRiderSocketId = closestRiderInfo.socketId;

      console.log("socket closets", closetsRiderSocketId);
      if (closetsRiderSocketId) {
        io.to(closetsRiderSocketId).emit("delivery_request", {
          orderId,
          order,
          client: user,
        });
      }
    });

    socket.on("rider_location_request",async(data,ack)=>{
      const {riderId} = data;

      if(!riderId){
        return ack({success:false,message:"Missing riderId!"})
      }

      const intervalId = setInterval(async()=>{
        const riderLocation = await redisClient.geoPos(`DRIVERS`,riderId);
        if(riderLocation && riderLocation[0]){
          io.to(socket.id).emit("rider_location_updated",{
            riderId,
            riderLocation
          })
        }
      },1000)

      socket.riderTrackingInterval = intervalId;
    })

    socket.on("tracking_rider_stop",()=>{
      clearInterval(socket.riderTrackingInterval);
    })

    socket.on("rider_arrived",async(data,ack)=>{
      const customerId = data.customerId;
      const orderId = data.orderId;

      if(!customerId || !orderId){
        console.log("customer id ",customerId);
        console.log("order id ",orderId)
        console.log("Missing required fields!");
        return;
      }

      const orderQueueStr = await redisClient.hGet(ORDER_QUEUE_KEY, orderId);
      const orderQueue = JSON.parse(orderQueueStr);

      if (!orderQueue) {
        console.log("Order queue not found!");
        return;
      }
      if(orderQueue.user){
        const customerSocketId = orderQueue.user.socketId;
        const riderId = orderQueue.assignedRider;
        if(!customerSocketId){
          console.log("Customer socket id not found!");
          return;
        }

        io.to(customerSocketId).emit("rider_arrival",{
          riderId,
          orderId
        })
        await redisClient.hDel(ORDER_QUEUE_KEY,orderId);
      }else{
        console.log("Required information unavailable!")
        return;
      }
      
    })

    socket.on("rider_response", async (data, ack) => {
      const { orderId, riderId, response } = data;

      if (!orderId || !riderId || !response) {
        console.log("orderId ",orderId);
        console.log("riderId ",riderId);
        console.log("response ",response);

        return ack({ success: false, message: "Missing required fields!" });
      }
      const orderQueueStr = await redisClient.hGet(ORDER_QUEUE_KEY, orderId);
      const orderQueue = JSON.parse(orderQueueStr);

      if (!orderQueue) {
        console.log("Order queue not found!");
        return ack({ success: false, message: "Order queue is not found" });
      }

      if (response === "accepted") {
        orderQueue.status = "assigned";
        orderQueue.assignedRider = riderId;
        await redisClient.hSet(
          ORDER_QUEUE_KEY,
          orderId,
          JSON.stringify(orderQueue)
        );

        ack({ success: true, message: "Order accepted" });
        console.log(`Order ${orderId} accepted by rider ${riderId}`);
        io.to(orderQueue.user.socketId).emit("order_accepted", {
          orderId,
          riderId,
        });
      } else if (response === "rejected") {
        console.log(`Order ${orderId} rejected by rider ${riderId}`);
        orderQueue.currentIndex += 1;

        if (orderQueue.currentIndex < orderQueue.riderQueue.length) {
          const nextRiderId = orderQueue.riderQueue[orderQueue.currentIndex];
          await redisClient.hSet(
            ORDER_QUEUE_KEY,
            orderId,
            JSON.stringify(orderQueue)
          );

          const nextRiderInfo = await redisClient.hGetAll(
            `DRIVER:${nextRiderId}`
          );
          const nextRiderSocketId = nextRiderInfo.socketId;
          if (nextRiderSocketId) {
            io.to(nextRiderSocketId).emit("delivery_request", {
              orderId,
              order: orderQueue.order,
              client: orderQueue.user,
            });
            ack({ success: true, message: "Successfully sent to next rider" });
          } else {
            ack({ success: false, message: "Next rider not available!" });
          }
        } else {
          console.log(`All riders rejected the order ${orderId}!`);
          orderQueue.status = "rejected";
          await redisClient.hSet(
            ORDER_QUEUE_KEY,
            orderId,
            JSON.stringify(orderQueue)
          );

          io.to(orderQueue.user.socketId).emit("no_rider_available", {
            orderId,
            message: "Please wait we are searching another rider...",
          });

          ack({ success: false, message: "All riders rejected!" });
        }
      } else {
        ack({ success: false, message: "Unknown format!" });
      }
    });
  });
};

module.exports = { socketHandler };