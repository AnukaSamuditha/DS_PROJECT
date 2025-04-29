import { NavLink } from "react-router";
import {BellRing} from "lucide-react"
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {subscribeUser} from "@/Providers/subscribeUser.jsx";
import Swal from "sweetalert2";
export default function NavBar(){



    const { data: userData } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
                withCredentials: true,
            });
            return res.data;
        },
    });

    const userId = userData?.user?._id

    if (userId){
        localStorage.setItem("userId", userId);
    }


    const notifiy = () =>{
        if (userId) {
            subscribeUser(userId);
        }
    }


    const handleNotifications = () =>{

        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                console.log("Notifications are already enabled");
                notifiy()
            } else if (Notification.permission === "denied") {
                console.log("Notifications are blocked by the user");
            } else {
                console.log("Notifications have not been requested yet");
                Swal.fire({
                    title: "Notification Permission",
                    text: "Do you want to enable notifications",
                    icon: "Question",
                    showCancelButton: true,
                    confirmButtonColor: "#000000",
                    cancelButtonColor: "#ffffff",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    customClass: {
                        cancelButton: 'swal-cancel-button',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        notifiy()
                    }
                });
            }
        }

    }


return(
        <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
            <div className="text-white p-2">Delivery</div>
            <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
                <li><NavLink>Home</NavLink></li>
                <li><NavLink>Restaurants</NavLink></li>
                <li><NavLink>Food</NavLink></li>
                <li><NavLink>Contact</NavLink></li>
            </ul>
            <div className="p-2">
                <BellRing className="text-white rotate-25 hover:text-gray-300" onClick={handleNotifications}/>
            </div>
        </header>
    )
}
