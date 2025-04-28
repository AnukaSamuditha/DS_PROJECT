import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing Edit and Delete icons
import StarRating from "./StarRating";
import axiosInstance from "@/axiosConfig"; // ✅ secure axios
import { toast } from "react-toastify"; // Importing react-toastify

export default function ReviewList({
  reviews,
  setReviews,
  restaurantId,
  user,
  hasReviewed,
  setHasReviewed,
  backendURL,
}) {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const submitEdit = async () => {
    try {
      await axiosInstance.patch(`/reviews/update/${editingReviewId}`, {
        rating: editRating,
        comment: editComment,
      });

      cancelEditing();
      const res = await axiosInstance.get(`/reviews/${restaurantId}`);
      setReviews(res.data.reviews || []);
      toast.success("Review updated successfully!"); // Success toast
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review."); // Error toast
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await axiosInstance.delete(`/reviews/delete/${reviewId}`);

      const res = await axiosInstance.get(`/reviews/${restaurantId}`);
      setReviews(res.data.reviews || []);
      setHasReviewed(false);
      toast.success("Review deleted successfully!"); // Success toast
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review."); // Error toast
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-zinc-400">No reviews yet.</p>;
  }

  // 🔥 updated: extract userId safely
  const userId = user?._id || user?.user?._id;

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev._id} className="border-b border-zinc-700 pb-3">
          {editingReviewId === rev._id ? (
            <>
              {/* Edit Review Form */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Your Rating:</label>
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
                  >
                    {[5, 4, 3, 2, 1].map((val) => (
                      <option key={val} value={val}>
                        {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Leave a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
                  rows={4}
                />

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={submitEdit}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Display Review */}
              <div className="font-semibold flex items-center gap-2">
                <span>{rev.user?.name || "User"} — </span>
                <StarRating rating={rev.rating} />
              </div>
              {rev.comment && <p className="text-zinc-400">{rev.comment}</p>}
              {/* 🔥 updated: match review user id safely */}
              {userId === rev.user._id && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => startEditing(rev)}
                    className="text-[#212121] hover:text-[#333333] text-sm flex items-center gap-1"
                  >
                    <FaEdit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteReview(rev._id)}
                    className="text-[#212121] hover:text-[#333333] text-sm flex items-center gap-1"
                  >
                    <FaTrashAlt className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}










// import { useState } from "react";
// import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing Edit and Delete icons
// import StarRating from "./StarRating";
// import axiosInstance from "@/axiosConfig"; // ✅ secure axios

// export default function ReviewList({
//   reviews,
//   setReviews,
//   restaurantId,
//   user,
//   hasReviewed,
//   setHasReviewed,
//   backendURL,
// }) {
//   const [editingReviewId, setEditingReviewId] = useState(null);
//   const [editRating, setEditRating] = useState(5);
//   const [editComment, setEditComment] = useState("");

//   const startEditing = (review) => {
//     setEditingReviewId(review._id);
//     setEditRating(review.rating);
//     setEditComment(review.comment);
//   };

//   const cancelEditing = () => {
//     setEditingReviewId(null);
//     setEditRating(5);
//     setEditComment("");
//   };

//   const submitEdit = async () => {
//     try {
//       await axiosInstance.patch(`/reviews/update/${editingReviewId}`, {
//         rating: editRating,
//         comment: editComment,
//       });

//       cancelEditing();
//       const res = await axiosInstance.get(`/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Error updating review:", err);
//       alert("Failed to update review.");
//     }
//   };

//   const deleteReview = async (reviewId) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await axiosInstance.delete(`/reviews/delete/${reviewId}`);

//       const res = await axiosInstance.get(`/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//       setHasReviewed(false);
//     } catch (err) {
//       console.error("Error deleting review:", err);
//       alert("Failed to delete review.");
//     }
//   };

//   if (!reviews || reviews.length === 0) {
//     return <p className="text-zinc-400">No reviews yet.</p>;
//   }

//   // 🔥 updated: extract userId safely
//   const userId = user?._id || user?.user?._id;

//   return (
//     <div className="space-y-4">
//       {reviews.map((rev) => (
//         <div key={rev._id} className="border-b border-zinc-700 pb-3">
//           {editingReviewId === rev._id ? (
//             <>
//               {/* Edit Review Form */}
//               <div className="bg-white rounded-2xl shadow p-6 space-y-4">
//                 <div>
//                   <label className="block mb-1 font-semibold text-gray-700">Your Rating:</label>
//                   <select
//                     value={editRating}
//                     onChange={(e) => setEditRating(Number(e.target.value))}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//                   >
//                     {[5, 4, 3, 2, 1].map((val) => (
//                       <option key={val} value={val}>
//                         {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <textarea
//                   value={editComment}
//                   onChange={(e) => setEditComment(e.target.value)}
//                   placeholder="Leave a comment..."
//                   className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//                   rows={4}
//                 />

//                 <div className="flex gap-4 mt-4">
//                   <button
//                     onClick={submitEdit}
//                     className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={cancelEditing}
//                     className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Display Review */}
//               <div className="font-semibold flex items-center gap-2">
//                 <span>{rev.user?.name || "User"} — </span>
//                 <StarRating rating={rev.rating} />
//               </div>
//               {rev.comment && <p className="text-zinc-400">{rev.comment}</p>}
//               {/* 🔥 updated: match review user id safely */}
//               {userId === rev.user._id && (
//                 <div className="flex gap-4 mt-2">
//                   <button
//                     onClick={() => startEditing(rev)}
//                     className="text-[#212121] hover:text-[#333333] text-sm flex items-center gap-1"
//                   >
//                     <FaEdit className="w-4 h-4" /> Edit
//                   </button>
//                   <button
//                     onClick={() => deleteReview(rev._id)}
//                     className="text-[#212121] hover:text-[#333333] text-sm flex items-center gap-1"
//                   >
//                     <FaTrashAlt className="w-4 h-4" /> Delete
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }







// import { useState } from "react";
// import StarRating from "./StarRating";
// import axiosInstance from "@/axiosConfig"; // ✅ secure axios

// export default function ReviewList({
//   reviews,
//   setReviews,
//   restaurantId,
//   user,
//   hasReviewed,
//   setHasReviewed,
//   backendURL, // still needed for image URLs (if any), not for auth
// }) {
//   const [editingReviewId, setEditingReviewId] = useState(null);
//   const [editRating, setEditRating] = useState(5);
//   const [editComment, setEditComment] = useState("");

//   const startEditing = (review) => {
//     setEditingReviewId(review._id);
//     setEditRating(review.rating);
//     setEditComment(review.comment);
//   };

//   const cancelEditing = () => {
//     setEditingReviewId(null);
//     setEditRating(5);
//     setEditComment("");
//   };

//   const submitEdit = async () => {
//     try {
//       await axiosInstance.patch(`/reviews/update/${editingReviewId}`, {
//         rating: editRating,
//         comment: editComment,
//       });

//       cancelEditing();
//       const res = await axiosInstance.get(`/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Error updating review:", err);
//       alert("Failed to update review.");
//     }
//   };

//   const deleteReview = async (reviewId) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await axiosInstance.delete(`/reviews/delete/${reviewId}`);

//       const res = await axiosInstance.get(`/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//       setHasReviewed(false);
//     } catch (err) {
//       console.error("Error deleting review:", err);
//       alert("Failed to delete review.");
//     }
//   };

//   if (!reviews || reviews.length === 0) {
//     return <p className="text-zinc-400">No reviews yet.</p>;
//   }

//   return (
//     <div className="space-y-4">
//       {reviews.map((rev) => (
//         <div key={rev._id} className="border-b border-zinc-700 pb-3">
//           {editingReviewId === rev._id ? (
//             <>
//               <select
//                 value={editRating}
//                 onChange={(e) => setEditRating(Number(e.target.value))}
//                 className="bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//               >
//                 {[5, 4, 3, 2, 1].map((val) => (
//                   <option key={val} value={val}>
//                     {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//                   </option>
//                 ))}
//               </select>
//               <textarea
//                 value={editComment}
//                 onChange={(e) => setEditComment(e.target.value)}
//                 className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//               ></textarea>
//               <div className="flex gap-2">
//                 <button
//                   onClick={submitEdit}
//                   className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={cancelEditing}
//                   className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="font-semibold flex items-center gap-2">
//                 <span>{rev.user?.name || "User"} — </span>
//                 <StarRating rating={rev.rating} />
//               </div>
//               {rev.comment && <p className="text-zinc-400">{rev.comment}</p>}
//               {user?._id === rev.user._id && (
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => startEditing(rev)}
//                     className="text-blue-400 hover:underline text-sm"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteReview(rev._id)}
//                     className="text-red-400 hover:underline text-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }











// import { useState } from "react";
// import StarRating from "./StarRating";
// import axios from "axios";

// export default function ReviewList({
//   reviews,
//   setReviews,
//   restaurantId,
//   user,
//   hasReviewed,
//   setHasReviewed,
//   backendURL,
//   token,
// }) {
//   const [editingReviewId, setEditingReviewId] = useState(null);
//   const [editRating, setEditRating] = useState(5);
//   const [editComment, setEditComment] = useState("");

//   const startEditing = (review) => {
//     setEditingReviewId(review._id);
//     setEditRating(review.rating);
//     setEditComment(review.comment);
//   };

//   const cancelEditing = () => {
//     setEditingReviewId(null);
//     setEditRating(5);
//     setEditComment("");
//   };

//   const submitEdit = async () => {
//     try {
//       await axios.patch(
//         `${backendURL}/reviews/update/${editingReviewId}`,
//         { rating: editRating, comment: editComment },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       cancelEditing();
//       const res = await axios.get(`${backendURL}/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Error updating review:", err);
//       alert("Failed to update review.");
//     }
//   };

//   const deleteReview = async (reviewId) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;
//     try {
//       await axios.delete(`${backendURL}/reviews/delete/${reviewId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const res = await axios.get(`${backendURL}/reviews/${restaurantId}`);
//       setReviews(res.data.reviews || []);
//       setHasReviewed(false);
//     } catch (err) {
//       console.error("Error deleting review:", err);
//       alert("Failed to delete review.");
//     }
//   };

//   if (!reviews || reviews.length === 0) {
//     return <p className="text-zinc-400">No reviews yet.</p>;
//   }

//   return (
//     <div className="space-y-4">
//       {reviews.map((rev) => (
//         <div key={rev._id} className="border-b border-zinc-700 pb-3">
//           {editingReviewId === rev._id ? (
//             <>
//               <select
//                 value={editRating}
//                 onChange={(e) => setEditRating(Number(e.target.value))}
//                 className="bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//               >
//                 {[5, 4, 3, 2, 1].map((val) => (
//                   <option key={val} value={val}>
//                     {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//                   </option>
//                 ))}
//               </select>
//               <textarea
//                 value={editComment}
//                 onChange={(e) => setEditComment(e.target.value)}
//                 className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//               ></textarea>
//               <div className="flex gap-2">
//                 <button
//                   onClick={submitEdit}
//                   className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={cancelEditing}
//                   className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="font-semibold flex items-center gap-2">
//                 <span>{rev.user?.name || "User"} — </span>
//                 <StarRating rating={rev.rating} />
//               </div>
//               {rev.comment && <p className="text-zinc-400">{rev.comment}</p>}
//               {user?._id === rev.user._id && (
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => startEditing(rev)}
//                     className="text-blue-400 hover:underline text-sm"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteReview(rev._id)}
//                     className="text-red-400 hover:underline text-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
