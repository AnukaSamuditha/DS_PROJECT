import React from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayViewF,
  useJsApiLoader,
  OverlayView,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

//This can be used when user provides the source it should center the map according
//to the source, and update can be done using useState hook
const center = {
  lat: 6.8449,
  lng: 80.0035,
};

const source = {
  lat: 6.8449,
  lng: 80.0035,
};

const destination = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function GoogleMapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API,
  });

  const [map, setMap] = React.useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      getRoute();
    }
  }, [isLoaded, source, destination]);

  const getRoute = () => {
    if (!isLoaded || !window.google || !window.google.maps) return;

    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: { lat: source.lat, lng: source.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("Route result:", result);
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("result", result);
          setDirectionRoutePoints(result);
        } else {
          console.log("Error getting the route. Status:", status);
        }
      }
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapId: import.meta.env.VITE_MAP_ID,
      }}
    >
      <MarkerF position={{ lat: source.lat, lng: source.lng }}>
        <OverlayViewF
          position={{ lat: source.lat, lng: source.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="bg-white w-[30px] h-[10px] inline-block">
            <h1 className="text-sm font-semibold text-blue-600">Home</h1>
          </div>
        </OverlayViewF>
      </MarkerF>

      <MarkerF position={{ lat: destination.lat, lng: destination.lng }}>
        <OverlayViewF
          position={{ lat: destination.lat, lng: destination.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="bg-white w-[30px] h-[10px] inline-block">
            <h1 className="text-sm font-semibold text-blue-600">Destination</h1>
          </div>
        </OverlayViewF>
      </MarkerF>

      {directionRoutePoints && (
        <DirectionsRenderer
          directions={directionRoutePoints}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#4D55CC",
              strokeWeight: 6,
            },
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}
