import React, { useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { GiSkeleton } from "react-icons/gi";
import { Input } from "@material-tailwind/react";

const libraries = ["places"];

const GoogleMapComponent = ({
  longitude,
  latitude,
  setLatitude,
  setLongitude,
}) => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: latitude,
    lng: longitude,
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  const onLoad = (map) => {
    setMap(map);

    map.addListener("click", (event) => {
      setLatitude(event.latLng.lat());
      setLongitude(event.latLng.lng());

      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    });
  };

  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const selectedPlace = autocomplete.getPlace();
      setPlace(selectedPlace);

      setLatitude(selectedPlace.geometry.location.lat());
      setLongitude(selectedPlace.geometry.location.lng());
      setSelectedLocation({
        lat: latitude,
        lng: longitude,
      });
    }
  };

  if (!isLoaded) {
    return <GiSkeleton />;
  }

  return (
    <>
      <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          type="text"
          placeholder="Search for places"
          color="light-blue"
          size="lg"
          outline="true"
          placeholdercolor="lightBlue"
          onChange={() => {}}
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: "-120px",
            width: "240px",
            zIndex: 50
          }}
        />
      </Autocomplete>

      <GoogleMap
        center={selectedLocation}
        zoom={longitude || latitude > 0 ? 9 : 1}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
        options={{
          zoomControl: false,
          streetViewControl: false,
        }}
      >
        {/* Display the selected location marker */}
        <Marker position={selectedLocation} />
      </GoogleMap>
    </>
  );
};

export default GoogleMapComponent;
