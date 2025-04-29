//uodated
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 🔥 fixed import
import axiosInstance from "@/axiosConfig";
import { useAuth } from "../Providers/AuthProvider";
import ReviewList from "../components/ReviewList";
import MenuSection from "../components/MenuSection";
import RestaurantCard from "../components/RestaurantCard";
import { toast } from "react-toastify";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axiosInstance.get(`/restaurants/get-restaurant/${id}`);
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
        setMenuItems(res.data.menuItems || []);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/reviews/${id}`);
        setReviews(res.data.reviews || []);
        if (user) {
          const userId = user?._id || user?.user?._id; // 🔥 safe id check
          const already = res.data.reviews.find((r) => r.user._id === userId);
          if (already) setHasReviewed(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchRestaurantDetails();
    fetchMenuItems();
    fetchReviews();
  }, [id, user]);

  const submitReview = async () => {
    try {
      await axiosInstance.post(`/reviews/${id}`, { rating, comment });
      alert("Thanks for your review!");
      setHasReviewed(true);
      setComment("");
      setRating(5);

      const res = await axiosInstance.get(`/reviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Review error:", err);
      alert(err.response?.data?.message || "Error submitting review.");
    }
  };

  if (!restaurant) return <div className="p-6 text-gray-600">Loading...</div>;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const userRole = user?.role || user?.user?.role; // 🔥 safer role access

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/restaurants")}
        className="text-black bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        ⬅ Back to Restaurants
      </button>

      {/* Restaurant Info Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <RestaurantCard
          restaurant={restaurant}
          averageRating={averageRating}
          backendURL={backendURL}
          role={userRole}
          showMap={true}
        />
      </div>

      {/* Leave a Review */}
      {userRole === "regular" && !hasReviewed && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Your Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
              rows={4}
            />

            <button
              onClick={submitReview}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
        <ReviewList
          reviews={reviews}
          setReviews={setReviews}
          restaurantId={id}
          user={user}
          hasReviewed={hasReviewed}
          setHasReviewed={setHasReviewed}
          backendURL={backendURL}
        />
      </div>

      {/* Menu Items Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Menu</h3>
        <MenuSection menuItems={menuItems} backendURL={backendURL} />
      </div>
    </div>
  );
}








// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with cookies
// import { useAuth } from "../Providers/AuthProvider";
// import ReviewList from "../components/ReviewList";
// import MenuSection from "../components/MenuSection";
// import RestaurantCard from "../components/RestaurantCard";

// export default function RestaurantDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [hasReviewed, setHasReviewed] = useState(false);

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const res = await axiosInstance.get(`/restaurants/get-restaurant/${id}`);
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//       }
//     };

//     const fetchMenuItems = async () => {
//       try {
//         const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
//         setMenuItems(res.data.menuItems || []);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const res = await axiosInstance.get(`/reviews/${id}`);
//         setReviews(res.data.reviews || []);
//         if (user) {
//           const already = res.data.reviews.find((r) => r.user._id === user._id);
//           if (already) setHasReviewed(true);
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err);
//       }
//     };

//     fetchRestaurantDetails();
//     fetchMenuItems();
//     fetchReviews();
//   }, [id, user]);

//   const submitReview = async () => {
//     try {
//       await axiosInstance.post(`/reviews/${id}`, { rating, comment });
//       alert("Thanks for your review!");
//       setHasReviewed(true);
//       setComment("");
//       setRating(5);

//       const res = await axiosInstance.get(`/reviews/${id}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Review error:", err);
//       alert(err.response?.data?.message || "Error submitting review.");
//     }
//   };

//   if (!restaurant) return <div className="p-6 text-gray-600">Loading...</div>;

//   const averageRating =
//     reviews.length > 0
//       ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//       : null;

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-10">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate("/restaurants")}
//         className="text-black bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
//       >
//         ⬅ Back to Restaurants
//       </button>

//       {/* Restaurant Info Card */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <RestaurantCard
//           restaurant={restaurant}
//           averageRating={averageRating}
//           backendURL={backendURL}
//           role={user?.role}
//           showMap={true}
//         />
//       </div>

//       {/* Leave a Review */}
//       {user?.role === "regular" && !hasReviewed && (
//         <div className="bg-white rounded-2xl shadow p-6">
//           <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h3>
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-semibold text-gray-700">Your Rating:</label>
//               <select
//                 value={rating}
//                 onChange={(e) => setRating(Number(e.target.value))}
//                 className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//               >
//                 {[5, 4, 3, 2, 1].map((val) => (
//                   <option key={val} value={val}>
//                     {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Leave a comment..."
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//               rows={4}
//             />

//             <button
//               onClick={submitReview}
//               className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
//             >
//               Submit Review
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Reviews Section */}
//       <div className="space-y-4">
//         <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
//         <ReviewList
//           reviews={reviews}
//           setReviews={setReviews}
//           restaurantId={id}
//           user={user}
//           hasReviewed={hasReviewed}
//           setHasReviewed={setHasReviewed}
//           backendURL={backendURL}
//         />
//       </div>

//       {/* Menu Items Section */}
//       <div className="space-y-4">
//         <h3 className="text-2xl font-bold text-gray-900">Menu</h3>
//         <MenuSection menuItems={menuItems} backendURL={backendURL} />
//       </div>
//     </div>
//   );
// }









//og
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with cookies
// import { useAuth } from "../Providers/AuthProvider";
// import ReviewList from "../components/ReviewList";
// import MenuSection from "../components/MenuSection";
// import RestaurantCard from "../components/RestaurantCard";

// export default function RestaurantDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [hasReviewed, setHasReviewed] = useState(false);

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const res = await axiosInstance.get(`/restaurants/get-restaurant/${id}`);
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//       }
//     };

//     const fetchMenuItems = async () => {
//       try {
//         const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
//         setMenuItems(res.data.menuItems || []);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const res = await axiosInstance.get(`/reviews/${id}`);
//         setReviews(res.data.reviews || []);
//         if (user) {
//           const already = res.data.reviews.find((r) => r.user._id === user._id);
//           if (already) setHasReviewed(true);
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err);
//       }
//     };

