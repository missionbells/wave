"use client"; // Ensures client-side rendering

import ParticleWave from "@/components/ParticleWave";
import Image from "next/image";

export default function Home() {

  return (
    <div className="relative min-h-screen">
          <ParticleWave />
    </div>
  );
}