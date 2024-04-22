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
  lat: 51.52871894354948,
  lng: -0.1408999530197282,
};

const AboutUs = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    toast.error("Error loading maps");
  }

  if (!isLoaded) {
    return (
      <div>
        Loading maps <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default AboutUs;