//     fetchRestaurantDetails();
//     fetchMenuItems();
//     fetchReviews();
//   }, [id, user]);

//   const submitReview = async () => {
//     try {
//       await axiosInstance.post(`/reviews/${id}`, { rating, comment });
//       alert("Thanks for your review!");
//       setHasReviewed(true);
//       setComment("");
//       setRating(5);

//       const res = await axiosInstance.get(`/reviews/${id}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Review error:", err);
//       alert(err.response?.data?.message || "Error submitting review.");
//     }
//   };

//   if (!restaurant) return <div className="p-4 text-white">Loading...</div>;

//   const averageRating =
//     reviews.length > 0
//       ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//       : null;

//   return (
//     <div className="p-4 text-white max-w-5xl mx-auto">
//       <button
//         onClick={() => navigate("/restaurants")}
//         className="mb-4 text-sm px-3 py-1 bg-zinc-800 border border-zinc-600 rounded hover:bg-zinc-700 transition"
//       >
//         ⬅ Back to Restaurant List
//       </button>

//       <RestaurantCard
//         restaurant={restaurant}
//         averageRating={averageRating}
//         backendURL={backendURL}
//         role={user?.role}
//         showMap={true}
//       />

//       {user?.role === "regular" && !hasReviewed && (
//         <div className="mb-6 mt-10">
//           <h3 className="text-2xl font-semibold mb-4">Leave a Review</h3>
//           <label className="block mb-1">Your Rating:</label>
//           <select
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           >
//             {[5, 4, 3, 2, 1].map((val) => (
//               <option key={val} value={val}>
//                 {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//               </option>
//             ))}
//           </select>

//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Leave a comment..."
//             className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           ></textarea>

//           <button
//             onClick={submitReview}
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Submit Review
//           </button>
//         </div>
//       )}

//       <h3 className="text-2xl font-semibold mt-10 mb-4">Reviews</h3>
//       <ReviewList
//         reviews={reviews}
//         setReviews={setReviews}
//         restaurantId={id}
//         user={user}
//         hasReviewed={hasReviewed}
//         setHasReviewed={setHasReviewed}
//         backendURL={backendURL}
//       />

//       <h3 className="text-2xl font-semibold mt-10 mb-4">Menu</h3>
//       <MenuSection menuItems={menuItems} backendURL={backendURL} />
//     </div>
//   );
// }











// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import ReviewList from "../components/ReviewList";
// import MenuSection from "../components/MenuSection";
// import RestaurantCard from "../components/RestaurantCard"; // ✅ renamed & updated

// export default function RestaurantDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [hasReviewed, setHasReviewed] = useState(false);

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/restaurants/get-restaurant/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//       }
//     };

//     const fetchMenuItems = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/MenuItems/restaurant-menuItems/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setMenuItems(res.data.menuItems || []);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/reviews/${id}`);
//         setReviews(res.data.reviews || []);
//         if (user) {
//           const already = res.data.reviews.find((r) => r.user._id === user._id);
//           if (already) setHasReviewed(true);
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err);
//       }
//     };

//     fetchRestaurantDetails();
//     fetchMenuItems();
//     fetchReviews();
//   }, [id, user]);

//   const submitReview = async () => {
//     try {
//       await axios.post(
//         `${backendURL}/reviews/${id}`,
//         { rating, comment },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Thanks for your review!");
//       setHasReviewed(true);
//       setComment("");
//       setRating(5);
//       const res = await axios.get(`${backendURL}/reviews/${id}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Review error:", err);
//       alert(err.response?.data?.message || "Error submitting review.");
//     }
//   };

//   if (!restaurant) return <div className="p-4 text-white">Loading...</div>;

//   const averageRating =
//     reviews.length > 0
//       ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//       : null;

//   return (
//     <div className="p-4 text-white max-w-5xl mx-auto">
//       {/* ⬅ Back */}
//       <button
//         onClick={() => navigate("/restaurants")}
//         className="mb-4 text-sm px-3 py-1 bg-zinc-800 border border-zinc-600 rounded hover:bg-zinc-700 transition"
//       >
//         ⬅ Back to Restaurant List
//       </button>

//       {/* 🏪 Restaurant Overview */}
//       <RestaurantCard
//         restaurant={restaurant}
//         averageRating={averageRating}
//         backendURL={backendURL}
//         role={user?.role}
//         showMap={true}
//       />

//       {/* ⭐ Leave Review (Only Regular Users) */}
//       {user?.role === "regular" && !hasReviewed && (
//         <div className="mb-6 mt-10">
//           <h3 className="text-2xl font-semibold mb-4">Leave a Review</h3>
//           <label className="block mb-1">Your Rating:</label>
//           <select
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           >
//             {[5, 4, 3, 2, 1].map((val) => (
//               <option key={val} value={val}>
//                 {val} - {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//               </option>
//             ))}
//           </select>

//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Leave a comment..."
//             className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           ></textarea>

//           <button
//             onClick={submitReview}
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Submit Review
//           </button>
//         </div>
//       )}

//       {/* 🗣️ Reviews Section */}
//       <h3 className="text-2xl font-semibold mt-10 mb-4">Reviews</h3>
//       <ReviewList
//         reviews={reviews}
//         setReviews={setReviews}
//         restaurantId={id}
//         user={user}
//         hasReviewed={hasReviewed}
//         setHasReviewed={setHasReviewed}
//         backendURL={backendURL}
//         token={token}
//       />

//       {/* 🍽️ Menu Section */}
//       <h3 className="text-2xl font-semibold mt-10 mb-4">Menu</h3>
//       <MenuSection menuItems={menuItems} backendURL={backendURL} />
//     </div>
//   );
// }



















// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import StarRating from "../components/StarRating";
// import ReviewList from "../components/ReviewList";
// import MenuSection from "@/components/MenuSection";

// export default function RestaurantDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [restaurant, setRestaurant] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [hasReviewed, setHasReviewed] = useState(false);

//   const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;
//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const res = await axios.get(
//           `${backendURL}/restaurants/get-restaurant/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//       }
//     };

//     const fetchMenuItems = async () => {
//       try {
//         const res = await axios.get(
//           `${backendURL}/MenuItems/restaurant-menuItems/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setMenuItems(res.data.menuItems || []);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/reviews/${id}`);
//         setReviews(res.data.reviews || []);
//         if (user) {
//           const already = res.data.reviews.find((r) => r.user._id === user._id);
//           if (already) setHasReviewed(true);
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err);
//       }
//     };

//     fetchRestaurantDetails();
//     fetchMenuItems();
//     fetchReviews();
//   }, [id, user]);

