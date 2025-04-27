import StarRating from "./StarRating";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
//import { useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

export default function RestaurantCard({
  restaurant,
  averageRating,
  backendURL,
  role,
  onView,
  onReview,
  onEdit,
  onDelete,
  onToggleAvailability,
  onManageMenu,
  onVerify,
  showMap = true,
}) {
  const [lng, lat] = restaurant.location?.coordinates || [];

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg transition space-y-4">
      {/* Restaurant Image */}
      {restaurant.photo && (
        <img
          src={`${backendURL}/uploads/${restaurant.photo}`}
          alt={restaurant.name}
          className="w-full h-60 object-cover rounded-xl mb-3"
        />
      )}

      {/* Restaurant Info */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            restaurant.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {restaurant.isAvailable ? "Open" : "Closed"}
        </span>
      </div>

      <p className="text-gray-600 text-sm">{restaurant.description}</p>
      <p className="text-gray-500 text-sm">📍 {restaurant.address}</p>
      <p className="text-gray-500 text-sm">☎️ {restaurant.contactNumber}</p>
      <p className="text-gray-500 text-sm">🕒 {restaurant.openingHours}</p>

      {/* Star Rating */}
      {averageRating && (
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={averageRating} />
          <span className="text-sm text-gray-500">({averageRating}/5)</span>
        </div>
      )}

      {/* Admin Verification */}
      {role === "admin" && (
        <p className="text-sm text-gray-500">
          Verification:{" "}
          <span className={restaurant.adminApproved ? "text-green-600" : "text-red-500"}>
            {restaurant.adminApproved ? "✅ Verified" : "❌ Unverified"}
          </span>
        </p>
      )}

      {/* Google Map */}
      {showMap && lat && lng && (
        <div className="mt-4 rounded-xl overflow-hidden">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat, lng }}
              zoom={15}
            >
              <Marker position={{ lat, lng }} />
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* 🎯 Regular User Actions */}
        {role === "regular" && (
          <>
            {onView && (
              <button
                onClick={onView}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                View Menu
              </button>
            )}
            {onReview && (
              <button
                onClick={onReview}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Leave Review
              </button>
            )}
          </>
        )}

        {/* 👨‍🍳 Restaurant Owner Actions */}
        {role === "restaurantOwner" && (
          <>
            {onManageMenu && (
              <button
                onClick={onManageMenu}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Manage Menu
              </button>
            )}
            {onToggleAvailability && (
              <button
                onClick={onToggleAvailability}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm transition"
              >
                Toggle Availability
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Delete
              </button>
            )}
          </>
        )}

        {/* 🛡️ Admin Actions */}
        {role === "admin" && (
          <>
            {onVerify && (
              <button
                onClick={onVerify}
                className={`${
                  restaurant.adminApproved
                    ? "bg-gray-400 hover:bg-gray-500 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                } px-4 py-2 rounded-lg text-sm transition`}
              >
                {restaurant.adminApproved ? "Unverify" : "Verify"}
              </button>
            )}
            {onToggleAvailability && (
              <button
                onClick={onToggleAvailability}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm transition"
              >
                Toggle Availability
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}








//og
// import StarRating from "./StarRating";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import { useState } from "react";

// const mapContainerStyle = {
//   width: "100%",
//   height: "250px",
// };

// export default function RestaurantCard({
//   restaurant,
//   averageRating,
//   backendURL,
//   role,
//   onView,
//   onReview,
//   onEdit,
//   onDelete,
//   onToggleAvailability,
//   onManageMenu,
//   onVerify,
//   showMap = true,
// }) {
//   const [lng, lat] = restaurant.location?.coordinates || [];

//   return (
//     <div className="border border-gray-600 p-4 rounded-md bg-zinc-900">
//       {restaurant.photo && (
//         <img
//           src={`${backendURL}/uploads/${restaurant.photo}`}
//           alt={restaurant.name}
//           className="w-full h-60 object-cover rounded mb-3"
//         />
//       )}

//       <div className="flex items-center justify-between mb-1">
//         <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
//         <span
//           className={`px-2 py-1 text-sm rounded font-medium ${
//             restaurant.isAvailable ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {restaurant.isAvailable ? "Open" : "Closed"}
//         </span>
//       </div>

//       <p className="text-zinc-300 text-sm mb-1">{restaurant.description}</p>
//       <p className="text-sm text-zinc-400">📍 {restaurant.address}</p>
//       <p className="text-sm text-zinc-400">☎️ {restaurant.contactNumber}</p>
//       <p className="text-sm text-zinc-400 mb-2">🕒 {restaurant.openingHours}</p>

//       {averageRating && (
//         <div className="flex items-center gap-2 mb-2">
//           <StarRating rating={averageRating} />
//           <span className="text-sm text-zinc-400">({averageRating}/5)</span>
//         </div>
//       )}

//       {role === "admin" && (
//         <p className="text-sm text-zinc-400 mb-1">
//           Verification:{" "}
//           <span className={restaurant.adminApproved ? "text-green-400" : "text-red-400"}>
//             {restaurant.adminApproved ? "✅ Verified" : "❌ Unverified"}
//           </span>
//         </p>
//       )}

//       {showMap && lat && lng && (
//         <div className="mt-4 rounded overflow-hidden">
//           <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               center={{ lat, lng }}
//               zoom={15}
//             >
//               <Marker position={{ lat, lng }} />
//             </GoogleMap>
//           </LoadScript>
//         </div>
//       )}

//       <div className="flex flex-wrap gap-2 mt-4">
//         {/* 🎯 Regular User Actions */}
//         {role === "regular" && (
//           <>
//             {onView && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onView}>
//                 View Menu
//               </button>
//             )}
//             {onReview && (
//               <button className="bg-green-600 px-3 py-1 rounded text-sm" onClick={onReview}>
//                 Leave Review
//               </button>
//             )}
//           </>
//         )}

//         {/* 👨‍🍳 Restaurant Owner Actions */}
//         {role === "restaurantOwner" && (
//           <>
//             {onManageMenu && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onManageMenu}>
//                 Manage Menu
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button
//                 className="bg-yellow-500 px-3 py-1 rounded text-sm"
//                 onClick={onToggleAvailability}
//               >
//                 Toggle Availability
//               </button>
//             )}
//             {onEdit && (
//               <button className="bg-purple-600 px-3 py-1 rounded text-sm" onClick={onEdit}>
//                 Edit
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}

//         {/* 🛡️ Admin Actions */}
//         {role === "admin" && (
//           <>
//             {onVerify && (
//               <button
//                 className={`${
//                   restaurant.adminApproved ? "bg-gray-500" : "bg-green-600"
//                 } px-3 py-1 rounded text-sm`}
//                 onClick={onVerify}
//               >
//                 {restaurant.adminApproved ? "Unverify" : "Verify"}
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button
//                 className="bg-yellow-500 px-3 py-1 rounded text-sm"
//                 onClick={onToggleAvailability}
//               >
//                 Toggle Availability
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





// // components/RestaurantCard.jsx
// import StarRating from "./StarRating";

// export default function RestaurantCard({
//   restaurant,
//   averageRating,
//   backendURL,
//   role,
//   onView,
//   onReview,
//   onEdit,
//   onDelete,
//   onToggleAvailability,
//   onManageMenu,
//   onVerify,
//   showMap = true,
// }) {
//   const [lng, lat] = restaurant.location?.coordinates || [];

//   return (
//     <div className="border border-gray-600 p-4 rounded-md bg-zinc-900">
//       {restaurant.photo && (
//         <img
//           src={`${backendURL}/uploads/${restaurant.photo}`}
//           alt={restaurant.name}
//           className="w-full h-60 object-cover rounded mb-3"
//         />
//       )}

//       <div className="flex items-center justify-between mb-1">
//         <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
//         <span
//           className={`px-2 py-1 text-sm rounded font-medium ${
//             restaurant.isAvailable ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {restaurant.isAvailable ? "Open" : "Closed"}
//         </span>
//       </div>

//       <p className="text-zinc-300 text-sm mb-1">{restaurant.description}</p>
//       <p className="text-sm text-zinc-400">📍 {restaurant.address}</p>
//       <p className="text-sm text-zinc-400">☎️ {restaurant.contactNumber}</p>
//       <p className="text-sm text-zinc-400 mb-2">🕒 {restaurant.openingHours}</p>

//       {averageRating && (
//         <div className="flex items-center gap-2 mb-2">
//           <StarRating rating={averageRating} />
//           <span className="text-sm text-zinc-400">({averageRating}/5)</span>
//         </div>
//       )}

//       {role === "admin" && (
//         <p className="text-sm text-zinc-400 mb-1">
//           Verification:{" "}
//           <span className={restaurant.adminApproved ? "text-green-400" : "text-red-400"}>
//             {restaurant.adminApproved ? "✅ Verified" : "❌ Unverified"}
//           </span>
//         </p>
//       )}

//       {showMap && lat && lng && (
//         <iframe
//           title={`Map of ${restaurant.name}`}
//           width="100%"
//           height="250"
//           className="rounded mt-3"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY}&center=${lat},${lng}&zoom=15`}
//         ></iframe>
//       )}

//       <div className="flex flex-wrap gap-2 mt-4">
//         {/* 🎯 Regular User Actions */}
//         {role === "regular" && (
//           <>
//             {onView && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onView}>
//                 View Menu
//               </button>
//             )}
//             {onReview && (
//               <button className="bg-green-600 px-3 py-1 rounded text-sm" onClick={onReview}>
//                 Leave Review
//               </button>
//             )}
//           </>
//         )}

//         {/* 👨‍🍳 Restaurant Owner Actions */}
//         {role === "restaurantOwner" && (
//           <>
//             {onManageMenu && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onManageMenu}>
//                 Manage Menu
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button className="bg-yellow-500 px-3 py-1 rounded text-sm" onClick={onToggleAvailability}>
//                 Toggle Availability
//               </button>
//             )}
//             {onEdit && (
//               <button className="bg-purple-600 px-3 py-1 rounded text-sm" onClick={onEdit}>
//                 Edit
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}

//         {/* 🛡️ Admin Actions */}
//         {role === "admin" && (
//           <>
//             {onVerify && (
//               <button
//                 className={`${
//                   restaurant.adminApproved ? "bg-gray-500" : "bg-green-600"
//                 } px-3 py-1 rounded text-sm`}
//                 onClick={onVerify}
//               >
//                 {restaurant.adminApproved ? "Unverify" : "Verify"}
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button className="bg-yellow-500 px-3 py-1 rounded text-sm" onClick={onToggleAvailability}>
//                 Toggle Availability
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }






// // components/RestaurantCard.jsx
// import StarRating from "./StarRating";

// export default function RestaurantCard({
//   restaurant,
//   averageRating,
//   backendURL,
//   role,
//   onView,
//   onReview,
//   onEdit,
//   onDelete,
//   onToggleAvailability,
//   onManageMenu,
//   onVerify,
//   showMap = true,
// }) {
//   const [lng, lat] = restaurant.location?.coordinates || [];

//   return (
//     <div className="border border-gray-600 p-4 rounded-md bg-zinc-900">
//       {restaurant.photo && (
//         <img
//           src={`${backendURL}/uploads/${restaurant.photo}`}
//           alt={restaurant.name}
//           className="w-full h-60 object-cover rounded mb-3"
//         />
//       )}

//       <div className="flex items-center justify-between mb-1">
//         <h3 className="text-2xl font-semibold">{restaurant.name}</h3>
//         <span
//           className={`px-2 py-1 text-sm rounded font-medium ${
//             restaurant.isAvailable ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {restaurant.isAvailable ? "Open" : "Closed"}
//         </span>
//       </div>

//       <p className="text-zinc-300 text-sm mb-1">{restaurant.description}</p>
//       <p className="text-sm text-zinc-400">📍 {restaurant.address}</p>
//       <p className="text-sm text-zinc-400">☎️ {restaurant.contactNumber}</p>
//       <p className="text-sm text-zinc-400 mb-2">🕒 {restaurant.openingHours}</p>

//       {averageRating && (
//         <div className="flex items-center gap-2 mb-2">
//           <StarRating rating={averageRating} />
//           <span className="text-sm text-zinc-400">({averageRating}/5)</span>
//         </div>
//       )}

//       {showMap && lat && lng && (
//         <iframe
//           title={`Map of ${restaurant.name}`}
//           width="100%"
//           height="250"
//           className="rounded mt-3"
//           style={{ border: 0 }}
//           loading="lazy"
//           allowFullScreen
//           referrerPolicy="no-referrer-when-downgrade"
//           src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY}&center=${lat},${lng}&zoom=15`}
//         ></iframe>
//       )}

//       <div className="flex flex-wrap gap-2 mt-4">
//         {/* 🎯 REGULAR USER */}
//         {role === "regular" && (
//           <>
//             {onView && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onView}>
//                 View Menu
//               </button>
//             )}
//             {onReview && (
//               <button className="bg-green-600 px-3 py-1 rounded text-sm" onClick={onReview}>
//                 Leave Review
//               </button>
//             )}
//           </>
//         )}

//         {/* 🧑‍🍳 OWNER */}
//         {role === "restaurantOwner" && (
//           <>
//             {onManageMenu && (
//               <button className="bg-blue-600 px-3 py-1 rounded text-sm" onClick={onManageMenu}>
//                 Manage Menu
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button className="bg-yellow-500 px-3 py-1 rounded text-sm" onClick={onToggleAvailability}>
//                 Toggle Availability
//               </button>
//             )}
//             {onEdit && (
//               <button className="bg-purple-600 px-3 py-1 rounded text-sm" onClick={onEdit}>
//                 Edit
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}

//         {/* 🛡️ ADMIN */}
//         {role === "admin" && (
//           <>
//             {onVerify && (
//               <button className="bg-green-600 px-3 py-1 rounded text-sm" onClick={onVerify}>
//                 Verify Restaurant
//               </button>
//             )}
//             {onToggleAvailability && (
//               <button className="bg-yellow-500 px-3 py-1 rounded text-sm" onClick={onToggleAvailability}>
//                 Toggle Availability
//               </button>
//             )}
//             {onDelete && (
//               <button className="bg-red-600 px-3 py-1 rounded text-sm" onClick={onDelete}>
//                 Delete
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
