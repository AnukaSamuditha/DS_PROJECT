import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayViewF,
  OverlayView,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { LocationMarker } from "./ui/LocationMarker";
import RiderMarker from "@/assets/rider_marker.png";
import DestinationMarker from "@/assets/destination_marker.png";
import UserMarker from "@/assets/user_marker.png";
import { socket } from "@/Socket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

const containerStyle = {
  width: "100%",
  height: "550px",
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

export default function GoogleMapContainer({
  riders,
  isRiderMap,
  isLoaded,
  order,
  singleRider,
  acceptedRiderId,
  userLocation,
  isTracking,
  isPicked,
}) {
  const [map, setMap] = React.useState(null);
  const [availableRiders, setAvailableRiders] = useState(riders || []);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [singleRiderRoute, setSingleRiderRoute] = useState(null);
  const [acceptedRiderRoute, setAcceptedRiderRoute] = useState(null);
  const [singleRiderInfo, setSingleRiderInfo] = useState(singleRider);
  const [acceptedRiderInfo, setAcceptedRiderInfo] = useState(null);
  const [singleRiderInitial, setSingleRiderInitial] = useState(null);
  const [accRiderInitial, setAccRiderInitial] = useState(null);
  const [orderStatus, setOrderStatus] = useState("order_accepted");
  const hasSimulated = React.useRef(false);
  const isLoadedSingleRider = useRef(false);
  const singleRiderMarkerRef = useRef(null);
  const accRiderMarkerRef = useRef(null);
  const queryClient = useQueryClient();
  const initalRouteCheckSingle = useRef(false);
  const initialAssignCheckAccept = useRef(false);
  const isLoadedAcceptedRider = useRef(false);
  const accRiderIdRef = useRef(null);

  const shopLocationRef = useRef(null);
  const animationFrameRef = useRef(null);
  const activeSimulationRef = useRef(false);
  const routeUpdateRef = useRef(false);

  const navigate = useNavigate();

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(center);
    map.setZoom(13); //changed fitBounds to setZoom

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (isLoaded && order && order.shop) {
      setDestinationPoint({
        lat: order.shop.location.lat,
        lng: order.shop.location.lng,
      });
    }
  }, [isLoaded, order]);

  useEffect(() => {
    if (isPicked) {
      cancelActiveSimulation();
      handleOrderToUser();
    }
  }, [isPicked]);

  const handleOrderToUser = () => {
    hasSimulated.current = false;

    setSingleRiderInfo((prev) => ({
      ...prev,
      updatedLocation: {
        latitude: shopLocationRef.current.lat(),
        longitude: shopLocationRef.current.lng(),
      },
    }));
    setDestinationPoint({
      lat: order.user.location.lat,
      lng: order.user.location.lng,
    });
    // setOrderStatus("picked")
    // orderStatusMutation.mutate("picked");

    if (!initalRouteCheckSingle.current) return;
    setOrderStatus("onTheWay");
    orderStatusMutation.mutate("onTheWay");
  };

  React.useEffect(() => {
    if (singleRider && !isLoadedSingleRider.current) {
      setSingleRiderInfo(singleRider);
      setSingleRiderInitial(singleRider.location);
      isLoadedSingleRider.current = true;
    }
  }, [singleRider]);

  const { data: currentOrderStatus, isFetched } = useQuery({
    queryKey: ["order_status", order?._id],

    queryFn: async () => {
      if (!order._id) {
        console.log("Order id is undefined!");
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/status/${order._id}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data) {
        console.log("order not found!");
        return;
      }

      return res.data.status.status;
    },
    enabled:
      order?._id && (acceptedRiderId || singleRiderInfo) && isTracking
        ? true
        : false,
    retryOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 2000,
  });

  useEffect(()=>{
    
    if(currentOrderStatus === "completed"){
      setSingleRiderInfo(null);
      setSingleRiderRoute(null);
      setSingleRiderInitial(null);
    }

  },[currentOrderStatus])

  useEffect(() => {
    if (acceptedRiderId && !isLoadedAcceptedRider.current) {
      setAcceptedRiderInfo(acceptedRiderId);
      accRiderIdRef.current = acceptedRiderId;
      isLoadedAcceptedRider.current = true;
    }
  }, [acceptedRiderId]);

  useEffect(() => {
    if (acceptedRiderInfo) {
      socket.emit("rider_location_request", {
        riderId: acceptedRiderId,
      });

      socket.on("rider_location_updated", (data) => {
        if (data.riderId === acceptedRiderId) {
          if (accRiderMarkerRef.current) {
            accRiderMarkerRef.current.setPosition({
              lng: Number(data.riderLocation[0].longitude),
              lat: Number(data.riderLocation[0].latitude),
            });
          }

          if (!initialAssignCheckAccept.current) {
            setAccRiderInitial(
              new window.google.maps.LatLng(
                Number(data.riderLocation[0].latitude),
                Number(data.riderLocation[0].longitude)
              )
            );
            initialAssignCheckAccept.current = true;
          }

          if (currentOrderStatus === "reached") {
            setAccRiderInitial(
              new window.google.maps.LatLng(
                Number(order.shop.location.lat),
                Number(order.shop.location.lng)
              )
            );

            const shopPos = new window.google.maps.LatLng(
              Number(order.user.location.lat),
              Number(order.user.location.lng)
            );

            setDestinationPoint({
              lat: shopPos.lat(),
              lng: shopPos.lng(),
            });

            routeUpdateRef.current = true;

            accRiderMarkerRef.current.setPosition({
              lng: Number(data.riderLocation[0].longitude),
              lat: Number(data.riderLocation[0].latitude),
            });
          }

          if (currentOrderStatus === "picked") {
            setTimeout(() => {
              getRoute();
            }, 1000);
          }

          if (currentOrderStatus === "completed") {
            setAcceptedRiderInfo(null);
            setAccRiderInitial(null);
            setDestinationPoint(null);
            setAcceptedRiderRoute(null);

            socket.emit("tracking_rider_stop");
            socket.off("rider_location_updated");
            queryClient.invalidateQueries(["day_orders"]);

            navigate("/success");
            return;
          }
        }
      });
    }
    return () => {
      socket.emit("tracking_rider_stop");
      socket.off("rider_location_updated");
    };
  }, [acceptedRiderInfo, currentOrderStatus]);

  useEffect(() => {
    if ((accRiderInitial && destinationPoint) || routeUpdateRef.current) {
      getRoute();
      routeUpdateRef.current = false;
    }
  }, [accRiderInitial, destinationPoint, routeUpdateRef.current]);

  React.useEffect(() => {
    if (
      singleRiderInfo &&
      singleRiderInfo.updatedLocation &&
      destinationPoint &&
      !initalRouteCheckSingle.current
    ) {
      console.log(
        "Calling getRoute() with: ",
        singleRiderInfo,
        destinationPoint
      );
      setSingleRiderInitial(
        new window.google.maps.LatLng(
          Number(singleRider.updatedLocation.latitude),
          Number(singleRider.updatedLocation.longitude)
        )
      );
      setTimeout(() => {
        getRoute();
      }, 1500);
      initalRouteCheckSingle.current = true;
    }
  }, [destinationPoint, singleRiderInfo]);

  const orderStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      console.log("orderStatusMutation method is called", newStatus);
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${order._id}`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["order_status", order._id], data.order.status);
      queryClient.setQueryData(["order_data", order._id], data.order);
    },
    onError: (error) => {
      console.log(
        "Error occured while updating the order status! ",
        error.message
      );
    },
  });

  const cancelActiveSimulation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    activeSimulationRef.current = false;
  };

  const simulatePath = async (pathPoints, onComplete) => {
    cancelActiveSimulation();

    if (
      !pathPoints ||
      pathPoints.length === 0 ||
      !singleRiderMarkerRef.current
    ) {
      return;
    }

    let currentStep = 0;
    const delay = 100;

    activeSimulationRef.current = true;
    let lastTimestamp = performance.now();

    const step = async (timestamp) => {
      if (!activeSimulationRef.current || !singleRiderMarkerRef.current) {
        return;
      }

      const elapsed = timestamp - lastTimestamp;

      if (elapsed >= delay) {
        lastTimestamp = timestamp;

        if (currentStep >= pathPoints.length) {
          const finalPosition = pathPoints[pathPoints.length - 1];
          shopLocationRef.current = finalPosition;
          singleRiderMarkerRef.current.setPosition(finalPosition);

          socket.emit("riderLocation", {
            location: {
              lat: finalPosition.lat(),
              lng: finalPosition.lng(),
            },
            riderId: singleRiderInfo.riderId,
            riderName: singleRiderInfo.username,
          });

          activeSimulationRef.current = false;
          onComplete?.();
          return;
        }

        const point = pathPoints[currentStep];
        singleRiderMarkerRef.current.setPosition(point);

        socket.emit("riderLocation", {
          location: {
            lat: point.lat(),
            lng: point.lng(),
          },
          riderId: singleRiderInfo.riderId,
          riderName: singleRiderInfo.username,
        });

        currentStep++;
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const simulateRider = (order) => {
    cancelActiveSimulation();

    if (hasSimulated.current && orderStatus !== "onTheWay") return;

    if (!singleRiderInfo || !singleRiderMarkerRef.current || !singleRiderRoute)
      return;

    const route = singleRiderRoute.routes[0];
    const fullPath = [];

    route.legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        fullPath.push(...step.path);
      });
    });

    simulatePath(fullPath, () => {
      if (orderStatus === "order_accepted") {
        console.log("Reached shop — updating to 'picked'");
        orderStatusMutation.mutate("reached");
      } else if (orderStatus === "onTheWay") {
        console.log("Reached user — updating to 'delivered'");

        setOrderStatus("delivered");

        socket.emit("rider_arrived", {
          customerId: order.user.id,
          orderId: order._id,
        });
        orderStatusMutation.mutate("delivered");
        initalRouteCheckSingle.current = false;
      }
    });

    if (orderStatus === "order_accepted") {
      hasSimulated.current = true;
    }
  };

  React.useEffect(() => {
    if (destinationPoint) {
      getRoute();
    }
  }, [destinationPoint]);

  useEffect(() => {
    return () => {
      cancelActiveSimulation();
    };
  }, []);

  React.useEffect(() => {
    if (
      singleRiderRoute &&
      destinationPoint &&
      (!hasSimulated.current || orderStatus === "onTheWay")
    ) {
      simulateRider(order);
      if (orderStatus === "order_accepted") {
        hasSimulated.current = true;
      }
    }
  }, [singleRiderRoute, destinationPoint]);

  const getRoute = () => {
    if (
      !isLoaded ||
      !window.google ||
      !window.google.maps ||
      !order ||
      !destinationPoint
    )
      return;

    const DirectionsService = new window.google.maps.DirectionsService();

    if (
      singleRiderInfo &&
      singleRiderInfo.updatedLocation &&
      destinationPoint
    ) {
      console.log("get Route method is called...");
      DirectionsService.route(
        {
          origin: {
            lat: Number(singleRiderInfo.updatedLocation.latitude),
            lng: Number(singleRiderInfo.updatedLocation.longitude),
          },
          destination: { lat: destinationPoint.lat, lng: destinationPoint.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setSingleRiderRoute(result);
          } else {
            console.log("Error getting the route. Status:", status);
          }
        }
      );
    }

    if (accRiderInitial && destinationPoint) {
      DirectionsService.route(
        {
          origin: {
            lat: Number(accRiderInitial.lat()),
            lng: Number(accRiderInitial.lng()),
          },
          destination: { lat: destinationPoint.lat, lng: destinationPoint.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setAcceptedRiderRoute(result);
          } else {
            console.log("Error getting the route. Status:", status);
          }
        }
      );
    }
  };

  console.log("SINGLE RIDER LAT ", singleRiderInfo);
  //console.log("SINGLE RIDER LNG ",singleRiderInfo);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={source}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapId: import.meta.env.VITE_MAP_ID,
        mapTypeControl: false,
        gestureHandling: "greedy",
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
      }}
    >
      {isRiderMap &&
        riders &&
        riders.map((driver) => (
          <MarkerF
            key={driver.riderId}
            position={{ lat: Number(driver.lat), lng: Number(driver.lng) }}
          >
            <OverlayViewF
              position={{ lat: Number(driver.lat), lng: Number(driver.lng) }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              {/* <LocationMarker /> */}
              {/* <div className="bg-black w-auto max-w-[120px] h-[40px]  rounded-full flex justify-start items-center px-1.5 py-1.5 gap-2 pr-3">
              <img src={ProfilePicture} className="w-[30px] h-[30px] rounded-full"/>
              <h1 className="text-xs text-white font-semibold tracking-tight max-w-[120px] truncate overflow-hidden whitespace-nowrap">{driver.riderName}</h1>
            </div> */}
            </OverlayViewF>
          </MarkerF>
        ))}

      {singleRiderInfo && isTracking && (
        <MarkerF
          key={singleRiderInfo.riderId}
          onLoad={(marker) => {
            singleRiderMarkerRef.current = marker;
          }}
          position={singleRiderInitial}
          icon={{
            url: RiderMarker,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        >
          <OverlayViewF
            position={{
              lat: Number(
                singleRiderInfo.updatedLocation?.latitude ??
                  singleRiderInfo.location.lat
              ),
              lng: Number(
                singleRiderInfo.updatedLocation?.longitude ??
                  singleRiderInfo.location.lng
              ),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          ></OverlayViewF>
        </MarkerF>
      )}

      {destinationPoint && order && (
        <MarkerF
          key={order.shop.id}
          position={{
            lat: Number(destinationPoint.lat),
            lng: Number(destinationPoint.lng),
          }}
          icon={{
            url: DestinationMarker,
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        >
          <OverlayViewF
            position={{
              lat: Number(destinationPoint.lat),
              lng: Number(destinationPoint.lng),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            {/* <LocationMarker /> */}
            {/* <div className="bg-black w-auto max-w-[120px] h-[40px]  rounded-full flex justify-start items-center px-1.5 py-1.5 gap-2 pr-3">
          <img src={ProfilePicture} className="w-[30px] h-[30px] rounded-full"/>
          <h1 className="text-xs text-white font-semibold tracking-tight max-w-[120px] truncate overflow-hidden whitespace-nowrap">{driver.riderName}</h1>
        </div> */}
            {/* <div className="w-[50px] h-[30px] bg-white flex justify-center items-center px-3 py-3">
              <h4 className="text-sm font-medium tracking-tight text-black">
                Destination
              </h4>
            </div> */}
          </OverlayViewF>
        </MarkerF>
      )}

      {acceptedRiderInfo && (
        <MarkerF
          key={acceptedRiderInfo}
          onLoad={(marker) => (accRiderMarkerRef.current = marker)}
          position={accRiderInitial}
          icon={{
            url: RiderMarker,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        >
          {/* <OverlayViewF
              position={{
                lat: Number(singleRiderInfo.location.latitude),
                lng: Number(singleRiderInfo.location.longitude),
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            > */}
          {/* <LocationMarker /> */}
          {/* </OverlayViewF> */}
        </MarkerF>
      )}

      {userLocation && userLocation.location && (
        <MarkerF
          key={userLocation.id}
          position={{
            lat: Number(userLocation.location.lat),
            lng: Number(userLocation.location.lng),
          }}
          icon={{
            url: UserMarker,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        >
          <OverlayViewF
            position={{
              lat: Number(userLocation.location.lat),
              lng: Number(userLocation.location.lng),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            {/* <LocationMarker /> */}
          </OverlayViewF>
        </MarkerF>
      )}

      {singleRiderRoute && isTracking && (
        <DirectionsRenderer
          directions={singleRiderRoute}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#000000",
              strokeWeight: 5,
            },
          }}
        />
      )}

      {acceptedRiderRoute && (
        <DirectionsRenderer
          directions={acceptedRiderRoute}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#000000",
              strokeWeight: 5,
            },
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}