//   const submitReview = async () => {
//     try {
//       await axios.post(
//         `${backendURL}/reviews/${id}`,
//         { rating, comment },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Thanks for your review!");
//       setHasReviewed(true);
//       setComment("");
//       setRating(5);
//       const res = await axios.get(`${backendURL}/reviews/${id}`);
//       setReviews(res.data.reviews || []);
//     } catch (err) {
//       console.error("Review error:", err);
//       alert(err.response?.data?.message || "Error submitting review.");
//     }
//   };

//   if (!restaurant) return <div className="p-4 text-white">Loading...</div>;

//   const [lng, lat] = restaurant.location?.coordinates || [];
//   const averageRating =
//     reviews.length > 0
//       ? (
//           reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//         ).toFixed(1)
//       : null;

//   return (
//     <div className="p-4 text-white max-w-5xl mx-auto">
//       <button
//         onClick={() => navigate("/restaurants")}
//         className="mb-4 text-sm px-3 py-1 bg-zinc-800 border border-zinc-600 rounded hover:bg-zinc-700 transition"
//       >
//         ⬅ Back to Restaurant List
//       </button>

//       <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>

//       <span
//         className={`inline-block px-3 py-1 text-sm rounded font-medium mb-4 ${
//           restaurant.isAvailable ? "bg-green-600" : "bg-red-600"
//         }`}
//       >
//         {restaurant.isAvailable ? "Open" : "Closed"}
//       </span>

//       {restaurant.photo && (
//         <img
//           src={`${backendURL}/uploads/${restaurant.photo}`}
//           alt={restaurant.name}
//           className="w-full h-72 object-cover rounded mb-4"
//         />
//       )}

//       <p className="mb-2 text-zinc-300">{restaurant.description}</p>
//       <p className="text-sm text-zinc-400">📍 {restaurant.address}</p>
//       <p className="text-sm text-zinc-400">☎️ {restaurant.contactNumber}</p>
//       <p className="text-sm text-zinc-400">🕒 {restaurant.openingHours}</p>

//       <h3 className="text-2xl font-semibold mt-10 mb-4">⭐ Reviews</h3>

//       {averageRating && (
//         <div className="flex items-center gap-2 mb-2">
//           <StarRating rating={averageRating} />
//           <span className="text-sm text-zinc-400">({averageRating}/5)</span>
//         </div>
//       )}

//       {user?.role === "regular" && !hasReviewed && (
//         <div className="mb-6">
//           <label className="block mb-1">Your Rating:</label>
//           <select
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           >
//             {[5, 4, 3, 2, 1].map((val) => (
//               <option key={val} value={val}>
//                 {val} -{" "}
//                 {["Amazing", "Good", "Okay", "Bad", "Terrible"][5 - val]}
//               </option>
//             ))}
//           </select>

//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Leave a comment..."
//             className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-white mb-2"
//           ></textarea>

//           <button
//             onClick={submitReview}
//             className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Submit Review
//           </button>
//         </div>
//       )}

//       {/* 🔁 Modularized Review List */}
//       <ReviewList
//         reviews={reviews}
//         setReviews={setReviews}
//         restaurantId={id}
//         user={user}
//         hasReviewed={hasReviewed}
//         setHasReviewed={setHasReviewed}
//         backendURL={backendURL}
//         token={token}
//       />

//       {lat && lng && mapsKey && (
//         <iframe
//           title={`Map of ${restaurant.name}`}
//           width="100%"
//           height="300"
//           className="mt-4 rounded"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={`https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${lat},${lng}&zoom=15`}
//         ></iframe>
//       )}

//       <h3 className="text-2xl font-semibold mt-10 mb-4">Menu</h3>

//       {menuItems.length === 0 ? (
//         <p className="text-zinc-400">No menu items available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {menuItems.map((item) => (
//             <div key={item._id} className="bg-zinc-800 p-4 rounded shadow">
//               {item.photo && (
//                 <img
//                   src={`${backendURL}/uploads/${item.photo}`}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded mb-2"
//                 />
//               )}
//               <h4 className="text-lg font-semibold">{item.name}</h4>
//               <p className="text-sm text-zinc-400 mb-1">{item.description}</p>
//               <p className="text-sm text-white font-bold">Rs. {item.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }










