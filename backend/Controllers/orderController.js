const Order = require('../Models/orderModel');



exports.placeOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const totalAmount = orderData.amount + (orderData.deliveryFee || 0);

    const user = req.user; // ✅ FIXED

    const newOrder = new Order({
      user: {
        id: user.id,
        name: user.email,
        location: orderData.user?.location || {}
      },
      shop: orderData.shop,
      items: orderData.items,
      amount: orderData.amount,
      deliveryFee: orderData.deliveryFee,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes || ''
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};



exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user
    const orders = await Order.find({ 'user.id': userId });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

exports.updateOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be updated' });
    }

    // Recalculate totalAmount if amount or deliveryFee is being changed
    if (updateData.amount !== undefined || updateData.deliveryFee !== undefined) {
      const amount = updateData.amount || order.amount;
      const deliveryFee = updateData.deliveryFee || order.deliveryFee || 0;
      updateData.totalAmount = amount + deliveryFee;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};


