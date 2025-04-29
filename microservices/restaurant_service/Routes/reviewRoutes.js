const express = require("express");
const router = express.Router();

const { createReview, getReviews, updateReview, deleteReview } = require("../Controllers/reviewController");
const { authenticate, authorize } = require("../Auth/auth");

router.post("/:restaurantId", authenticate, authorize(["regular"]), createReview);
router.get("/:restaurantId", getReviews);
router.patch("/update/:reviewId", authenticate, authorize(["regular"]), updateReview);
router.delete("/delete/:reviewId", authenticate, authorize(["regular"]), deleteReview);


module.exports = router;
