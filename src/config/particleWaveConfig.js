const particleWaveConfig = {
    rows: 200, // Number of particles in X direction
    cols: 200, // Number of particles in Y direction
    spacing: 1, // Distance between particles
  
    // Shader uniforms
    uniforms: {
      uAmplitude: 8.0, // Increase wave height for more visible effect
      uFrequency: 0.1, // Adjust frequency for better wave pattern
      uSpeed: 2.0, // Slower animation for better visibility
      uBlurStrength: 2.5, // Depth blur intensity
      pointSize: 1.0, // Increase particle size for better visibility
      uColorWaveSpeed: 0.8, // 🔥 Speed at which the wave moves across particles
    },
  
    // Camera Settings
    camera: {
      position: { x: 0, y: -25, z: 15 }, // Adjust for better visibility
      lookAt: { x: 0, y: 35, z: 0 },
      fov: 75,
    },
  };

// Camera presets with different viewing angles and positions
export const cameraPresets = {
  "Default View": {
    position: { x: 0, y: -25, z: 15 },
    lookAt: { x: 0, y: 35, z: 0 },
    fov: 75,
  },
  "Top Down": {
    position: { x: 0, y: 50, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 60,
  },
  "Side View": {
    position: { x: 40, y: 0, z: 10 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 80,
  },
  "Close Up": {
    position: { x: 0, y: -10, z: 8 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 90,
  },
  "Wide Angle": {
    position: { x: 0, y: -40, z: 25 },
    lookAt: { x: 0, y: 20, z: 0 },
    fov: 100,
  },
  "Low Angle": {
    position: { x: 0, y: -5, z: 5 },
    lookAt: { x: 0, y: 20, z: 0 },
    fov: 70,
  },
  "Orbital View": {
    position: { x: 30, y: -20, z: 20 },
    lookAt: { x: 0, y: 10, z: 0 },
    fov: 75,
  },
  "Dramatic Angle": {
    position: { x: -25, y: -15, z: 30 },
    lookAt: { x: 10, y: 25, z: -5 },
    fov: 85,
  },
  "Intimate Close": {
    position: { x: 0, y: -5, z: 3 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 95,
  },
  "Particle Level": {
    position: { x: 0, y: 0, z: 8 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 100,
  },
  "Corner Peek": {
    position: { x: 15, y: -8, z: 5 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 80,
  },
  "Underneath": {
    position: { x: 0, y: 5, z: 2 },
    lookAt: { x: 0, y: -10, z: 0 },
    fov: 90,
  },
  "Edge View": {
    position: { x: 25, y: -10, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 75,
  },
  "Bird's Eye": {
    position: { x: 0, y: 60, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 45,
  },
  "Worm's Eye": {
    position: { x: 0, y: -60, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 45,
  },
  "Diagonal Dive": {
    position: { x: 20, y: -30, z: 25 },
    lookAt: { x: -10, y: 10, z: -5 },
    fov: 85,
  },
  "Side Sweep": {
    position: { x: 40, y: -20, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 70,
  },
  "Tunnel View": {
    position: { x: 0, y: -2, z: 1 },
    lookAt: { x: 0, y: 0, z: 10 },
    fov: 110,
  },
  "Floating Above": {
    position: { x: 0, y: 15, z: 8 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 60,
  }
};

// Camera motion presets with animation parameters
export const cameraMotionPresets = {
  "Zoom In": {
    type: "zoom",
    startPosition: { x: 0, y: -25, z: 15 },
    endPosition: { x: 0, y: -10, z: 8 },
    startLookAt: { x: 0, y: 35, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 75,
    endFov: 90,
    duration: 8.0,
    easing: "easeInOut"
  },
  "Zoom Out": {
    type: "zoom",
    startPosition: { x: 0, y: -10, z: 8 },
    endPosition: { x: 0, y: -40, z: 25 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 20, z: 0 },
    startFov: 90,
    endFov: 100,
    duration: 8.0,
    easing: "easeInOut"
  },
  "Pan Left": {
    type: "pan",
    startPosition: { x: 0, y: -25, z: 15 },
    endPosition: { x: -30, y: -25, z: 15 },
    startLookAt: { x: 0, y: 35, z: 0 },
    endLookAt: { x: -20, y: 35, z: 0 },
    startFov: 75,
    endFov: 75,
    duration: 6.0,
    easing: "easeInOut"
  },
  "Pan Right": {
    type: "pan",
    startPosition: { x: 0, y: -25, z: 15 },
    endPosition: { x: 30, y: -25, z: 15 },
    startLookAt: { x: 0, y: 35, z: 0 },
    endLookAt: { x: 20, y: 35, z: 0 },
    startFov: 75,
    endFov: 75,
    duration: 6.0,
    easing: "easeInOut"
  },
  "Orbit Clockwise": {
    type: "orbit",
    center: { x: 0, y: 0, z: 0 },
    radius: 35,
    startAngle: 0,
    endAngle: Math.PI * 2,
    startHeight: -25,
    endHeight: -25,
    startFov: 75,
    endFov: 75,
    duration: 12.0,
    easing: "linear"
  },
  "Orbit Counter-Clockwise": {
    type: "orbit",
    center: { x: 0, y: 0, z: 0 },
    radius: 35,
    startAngle: 0,
    endAngle: -Math.PI * 2,
    startHeight: -25,
    endHeight: -25,
    startFov: 75,
    endFov: 75,
    duration: 12.0,
    easing: "linear"
  },
  "Spiral Down": {
    type: "spiral",
    center: { x: 0, y: 0, z: 0 },
    startRadius: 40,
    endRadius: 15,
    startHeight: -40,
    endHeight: -10,
    startAngle: 0,
    endAngle: Math.PI * 3,
    startFov: 75,
    endFov: 85,
    duration: 15.0,
    easing: "easeInOut"
  },
  "Figure 8": {
    type: "figure8",
    center: { x: 0, y: 0, z: 0 },
    radius: 25,
    height: -25,
    startAngle: 0,
    endAngle: Math.PI * 4,
    startFov: 75,
    endFov: 75,
    duration: 18.0,
    easing: "easeInOut"
  },
  "Dive Into Particles": {
    type: "zoom",
    startPosition: { x: 0, y: -30, z: 20 },
    endPosition: { x: 0, y: -2, z: 1 },
    startLookAt: { x: 0, y: 20, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 75,
    endFov: 110,
    duration: 10.0,
    easing: "easeInOut"
  },
  "Rise From Below": {
    type: "zoom",
    startPosition: { x: 0, y: 5, z: 2 },
    endPosition: { x: 0, y: -15, z: 10 },
    startLookAt: { x: 0, y: -10, z: 0 },
    endLookAt: { x: 0, y: 10, z: 0 },
    startFov: 90,
    endFov: 75,
    duration: 8.0,
    easing: "easeInOut"
  },
  "Close Orbit": {
    type: "orbit",
    center: { x: 0, y: 0, z: 0 },
    radius: 8,
    startAngle: 0,
    endAngle: Math.PI * 2,
    startHeight: -5,
    endHeight: -5,
    startFov: 90,
    endFov: 90,
    duration: 15.0,
    easing: "linear"
  },
  "Tight Spiral": {
    type: "spiral",
    center: { x: 0, y: 0, z: 0 },
    startRadius: 15,
    endRadius: 3,
    startHeight: -15,
    endHeight: -2,
    startAngle: 0,
    endAngle: Math.PI * 4,
    startFov: 80,
    endFov: 110,
    duration: 12.0,
    easing: "easeInOut"
  },
  "Side Sweep Close": {
    type: "pan",
    startPosition: { x: 20, y: -8, z: 5 },
    endPosition: { x: -20, y: -8, z: 5 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 85,
    endFov: 85,
    duration: 8.0,
    easing: "easeInOut"
  },
  "Vertical Rise": {
    type: "zoom",
    startPosition: { x: 0, y: -40, z: 15 },
    endPosition: { x: 0, y: 20, z: 15 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 75,
    endFov: 60,
    duration: 10.0,
    easing: "easeInOut"
  },
  "Corner Approach": {
    type: "zoom",
    startPosition: { x: 30, y: -20, z: 20 },
    endPosition: { x: 5, y: -3, z: 3 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 70,
    endFov: 95,
    duration: 9.0,
    easing: "easeInOut"
  },
  "Tunnel Through": {
    type: "zoom",
    startPosition: { x: 0, y: -2, z: 15 },
    endPosition: { x: 0, y: -2, z: -5 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 0, z: 0 },
    startFov: 100,
    endFov: 100,
    duration: 7.0,
    easing: "linear"
  },
  "Wide Orbit": {
    type: "orbit",
    center: { x: 0, y: 0, z: 0 },
    radius: 50,
    startAngle: 0,
    endAngle: Math.PI * 2,
    startHeight: -30,
    endHeight: -30,
    startFov: 60,
    endFov: 60,
    duration: 20.0,
    easing: "linear"
  },
  "Particle Dance": {
    type: "figure8",
    center: { x: 0, y: 0, z: 0 },
    radius: 12,
    height: -8,
    startAngle: 0,
    endAngle: Math.PI * 6,
    startFov: 85,
    endFov: 85,
    duration: 15.0,
    easing: "easeInOut"
  },
  "Zoom Out Slow": {
    type: "zoom",
    startPosition: { x: 0, y: -5, z: 3 },
    endPosition: { x: 0, y: -50, z: 30 },
    startLookAt: { x: 0, y: 0, z: 0 },
    endLookAt: { x: 0, y: 20, z: 0 },
    startFov: 95,
    endFov: 70,
    duration: 12.0,
    easing: "easeInOut"
  }
};
  
  export default particleWaveConfig;