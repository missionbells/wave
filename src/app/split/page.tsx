import ParticleWave from "@/components/ParticleWave";
import LoginCard from "@/components/LoginCard";
import Image from "next/image";

export default function SplitScreenPage() {
  return (
    <div className="relative min-h-screen flex">
      {/* Left Side - Visual (50%) */}
      <div className="w-1/2 h-full overflow-hidden">
        <ParticleWave />
      </div>

      {/* Right Side - Login (50%) */}
      <div className="w-1/2 text-black flex flex-col items-center justify-center bg-white relative">
        {/* Centered Logo Inside White Area */}
        <div className="absolute top-6">
          <Image
            src="/SolaceLogo.png"
            alt="Solace Logo"
            width={150}
            height={50}
            className="opacity-90"
          />
        </div>

        {/* Login Card */}
        <LoginCard />
      </div>
    </div>
  );
}