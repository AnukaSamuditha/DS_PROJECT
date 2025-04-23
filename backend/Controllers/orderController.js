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
    const { status, driverId,deliveryFee,distanceFromShopToUser } = req.body;

    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (driverId) updatedFields.driver = driverId;
    if (deliveryFee) updatedFields.deliveryFee = deliveryFee;
    if (distanceFromShopToUser) updatedFields.distanceFromShopToUser = distanceFromShopToUser;

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
  console.log("order id ",id)
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
      order : order,
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
  console.log("order id from order status ",id)
  try {
    if (!id) {
      return res.status(400).json({
        message: "Missing required information for getting an order status",
      });
    }

    const status = await Order.findById(id).select("status");
    console.log("status")
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


