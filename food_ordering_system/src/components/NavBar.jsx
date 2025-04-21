import { NavLink } from "react-router";

export default function NavBar(){
    return(
        <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
            <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
                <li><NavLink>Home</NavLink></li>
                <li><NavLink>Restaurants</NavLink></li>
                <li><NavLink to='/place-order'>Food</NavLink></li>
                <li><NavLink>Contact</NavLink></li>
            </ul>
        </header>
    )
}