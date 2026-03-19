import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import L from "leaflet";
import { useEffect } from "react";

// Use a custom DivIcon to avoid asset loading issues with Vite/Leaflet
const createCustomIcon = () => {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#15803d" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    className: "custom-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const customIcon = createCustomIcon();

interface DeliveryMapProps {
  onPincodeSelected: (pincode: string) => void;
  searchedPincode?: string;
}

const LocationMarker = ({
  onSelect,
  searchedPincode,
}: {
  onSelect: (pincode: string) => void;
  searchedPincode?: string;
}) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  const fetchPincodeFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.address && data.address.postcode) {
        onSelect(data.address.postcode);
      } else {
        console.log("No pincode found for location");
      }
    } catch (error) {
      console.error("Error fetching pincode:", error);
    }
  };

  // Effect to handle external pincode entry
  useEffect(() => {
    if (!searchedPincode || searchedPincode.length < 6) return;

    const syncMapToPincode = async () => {
      try {
        // Use structured geocoding for more accurate zip/pincode results
        // and restrict to India (in) to avoid global ambiguities
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${searchedPincode}&countrycodes=in&format=json&addressdetails=1&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
          setPosition(newPos);
          map.flyTo(newPos, 13);
        }
      } catch (error) {
        console.error("Error syncing map to zip:", error);
      }
    };

    const timer = setTimeout(() => {
      syncMapToPincode();
    }, 1000); // Debounce to avoid spamming API while typing

    return () => clearTimeout(timer);
  }, [searchedPincode, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchPincodeFromCoords(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} icon={customIcon} />;
};

export const DeliveryMap = ({ onPincodeSelected, searchedPincode }: DeliveryMapProps) => {
  // Default center (Hyderabad approx)
  const position = [17.385, 78.4867];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative z-0">
      <MapContainer
        center={position as L.LatLngExpression}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onPincodeSelected} searchedPincode={searchedPincode} />
      </MapContainer>

      <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg text-sm text-organo-gray border border-gray-200 shadow-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-organo-green" />
          <span>Click anywhere on the map to check delivery availability.</span>
        </div>
      </div>
    </div>
  );
};
