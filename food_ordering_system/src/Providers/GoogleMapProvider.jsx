import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["geometry"];
export default function GoogleMapProvider({children}){
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API,
        libraries
    });
    return children(isLoaded)
}
