"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SearchSection from "./components/SearchSection";

const Maps = dynamic(() => import("./components/Maps"), { ssr: false });

export default function Home() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [fares, setFares] = useState([]);
  const [distance, setDistance] = useState(null); // km
  const [duration, setDuration] = useState(null); // minutes
  const [selectedFare, setSelectedFare] = useState(null);


  return (
    <div className="hm grid grid-cols-3 h-screen">
      {/* Left Panel */}
      <div className="order-2 md:order-1 col-span-1 p-4 bg-gray-100 flex flex-col gap-4 overflow-y-auto">  <SearchSection
          pickup={pickup}
          dropoff={dropoff}
          setPickup={setPickup}
          setDropoff={setDropoff}
          distance={distance}
          duration={duration}
          fares={fares}
          setFares={setFares}
        />

        {/* Fare list will show up below search section */}
        {fares.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 mt-[4px]">Recommended</h2>
            <ul className="space-y-3 ">
              {fares.map((fare) => (
                <li
                   key={fare.id}
      onClick={() => setSelectedFare(fare)}
                  className={`flex justify-between items-center p-3 bg-white rounded-xl shadow cursor-pointer hover:border-2 transition-all ${
        selectedFare?.id === fare.id ? "border-4 border-green-500" : ""
      }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={fare.img}
                      alt={fare.car}
                      width={60}
                      height={40}
                      className="rounded"
                    />
                    <div className="ml-[4px]">
                      <p className="font-semibold">
                        {fare.car} · {fare.seats} seats
                      </p>
                      <p className="text-sm text-gray-500">{fare.desc}</p>
                    </div>
                  </div>
                  <div className="text-right font-bold">{fare.price}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedFare && (
  <button
  
    onClick={() => alert(`Payment of ${selectedFare.price} successful!`)}
    className="mt-4 p-3 bg-green-600 text-white font-bold rounded-lg w-full"
    style={{background : "#a5a5a5" , padding: "3px"}}
  >
    Pay ₹{selectedFare.price.replace("₹", "")} for {selectedFare.car}
  </button>
)}
      </div>

      {/* Right Map Panel */} 
    <div className="order-1 md:order-2 col-span-2">
        <Maps
  pickup={pickup}
  dropoff={dropoff}
  setPickup={setPickup}
  setDropoff={setDropoff}
  setPickupAddress={setPickupAddress}
  setDropoffAddress={setDropoffAddress}
  setDistance={setDistance}
  setDuration={setDuration}
/>
      </div>
    </div>
  );
}
