// ParticleWaveShader.js

export const vertexShader = `
  precision mediump float;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uBlurStrength;
  uniform float uPointSize;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;

  varying float vOpacity;
  varying vec3 vColor;
  varying float vBlurAmount;
  varying vec3 vPosition;
  varying float vWaveEffect;

  void main() {
    vec3 pos = position;

    // Enhanced wave effect - make it more visible
    float wave = sin((pos.x - uTime * uSpeed) * uFrequency) * 
                 cos(pos.y * uFrequency * 0.5) * 
                 uAmplitude;
    pos.z += wave;
    vWaveEffect = wave;

    // Depth-based parallax effect
    pos.x += uTime * 0.1 * (1.0 - pos.z * 0.08);

    // Dynamic particle size based on depth
    float depthFactor = clamp(1.5 / (gl_Position.w + 0.8), 0.6, 2.2);
    gl_PointSize = uPointSize * depthFactor;

    // Customizable color gradient based on depth
    float depthFade = smoothstep(-3.0, 2.0, pos.z);
    vOpacity = mix(0.6, 1.0, depthFade);
    
    // Use primary and secondary colors
    vColor = mix(uPrimaryColor, uSecondaryColor, depthFade);

    // Set blur amount (for potential future use)
    vBlurAmount = abs(wave) * 0.6;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAmbientLight;
  uniform vec3 uLightPositions[3];
  uniform float uLightIntensities[3];
  uniform float uGlowStrength; // New uniform controlling glow effect (range 1 to 10)

  varying vec3 vColor;
  varying vec3 vPosition;
  varying float vOpacity;
  varying float vBlurAmount;

  void main() {
    // Compute lighting effect from point lights
    float lightEffect = 1.0; // Base brightness
    for (int i = 0; i < 3; i++) {
      float dist = length(vPosition - uLightPositions[i]);
      lightEffect += uLightIntensities[i] / (1.0 + dist * dist * 0.005);
    }
    lightEffect = clamp(lightEffect, 1.0, 5.0);

    // Blend primary and secondary colors based on depth
    vec3 blendedColor = mix(uPrimaryColor, uSecondaryColor, smoothstep(-5.0, 5.0, vPosition.z));
    vec3 colorWithLight = blendedColor * lightEffect + uAmbientLight * 0.5;

    // --- Glow Effect ---
    // gl_PointCoord ranges from 0.0 to 1.0 for each fragment of a point.
    vec2 center = vec2(0.5, 0.5);
    float distFromCenter = distance(gl_PointCoord, center);
    // Compute a base glow value (radial fade)
    float baseGlow = 1.0 - smoothstep(0.0, 0.5, distFromCenter);
    // Mix between no glow (1.0) and the base glow using uGlowStrength (normalized to [0,1])
    float glow = mix(1.0, baseGlow, uGlowStrength / 10.0);
    
    float finalAlpha = vOpacity * glow;
    gl_FragColor = vec4(colorWithLight, finalAlpha);
}
`;