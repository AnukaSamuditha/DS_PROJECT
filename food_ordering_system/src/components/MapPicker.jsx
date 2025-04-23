import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

// ⛳ Define once outside component to avoid performance warnings
const libraries = ["places"];
const containerStyle = {
  width: "100%",
  height: "400px",
};
const defaultCenter = {
  lat: 6.9271, // Default to Colombo
  lng: 79.8612,
};

export default function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(newPosition);
      map?.panTo(newPosition);
      onLocationSelect({
        lat: newPosition.lat,
        lng: newPosition.lng,
        address: place.formatted_address || "",
      });
    }
  };

  const handleMapClick = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setPosition(newPos);
    onLocationSelect({ lat: newPos.lat, lng: newPos.lng, address: "" });
  };

  const handleMarkerDragEnd = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setPosition(newPos);
    onLocationSelect({ lat: newPos.lat, lng: newPos.lng, address: "" });
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<p className="text-white mb-2">Loading map...</p>}
    >
      <div className="mb-3">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for location"
            className="p-2 mb-2 w-full rounded border border-zinc-600 bg-zinc-800 text-white"
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={14}
          onLoad={setMap}
          onClick={handleMapClick}
        >
          <Marker
            position={position}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}








// import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
// import { useState, useRef } from "react";

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const defaultCenter = {
//   lat: 6.9271, // Default to Colombo
//   lng: 79.8612,
// };

// export default function MapPicker({ onLocationSelect }) {
//   const [position, setPosition] = useState(defaultCenter);
//   const [map, setMap] = useState(null);
//   const autocompleteRef = useRef(null);

//   const handlePlaceChanged = () => {
//     const place = autocompleteRef.current.getPlace();
//     if (place && place.geometry) {
//       const newPosition = {
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//       };
//       setPosition(newPosition);
//       map.panTo(newPosition);
//       onLocationSelect({
//         lat: newPosition.lat,
//         lng: newPosition.lng,
//         address: place.formatted_address || "",
//       });
//     }
//   };

//   return (
//     <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
//       <div className="mb-3">
//         <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
//           <input
//             type="text"
//             placeholder="Search for location"
//             className="p-2 mb-2 w-full rounded border border-zinc-600 bg-zinc-800 text-white"
//           />
//         </Autocomplete>

//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={position}
//           zoom={14}
//           onLoad={setMap}
//           onClick={(e) => {
//             const newPos = {
//               lat: e.latLng.lat(),
//               lng: e.latLng.lng(),
//             };
//             setPosition(newPos);
//             onLocationSelect({ lat: newPos.lat, lng: newPos.lng, address: "" });
//           }}
//         >
//           <Marker
//             position={position}
//             draggable
//             onDragEnd={(e) => {
//               const newPos = {
//                 lat: e.latLng.lat(),
//                 lng: e.latLng.lng(),
//               };
//               setPosition(newPos);
//               onLocationSelect({ lat: newPos.lat, lng: newPos.lng, address: "" });
//             }}
//           />
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// }
