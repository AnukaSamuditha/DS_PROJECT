import React from "react";
import GoogleMapContainer from "./components/GoogleMapContainer";

export default function Home(){
    return(
        <section>
            <h1 className="text-3xl font-bold text-yellow-600">This is home</h1>
            <GoogleMapContainer/>
        </section>
    )
}