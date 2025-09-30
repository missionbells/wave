"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import ParticleWave with no SSR
const ParticleWave = dynamic(() => import('./ParticleWave'), {
  ssr: false,
  loading: () => (
    <div className="absolute w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-lg">Loading Particle Wave...</div>
    </div>
  )
});

export default function ParticleWaveWrapper() {
  const particleWaveComponent = useMemo(() => <ParticleWave key="particle-wave" />, []);
  
  return particleWaveComponent;
}
