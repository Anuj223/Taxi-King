"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Maps.css";
export default function Maps({
  pickup,
  dropoff,
  setPickup,
  setDropoff,
  setPickupAddress,
  setDropoffAddress,
  distance,
  duration,
  setDistance,
  setDuration
}) {
  const [route, setRoute] = useState(null);

  // Set default marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Reverse geocode to get address
  const reverseGeocode = async (lat, lng, type) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const location = { lat, lng, name: data.display_name };
      if (type === "pickup") {
        setPickup(location);
        setPickupAddress?.(data.display_name);
      } else {
        setDropoff(location);
        setDropoffAddress?.(data.display_name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch route and travel info when both pickup & dropoff are set
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickup || !dropoff) {
        setRoute(null);
        setDistance?.(null);
        setDuration?.(null);
        return;
      }
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes?.length > 0) {
          const r = data.routes[0];
          setRoute(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          setDistance?.((r.distance / 1000).toFixed(2)); // km
          setDuration?.(Math.round(r.duration / 60)); // minutes
        }
      } catch (err) {
        console.log("Route fetch error:", err);
      }
    };
    fetchRoute();
  }, [pickup, dropoff, setDistance, setDuration]);

  // Double-click to remove marker
  const markerEventHandlers = (type) => ({
    dblclick: () => {
      if (type === "pickup") {
        setPickup(null);
        setPickupAddress?.("");
      } else {
        setDropoff(null);
        setDropoffAddress?.("");
      }
      setRoute(null);
      setDistance?.(null);
      setDuration?.(null);
    },
  });

  // Auto zoom map depending on markers
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (pickup && dropoff) {
        const bounds = L.latLngBounds([pickup, dropoff]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (pickup) {
        map.setView([pickup.lat, pickup.lng], 15);
      } else if (dropoff) {
        map.setView([dropoff.lat, dropoff.lng], 15);
      } else {
        map.setView([20.5937, 78.9629], 5); // Reset to India
      }
    }, [pickup, dropoff, map]);
    return null;
  };

  // Add markers on click
  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        if (!pickup) {
          reverseGeocode(e.latlng.lat, e.latlng.lng, "pickup");
        } else if (!dropoff) {
          reverseGeocode(e.latlng.lat, e.latlng.lng, "dropoff");
        } else {
          reverseGeocode(e.latlng.lat, e.latlng.lng, "dropoff");
        }
      },
    });
    return null;
  };

  return (
    <div className="m2" 
    // style={{ height: "500px", width: "100%" }}
    >
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        <MapUpdater />

        {pickup && (
          <Marker position={pickup} eventHandlers={markerEventHandlers("pickup")}>
            <Popup><b>Pickup:</b> {pickup.name}</Popup>
          </Marker>
        )}
        {dropoff && (
          <Marker position={dropoff} eventHandlers={markerEventHandlers("dropoff")}>
            <Popup><b>Dropoff:</b> {dropoff.name}</Popup>
          </Marker>
        )}

        {/* Route line */}
        {route && <Polyline positions={route} color="blue" />}

        {/* Distance + Time popup */}
        {pickup && dropoff && distance != null && duration != null && (
          <Popup
            position={[
              (pickup.lat + dropoff.lat) / 2,
              (pickup.lng + dropoff.lng) / 2,
            ]}
            autoClose={false}
            closeOnClick={false}
            closeButton={false}
          >
            🚗 Distance: {distance} km <br />
            ⏱️ Time: {duration} min
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
