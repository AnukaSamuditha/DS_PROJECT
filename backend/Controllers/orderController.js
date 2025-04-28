const Order = require("../Models/Order");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      user,
      shop,
      items,
      amount,
      deliveryFee,
      totalAmount,
      estimatedDeliveryTime,
      paymentMethod,
      notes,
    } = req.body;

    const newOrder = new Order({
      user,
      shop,
      items,
      amount,
      deliveryFee,
      totalAmount,
      estimatedDeliveryTime,
      paymentMethod,
      notes,
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update order status and/or driver
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId, deliveryFee, distanceFromShopToUser, totalAmount } = req.body;

    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (driverId) updatedFields.driverId = driverId;
    if (deliveryFee) updatedFields.deliveryFee = deliveryFee;
    if (distanceFromShopToUser) updatedFields.distanceFromShopToUser = distanceFromShopToUser;
    if (totalAmount) updatedFields.totalAmount = totalAmount;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Missing required information for creating an order",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      message: "Order data fetched successfully",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        message: "Missing required information for getting an order status",
      });
    }

    const status = await Order.findById(id).select("status");
    console.log("status");
    if (!status) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      message: "Order status fetched successfully",
      status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getDayOrders = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Missing required information for getting an order status",
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrders = await Order.find({
      driverId: id,
      status: "completed",
      createdAt:{
        $gte:startOfDay,
        $lte:endOfDay
      }
    });

    res.status(200).json({
      message: "Day orders fetched successfully.",
      orders: todayOrders,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error occured while fetching day orders!",
      error: error.message,
    });
  }
};
