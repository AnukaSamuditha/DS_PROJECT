import { useEffect, useState } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { redirect } from "react-router";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "./GoogleMapContainer";
import { CircleArrowLeft } from "lucide-react";
import ProfilePicture from '../assets/profile_dummy.jpg';
import Timeline from "./TimeLine";

export function OrderLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirect("/signup");
  }
}
export default function OrderStatus() {
  const { user } = useAuth();
  const [location, setLocation] = useState({ lng: null, lat: null });
  const [isTracking, setIsTracking] = useState(false);
  const [riders, setRiders] = useState([]);
  let watchId;
  let intervalId;

  useEffect(() => {
    socket.on("updatedRider", (driver) => {
      setRiders((prevRiders) => {
        const isRiderExists = prevRiders.find(
          (rider) => rider.riderId === driver.riderId
        );
        if (isRiderExists) {
          return prevRiders.map((rider) => {
            return rider.riderId === driver.riderId
              ? { ...rider, lat: driver.lat, lng: driver.lng }
              : rider;
          });
        }
        return [...prevRiders, driver];
      });
    });

    return () => {
      socket.off("updatedRider");
    };
  }, []);

  useEffect(() => {
    if (isTracking) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              lng: position.coords.longitude,
              lat: position.coords.latitude,
            });
          },
          (error) => {
            console.log("Error fetching location ", error.message);
          },
          { enableHighAccuracy: true }
        );

        intervalId = setInterval(() => {
          console.log("Sending rider location...");
          socket.emit("riderLocation", {
            location: location,
            riderId: user._id,
          });
        }, 5000);
      } else {
        console.error("Geolocation is not supported by this browser");
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, location]);

  return (
    <section className="w-full h-screen flex justify-center items-center p-[16px] gap-5 bg-white">
     <div className="w-1/2 h-full justify-center items-center">
        <div className="w-full h-[4rem] flex justify-between items-start">
            <CircleArrowLeft color="black" size={20} className="cursor-pointer"/>
            <div className="w-auto h-auto flex justify-center items-center gap-3">
                <img src={ProfilePicture} alt="profile-picture" className="w-[30px] h-[30px] rounded-full"/>
                <h4 className="text-black font-semibold text-sm tracking-tight">Anuka Samuditha</h4>
            </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center">
            <div className="w-full h-[30%] rounded-xl bg-[#F7F7F7] flex flex-col justify-start items-start p-[16px]">
                <div className="w-full h-auto flex justify-between items-center">
                 <h5 className="text-md font-bold text-zinc-800 tracking-tight">Order : <span className="font-normal">#4D55CC</span></h5>
                 <div className="w-[105px] h-[33px] rounded-full text-center flex justify-center items-center bg-blue-500 text-white text-sm font-medium tracking-tight">Progress</div>
                </div>
                <Timeline/>
            </div>
        </div>
     </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <GoogleMapContainer riders={riders} />
      </div>
    </section>
  );
}
