import { useNavigate} from "react-router-dom";
import styles from "./Map.module.css";
import Button from "./Button";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "./../Context/CitiesContext";
import "flag-icons";
import UseGeolocation from "./../hooks/UseGeolocation";
import UseGeolocationPosition from "../hooks/UseGeolocationPosition";
function Map() {
  const [mapPosition, setMapPosition] = useState([0, 0]);
  const { cities } = useCities();
const [mapLat,mapLng]=UseGeolocationPosition()
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = UseGeolocation();


  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  useEffect(
    function () {
      if (geolocationPosition) setMapPosition(geolocationPosition);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type={"position"} onClick={getPosition}>
          {isLoadingPosition ? "Loading" : "Use your Position"}
        </Button>
      )}{" "}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          const countryCode = [...city.emoji]
            .map((char) => String.fromCharCode(char.codePointAt(0) - 0x1f1a5))
            .join("")
            .toLowerCase();

          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span className={`fi fi-${countryCode}`}></span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&&lng=${e.latlng.lng}`);
    },
  });
  return;
}

export default Map;
