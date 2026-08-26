import React from 'react';
import Hero from '../sections/home/Hero';
import CuratedCorridors from '../sections/home/CuratedCorridors';
import FeaturedProjects from '../sections/home/FeaturedProjects';
import PremiumProperties from '../sections/home/PremiumProperties';
import Locations from '../sections/home/Locations';
import Developers from '../sections/home/Developers';
import PurchasingAdvantage from '../sections/home/PurchasingAdvantage';
import MarketGuides from '../sections/home/MarketGuides';
import LocationMap from '../sections/home/LocationMap';

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F9F8F4]">
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Curated Corridors 3D Section */}
      <CuratedCorridors />
      <FeaturedProjects />
      <PremiumProperties />
      <Locations /> 
      <Developers />
      <PurchasingAdvantage />
      <MarketGuides />
      <LocationMap />
    </div>
  );
}