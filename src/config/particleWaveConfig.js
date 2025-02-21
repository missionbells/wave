const particleWaveConfig = {
    rows: 200, // Number of particles in X direction
    cols: 200, // Number of particles in Y direction
    spacing: 1, // Distance between particles
  
    // Shader uniforms
    uniforms: {
      uAmplitude: 3.0, // Increase wave height
      uFrequency: 0.15, // Adjust frequency
      uSpeed: 5, // Slower animation
      uBlurStrength: 2.5, // Depth blur intensity
      pointSize: 1.0, // Increase particle size
      uColorWaveSpeed: 0.8, // 🔥 Speed at which the wave moves across particles
    },
  
    // Camera Settings
    camera: {
      position: { x: 0, y: -25, z: 15 }, // Adjust for better visibility
      lookAt: { x: 0, y: 35, z: 0 },
      fov: 75,
    },
  };
  
  export default particleWaveConfig;