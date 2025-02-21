"use client"; // Ensures client-side rendering

import { useState } from "react";
import ParticleWave from "@/components/ParticleWave";
import LoginCard from "@/components/LoginCard";
import Image from "next/image";

export default function Home() {

  return (
    <div className="relative min-h-screen">
      {/* Logo - Always Visible */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <Image
          src="/SolaceLogo.png" // Ensure this file is inside the `public/` folder
          alt="Solace Logo"
          width={150} // Adjust size if needed
          height={50}
          className="opacity-90"
        />
      </div>


        <>
          <ParticleWave />
          <LoginCard />
        </>
    </div>
  );
}