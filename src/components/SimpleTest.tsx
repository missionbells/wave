"use client";

import { useEffect, useRef } from "react";

export default function SimpleTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const animate = () => {
      time += 0.1;
      
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw moving circles
      for (let i = 0; i < 50; i++) {
        const x = (canvas.width / 2) + Math.sin(time + i * 0.1) * 100;
        const y = (canvas.height / 2) + Math.cos(time + i * 0.1) * 100;
        
        ctx.fillStyle = `hsl(${(time * 10 + i * 7) % 360}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <div className="absolute w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600}
        className="w-full h-full"
      />
    </div>
  );
}

