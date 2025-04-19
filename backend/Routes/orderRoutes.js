const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getOrdersByUser,
  updateOrderStatus,
  updateOrderDetails,
  deleteOrder,
} = require('../Controllers/orderController');
const { authenticate, authorize } = require('../Auth/auth');

router.post('/', authenticate, authorize(['regular']), placeOrder);
router.get("/my-orders", authenticate, authorize(["regular", "rider"]), getOrdersByUser);
router.patch("/:id/status", authenticate, authorize(["admin", "rider","regular"]), updateOrderStatus);
router.patch("/:id", authenticate, authorize(["regular"]), updateOrderDetails);
router.delete("/:id", authenticate, authorize(["regular", "admin"]), deleteOrder);

module.exports = router;
