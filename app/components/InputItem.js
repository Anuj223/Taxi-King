"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function InputItem({ type, value, onAddressChange, searchCenter }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (value?.name) {
      setInputValue(value.name);
      setSuggestions([]);
    } else {
      setInputValue(""); // Reset input when value cleared
    }
  }, [value]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      onAddressChange(null); // remove marker if cleared
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();

    const filtered = data.filter((place) => {
      if (!searchCenter) return true; // First search → show all
      const lat1 = parseFloat(place.lat);
      const lon1 = parseFloat(place.lon);
      const lat2 = searchCenter.lat;
      const lon2 = searchCenter.lng;
      return getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) <= 500;
    });

    setSuggestions(filtered.slice(0, 5)); // Always max 5
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleSelect = (place) => {
    onAddressChange({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
    setInputValue(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative bg-[#f3f3f3] p-3 rounded-lg mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-4 m-[8px]">
        <Image
          src={type === "source" ? "/source.png" : "/dest.png"}
          width={15}
          height={15}
          alt="Icon"
        />
        <input
          type="text"
          placeholder={type === "source" ? "Pickup Location" : "Dropoff Location"}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="bg-transparent w-full outline-none"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="relative top-full z-50 bg-white border rounded shadow w-full max-h-60 overflow-y-auto mt-1">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
