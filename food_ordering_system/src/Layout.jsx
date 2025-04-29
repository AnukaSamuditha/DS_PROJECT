import { data, Outlet } from "react-router";
import NavBar from "./components/NavBar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export default function Layout() {

  
  
  
  

  


  
  return (
    <>
      <NavBar/>
      <main>
        <Outlet />
      </main>
    </>
  );
}
