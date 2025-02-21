import ParticleWave from "@/components/ParticleWave";
import LoginCard from "@/components/LoginCard";
import Image from "next/image";

export default function FullscreenPage() {
  return (
    <div className="relative min-h-screen">
      {/* Logo - Centered at the Top */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <Image
          src="/SolaceLogo.png"
          alt="Solace Logo"
          width={150}
          height={50}
          className="opacity-90"
        />
      </div>

      {/* Fullscreen Centered Layout */}
      <ParticleWave />
      <LoginCard />
    </div>
  );
}