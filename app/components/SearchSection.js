"use client";
import InputItem from "./InputItem";
import { useState } from "react";

// Pricing rules
const ridePricingRules = {
  Uber: {
    "UberX": { baseFare: 50, perKm: 15, perMin: 2, bookingFee: 10, desc: "Affordable, everyday rides", seats: 4 },
    "XL Comfort": { baseFare: 80, perKm: 20, perMin: 3, bookingFee: 15, desc: "Spacious rides for groups", seats: 6 }
  },
  Ola: {
    "Ola Mini": { baseFare: 40, perKm: 12, perMin: 2, bookingFee: 8, desc: "Quick city rides", seats: 4 },
    "Ola Prime": { baseFare: 70, perKm: 18, perMin: 3, bookingFee: 12, desc: "Comfortable premium rides", seats: 4 }
  },
  Rapido: {
    "Rapido Bike": { baseFare: 20, perKm: 10, perMin: 1, bookingFee: 5, desc: "Fast bike rides", seats: 1 },
    "Rapido Mini": { baseFare: 35, perKm: 12, perMin: 2, bookingFee: 6, desc: "Budget bike option", seats: 1 }
  }
};

// Ride images
const rideImages = {
  "UberX": "/Black.png",
  "XL Comfort": "/XL.png",
  "Ola Mini": "/Black.png",
  "Ola Prime": "/comfrot.png",
  "Rapido Bike": "/bike.png",
  "Rapido Mini": "/car.png"
};

// Fare calculation
const calculateRidePrice = (rideData, distance, duration, surge = 1) => {
  return (rideData.baseFare + rideData.perKm * distance + rideData.perMin * duration) * surge + rideData.bookingFee;
};

export default function SearchSection({ pickup, dropoff, setPickup, setDropoff, distance, duration, fares, setFares }) {
  const [searchCenter, setSearchCenter] = useState(null);

  const handleAddressChange = (type, coords) => {
    if (!coords) {
      if (type === "source") setPickup(null);
      if (type === "dest") setDropoff(null);
      if (!pickup && !dropoff) setSearchCenter(null);
      return;
    }
    if (type === "source") {
      setPickup(coords);
      if (!searchCenter) setSearchCenter(coords);
    } else {
      setDropoff(coords);
      if (!searchCenter) setSearchCenter(coords);
    }
  };

  const handleSearch = () => {
    if (!pickup || !dropoff) {
      alert("Please select both pickup and dropoff!");
      return;
    }
    if (!distance || !duration) {
      alert("Distance & duration are not calculated yet!");
      return;
    }

    const calculatedFares = [];
    Object.keys(ridePricingRules).forEach((app) => {
      Object.keys(ridePricingRules[app]).forEach((rideType) => {
        const rideData = ridePricingRules[app][rideType];
        const price = calculateRidePrice(rideData, distance, duration);
        calculatedFares.push({
          id: calculatedFares.length + 1,
          car: `${app} ${rideType}`,
          seats: rideData.seats,
          desc: rideData.desc,
          price: `₹${price.toFixed(2)}`,
          img: rideImages[rideType] || "/default.png"
        });
      });
    });

    setFares(calculatedFares);
  };

  return (
    <div className="p-2 border-2 rounded-[16px] w-full mt-2">
      <p className="text-[1.65rem] font-extrabold text-center">Get a ride</p>

      <InputItem
        type="source"
        value={pickup}
        searchCenter={searchCenter}
        onAddressChange={(coords) => handleAddressChange("source", coords)}
      />
      <InputItem
        type="dest"
        value={dropoff}
        searchCenter={searchCenter}
        onAddressChange={(coords) => handleAddressChange("dest", coords)}
      />

      <button
        onClick={handleSearch}
        className="p-2 bg-black w-full mt-5 text-white rounded-lg text-[1.2rem]"
      >
        Search
      </button>
    </div>
  );
}

