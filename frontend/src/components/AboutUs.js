import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 51.52101233298777,
  lng: -0.14009833003455338,
}; // location for University of Westminster

const AboutUs = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    toast.error("Error loading maps");
  }

  return (
    <div>
      {!isLoaded ? (
        <LoadingSpinner />
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
        >
          <MarkerF position={center} />
        </GoogleMap>
      )}
    </div>
  );
};

export default AboutUs;
