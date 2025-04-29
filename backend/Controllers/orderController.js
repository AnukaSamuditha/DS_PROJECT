const Order = require('../Models/orderModel');
const Restaurant = require('../Models/RestaurantModel');
const MenuItem = require('../Models/MenuItemModel');

exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items: orderedItems, deliveryFee, paymentMethod, userLocation, notes } = req.body;

    const user = req.user.user || req.user;

    // 1. Fetch restaurant from DB
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // 2. Fetch and validate each MenuItem
    const fetchedItems = [];
    let amount = 0;

    for (const item of orderedItems) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(404).json({ message: `Menu item not found or unavailable: ${item.menuItemId}` });
      }

      const itemTotal = menuItem.price * item.quantity;
      amount += itemTotal;

      fetchedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const totalAmount = amount + (deliveryFee || 0);

    // 3. Create new Order
    const newOrder = new Order({
      user: {
        id: user.id,
        name: user.email,
        location: userLocation || {}
      },
      shop: {
        id: restaurant._id,
        name: restaurant.name,
        location: {
          address: restaurant.address,
          lat: restaurant.location.coordinates[1],
          lng: restaurant.location.coordinates[0]
        }
      },
      items: fetchedItems,
      amount,
      deliveryFee,
      totalAmount,
      paymentMethod,
      notes: notes || ''
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const user = req.user.user || req.user;
    const userId = user.id;

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
