"use client"; // Required for hooks in Next.js App Router

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ToggleLayoutButton() {
  const pathname = usePathname();

  // Determine the target URL based on current page
  const targetRoute = pathname === "/fullscreen" ? "/split" : "/fullscreen";

  return (
      <button className="
        mt-6 flex items-center justify-center bg-white w-full border rounded-lg px-4 py-3 
        text-gray-900 shadow-sm hover:bg-gray-100 transition font-medium">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
          alt="Microsoft Logo" 
          className="w-5 h-5 mr-2"
        />
        Sign in with Microsoft
      </button>
  );
}