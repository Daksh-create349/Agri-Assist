'use client';

import { useState, useEffect } from 'react';

const farmingSlogans = [
  "Planting seeds of success, harvesting fields of prosperity. 🌱",
  "Cultivating the land, nourishing the future. 🌾",
  "The future of farming is in your hands. 🙌",
  "From little seeds grow mighty harvests. 🌽",
  "Working the land with passion and purpose. ❤️",
  "Innovation in every furrow, success in every field. ✨"
];

export function DashboardHeader() {
  const [userName, setUserName] = useState('');
  const [sloganIndex, setSloganIndex] = useState(0);
  const [isSloganVisible, setIsSloganVisible] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('agri-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserName(userData.fullName || 'Farmer');
      } else {
        setUserName('Farmer');
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      setUserName('Farmer');
    }

    const sloganInterval = setInterval(() => {
      setIsSloganVisible(false);
      setTimeout(() => {
        setSloganIndex((prevIndex) => (prevIndex + 1) % farmingSlogans.length);
        setIsSloganVisible(true);
      }, 500); // Wait for fade-out before changing text
    }, 5000);

    return () => clearInterval(sloganInterval);
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Welcome, {userName}!
      </h1>
      <p className={`text-muted-foreground transition-opacity duration-500 ${isSloganVisible ? 'opacity-100' : 'opacity-0'}`}>
        {farmingSlogans[sloganIndex]}
      </p>
    </div>
  );
}
