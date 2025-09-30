"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import with no SSR and no hydration
const ParticleWave = dynamic(() => import("@/components/ParticleWave"), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading Particle Wave...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ParticleWave />
    </div>
  );
}