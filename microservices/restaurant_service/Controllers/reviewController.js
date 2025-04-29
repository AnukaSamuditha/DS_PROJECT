const Review = require("../Models/reviewSchema");

// Create a review
const createReview = async (req, res) => {
  const userId = req.user.user.id; // 🔥 updated here
  const { restaurantId } = req.params;
  const { rating, comment } = req.body;

  try {
    const existingReview = await Review.findOne({ restaurant: restaurantId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this restaurant." });
    }

    const review = new Review({
      restaurant: restaurantId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted.", review });

  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get reviews for a restaurant
const getReviews = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });

  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const userId = req.user.user.id; // 🔥 updated here
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: "Review updated", review });

  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const userId = req.user.user.id; // 🔥 updated here
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted" });

  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
};












// const Review = require("../Models/reviewSchema");

// const createReview = async (req, res) => {
//   const userId = req.user.id;
//   const { restaurantId } = req.params;
//   const { rating, comment } = req.body;

//   try {
//     const existingReview = await Review.findOne({ restaurant: restaurantId, user: userId });
//     if (existingReview) {
//       return res.status(400).json({ message: "You already reviewed this restaurant." });
//     }

//     const review = new Review({
//       restaurant: restaurantId,
//       user: userId,
//       rating,
//       comment,
//     });

//     await review.save();

//     res.status(201).json({ message: "Review submitted.", review });
//   } catch (err) {
//     console.error("Error submitting review:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// const getReviews = async (req, res) => {
//   const { restaurantId } = req.params;

//   try {
//     const reviews = await Review.find({ restaurant: restaurantId })
//       .populate("user", "name")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ reviews });
//   } catch (err) {
//     console.error("Error fetching reviews:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // PATCH /reviews/update/:reviewId
// const updateReview = async (req, res) => {
//     const userId = req.user.id;
//     const { reviewId } = req.params;
//     const { rating, comment } = req.body;
  
//     try {
//       const review = await Review.findById(reviewId);
//       if (!review) {
//         return res.status(404).json({ message: "Review not found" });
//       }
  
//       if (review.user.toString() !== userId) {
//         return res.status(403).json({ message: "Not authorized to edit this review" });
//       }
  
//       review.rating = rating;
//       review.comment = comment;
//       await review.save();
  
//       res.status(200).json({ message: "Review updated", review });
//     } catch (err) {
//       console.error("Error updating review:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   };
  
//   // DELETE /reviews/delete/:reviewId
//   const deleteReview = async (req, res) => {
//     const userId = req.user.id;
//     const { reviewId } = req.params;
  
//     try {
//       const review = await Review.findById(reviewId);
//       if (!review) {
//         return res.status(404).json({ message: "Review not found" });
//       }
  
//       if (review.user.toString() !== userId) {
//         return res.status(403).json({ message: "Not authorized to delete this review" });
//       }
  
//       await Review.findByIdAndDelete(reviewId);
  
//       res.status(200).json({ message: "Review deleted" });
//     } catch (err) {
//       console.error("Error deleting review:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   };

// module.exports = {
//   createReview,
//   getReviews,
//   deleteReview,
//   updateReview
// };
