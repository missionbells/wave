"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "lil-gui";
// Import post-processing modules
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { vertexShader, fragmentShader } from "@/shaders/ParticleWaveShader";
import particleWaveConfig, { cameraPresets, cameraMotionPresets } from "@/config/particleWaveConfig";

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
};

export default function ParticleWave() {
  const mountRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<GUI | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  const cameraAnimationRef = useRef<{
    isAnimating: boolean;
    startTime: number;
    duration: number;
    preset: {
      type: string;
      duration: number;
      easing: string;
      [key: string]: unknown;
    };
  } | null>(null);
  const motionSpeedRef = useRef<number>(1.0);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;
    
    console.log('ParticleWave mounting...');
    
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let particles: THREE.Points;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.BufferGeometry;
    let animationFrameId: number;
    let composer: EffectComposer, bloomPass: UnrealBloomPass;

    const updateLights = () => {
      material.uniforms.uLightPositions.value = pointLightsRef.current.map(
        (light) => light.position
      );
      material.uniforms.uLightIntensities.value = pointLightsRef.current.map(
        (light) => light.intensity
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (material.uniforms.uLightPositions as any).needsUpdate = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (material.uniforms.uLightIntensities as any).needsUpdate = true;
    };

    const applyCameraPreset = (presetName: string) => {
      const preset = cameraPresets[presetName as keyof typeof cameraPresets];
      if (preset && camera) {
        camera.position.set(preset.position.x, preset.position.y, preset.position.z);
        camera.lookAt(preset.lookAt.x, preset.lookAt.y, preset.lookAt.z);
        camera.fov = preset.fov;
        camera.updateProjectionMatrix();
        
        // Update the config object to reflect the new values
        particleWaveConfig.camera.position = { ...preset.position };
        particleWaveConfig.camera.lookAt = { ...preset.lookAt };
        particleWaveConfig.camera.fov = preset.fov;
      }
    };

    const startCameraMotion = (motionName: string) => {
      const motion = cameraMotionPresets[motionName as keyof typeof cameraMotionPresets];
      if (!motion || !camera) return;

      // Stop any existing animation
      if (cameraAnimationRef.current) {
        cameraAnimationRef.current.isAnimating = false;
      }

      // Start new animation with speed multiplier
      cameraAnimationRef.current = {
        isAnimating: true,
        startTime: clock.getElapsedTime(),
        duration: motion.duration / motionSpeedRef.current,
        preset: motion,
      };
    };

    const updateCameraMotion = () => {
      if (!cameraAnimationRef.current || !cameraAnimationRef.current.isAnimating || !camera) return;

      const currentTime = clock.getElapsedTime();
      const elapsed = currentTime - cameraAnimationRef.current.startTime;
      const progress = Math.min(elapsed / cameraAnimationRef.current.duration, 1);
      
      const motion = cameraAnimationRef.current.preset;
      const easing = easingFunctions[motion.easing as keyof typeof easingFunctions] || easingFunctions.linear;
      const easedProgress = easing(progress);

      // Calculate position and lookAt based on motion type
      const position = { x: 0, y: 0, z: 0 };
      const lookAt = { x: 0, y: 0, z: 0 };
      let fov = 75;

      switch (motion.type) {
        case "zoom":
        case "pan":
          // Linear interpolation for zoom and pan
          const startPos = motion.startPosition as { x: number; y: number; z: number };
          const endPos = motion.endPosition as { x: number; y: number; z: number };
          const startLook = motion.startLookAt as { x: number; y: number; z: number };
          const endLook = motion.endLookAt as { x: number; y: number; z: number };
          const startFov = motion.startFov as number;
          const endFov = motion.endFov as number;
          
          position.x = startPos.x + (endPos.x - startPos.x) * easedProgress;
          position.y = startPos.y + (endPos.y - startPos.y) * easedProgress;
          position.z = startPos.z + (endPos.z - startPos.z) * easedProgress;
          lookAt.x = startLook.x + (endLook.x - startLook.x) * easedProgress;
          lookAt.y = startLook.y + (endLook.y - startLook.y) * easedProgress;
          lookAt.z = startLook.z + (endLook.z - startLook.z) * easedProgress;
          fov = startFov + (endFov - startFov) * easedProgress;
          break;

        case "orbit":
          const orbitCenter = motion.center as { x: number; y: number; z: number };
          const orbitRadius = motion.radius as number;
          const orbitStartAngle = motion.startAngle as number;
          const orbitEndAngle = motion.endAngle as number;
          const orbitStartHeight = motion.startHeight as number;
          const orbitEndHeight = motion.endHeight as number;
          const orbitStartFov = motion.startFov as number;
          const orbitEndFov = motion.endFov as number;
          
          const angle = orbitStartAngle + (orbitEndAngle - orbitStartAngle) * easedProgress;
          position.x = orbitCenter.x + Math.cos(angle) * orbitRadius;
          position.z = orbitCenter.z + Math.sin(angle) * orbitRadius;
          position.y = orbitStartHeight + (orbitEndHeight - orbitStartHeight) * easedProgress;
          lookAt.x = orbitCenter.x;
          lookAt.y = orbitCenter.y;
          lookAt.z = orbitCenter.z;
          fov = orbitStartFov + (orbitEndFov - orbitStartFov) * easedProgress;
          break;

        case "spiral":
          const spiralCenter = motion.center as { x: number; y: number; z: number };
          const spiralStartAngle = motion.startAngle as number;
          const spiralEndAngle = motion.endAngle as number;
          const spiralStartRadius = motion.startRadius as number;
          const spiralEndRadius = motion.endRadius as number;
          const spiralStartHeight = motion.startHeight as number;
          const spiralEndHeight = motion.endHeight as number;
          const spiralStartFov = motion.startFov as number;
          const spiralEndFov = motion.endFov as number;
          
          const spiralAngle = spiralStartAngle + (spiralEndAngle - spiralStartAngle) * easedProgress;
          const spiralRadius = spiralStartRadius + (spiralEndRadius - spiralStartRadius) * easedProgress;
          position.x = spiralCenter.x + Math.cos(spiralAngle) * spiralRadius;
          position.z = spiralCenter.z + Math.sin(spiralAngle) * spiralRadius;
          position.y = spiralStartHeight + (spiralEndHeight - spiralStartHeight) * easedProgress;
          lookAt.x = spiralCenter.x;
          lookAt.y = spiralCenter.y;
          lookAt.z = spiralCenter.z;
          fov = spiralStartFov + (spiralEndFov - spiralStartFov) * easedProgress;
          break;

        case "figure8":
          const figure8Center = motion.center as { x: number; y: number; z: number };
          const figure8Radius = motion.radius as number;
          const figure8Height = motion.height as number;
          const figure8StartAngle = motion.startAngle as number;
          const figure8EndAngle = motion.endAngle as number;
          const figure8StartFov = motion.startFov as number;
          const figure8EndFov = motion.endFov as number;
          
          const figure8Angle = figure8StartAngle + (figure8EndAngle - figure8StartAngle) * easedProgress;
          // Figure-8 pattern: x = radius * sin(t), z = radius * sin(2t)
          position.x = figure8Center.x + Math.sin(figure8Angle) * figure8Radius;
          position.z = figure8Center.z + Math.sin(figure8Angle * 2) * figure8Radius;
          position.y = figure8Height;
          lookAt.x = figure8Center.x;
          lookAt.y = figure8Center.y;
          lookAt.z = figure8Center.z;
          fov = figure8StartFov + (figure8EndFov - figure8StartFov) * easedProgress;
          break;
      }

      // Apply the calculated values
      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
      camera.fov = fov;
      camera.updateProjectionMatrix();

      // Update config object
      particleWaveConfig.camera.position = { ...position };
      particleWaveConfig.camera.lookAt = { ...lookAt };
      particleWaveConfig.camera.fov = fov;

      // Stop animation when complete
      if (progress >= 1) {
        cameraAnimationRef.current.isAnimating = false;
      }
    };

    const init = () => {
      // Create Scene
      scene = new THREE.Scene();

      // Camera Setup
      camera = new THREE.PerspectiveCamera(
        particleWaveConfig.camera.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(
        particleWaveConfig.camera.position.x,
        particleWaveConfig.camera.position.y,
        particleWaveConfig.camera.position.z
      );
      camera.lookAt(
        particleWaveConfig.camera.lookAt.x,
        particleWaveConfig.camera.lookAt.y,
        particleWaveConfig.camera.lookAt.z
      );

      // Renderer Setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Postprocessing Composer Setup
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      // Default Bloom Settings as desired:
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.74, // strength
        1.0,  // radius
        0.08  // threshold
      );
      composer.addPass(bloomPass);

      clock = new THREE.Clock();

      // Particle Grid Setup
      const { rows, cols, spacing } = particleWaveConfig;
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(rows * cols * 3);
      for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
          const index = (x * cols + y) * 3;
          positions[index] = (x - rows / 2) * spacing;
          positions[index + 1] = (y - cols / 2) * spacing;
          positions[index + 2] = 0;
        }
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // Shader Material Setup
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: particleWaveConfig.uniforms.uAmplitude },
          uFrequency: { value: particleWaveConfig.uniforms.uFrequency },
          uSpeed: { value: particleWaveConfig.uniforms.uSpeed },
          uBlurStrength: { value: particleWaveConfig.uniforms.uBlurStrength },
          uColorWaveSpeed: { value: particleWaveConfig.uniforms.uColorWaveSpeed },
          uPointSize: { value: particleWaveConfig.uniforms.pointSize },
          uPrimaryColor: { value: new THREE.Color("#ffdbb8") },
          uSecondaryColor: { value: new THREE.Color("#ffae00") },
          uLightPositions: { value: [] },
          uLightIntensities: { value: [] },
          uAmbientLight: { value: new THREE.Color("#777777") },
        },
        transparent: true,
        depthTest: true,
        blending: THREE.AdditiveBlending,
      });

      // Shader material created successfully

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Create Multiple Point Lights
      const pointLightPositions = [
        { x: -10, y: 15, z: 20 },
        { x: 10, y: 15, z: 20 },
        { x: 0, y: -10, z: 10 },
      ];
      pointLightsRef.current = pointLightPositions.map((pos) => {
        const light = new THREE.PointLight(0xffaa00, 5, 100);
        light.position.set(pos.x, pos.y, pos.z);
        scene.add(light);
        return light;
      });

      // Animation Loop
      let frameCount = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        let elapsedTime = clock.getElapsedTime();
        
        // Reset time every hour to prevent floating-point precision issues
        if (elapsedTime > 3600) {
          clock.start();
          elapsedTime = clock.getElapsedTime();
        }
        
        material.uniforms.uTime.value = elapsedTime;
        updateLights();
        updateCameraMotion();
        composer.render();
        
        // Debug every 60 frames
        frameCount++;
        if (frameCount % 60 === 0) {
          console.log('Animation running - Time:', elapsedTime.toFixed(2));
          console.log('Uniforms:', {
            uTime: material.uniforms.uTime.value,
            uAmplitude: material.uniforms.uAmplitude.value,
            uFrequency: material.uniforms.uFrequency.value,
            uSpeed: material.uniforms.uSpeed.value
          });
        }
      };
      
      console.log('Starting animation...');
      animate();

      // GUI Configuration
      if (!guiRef.current) {
        const gui = new GUI();
        guiRef.current = gui;

        // Wave Settings Folder
        const waveFolder = gui.addFolder("Wave Settings");
        waveFolder.add(material.uniforms.uAmplitude, "value", 0.1, 10).name("Amplitude");
        waveFolder.add(material.uniforms.uFrequency, "value", 0.01, 1).name("Frequency");
        waveFolder.add(material.uniforms.uSpeed, "value", 0.1, 10).name("Speed");
        waveFolder.add(material.uniforms.uColorWaveSpeed, "value", 0.1, 3).name("Color Speed");
        waveFolder.add(material.uniforms.uPointSize, "value", 0.5, 1).name("Particle Size");

        // Color Settings Folder
        const colorFolder = gui.addFolder("Color Settings");
        colorFolder.addColor({ color: "#ffdbb8" }, "color")
          .name("Primary Color")
          .onChange((val: string) => {
            material.uniforms.uPrimaryColor.value.set(val);
          });
        colorFolder.addColor({ color: "#ffae00" }, "color")
          .name("Secondary Color")
          .onChange((val: string) => {
            material.uniforms.uSecondaryColor.value.set(val);
          });

        // Bloom (Glow) Settings Folder
        const bloomFolder = gui.addFolder("Bloom Settings");
        bloomFolder.add(bloomPass, "strength", 0, 5).name("Bloom Strength");
        bloomFolder.add(bloomPass, "radius", 0, 5).name("Bloom Radius");
        bloomFolder.add(bloomPass, "threshold", 0, 1).name("Bloom Threshold");

        // Light Settings Folder
        const lightFolder = gui.addFolder("Light Settings");
        pointLightsRef.current.forEach((light, index) => {
          lightFolder.add(light, "intensity", 0, 100)
            .name(`Light ${index + 1} Intensity`)
            .onChange(() => updateLights());
          lightFolder.add(light.position, "x", -30, 30)
            .name(`Light ${index + 1} X`)
            .onChange(() => updateLights());
          lightFolder.add(light.position, "y", -30, 30)
            .name(`Light ${index + 1} Y`)
            .onChange(() => updateLights());
          lightFolder.add(light.position, "z", 1, 100)
            .name(`Light ${index + 1} Z`)
            .onChange(() => updateLights());
        });

        // Camera Presets Folder
        const presetFolder = gui.addFolder("Camera Presets");
        const presetOptions = Object.keys(cameraPresets);
        presetFolder.add({ preset: "Default View" }, "preset", presetOptions)
          .name("Select Preset")
          .onChange((value: string) => {
            applyCameraPreset(value);
            // Update GUI controllers to reflect new values
            const guiAny = gui as unknown as {
              controllers?: Record<string, { updateDisplay: () => void }>;
              folders?: Record<string, { controllers: { updateDisplay: () => void }[] }>;
            };
            if (guiAny.folders && guiAny.folders["Camera Settings"]) {
              guiAny.folders["Camera Settings"].controllers.forEach((controller) => controller.updateDisplay());
            }
          });

        // Camera Motion Folder
        const motionFolder = gui.addFolder("Camera Motion");
        
        // Speed control
        motionFolder.add(motionSpeedRef, "current", 0.1, 5.0)
          .name("Motion Speed")
          .onChange((value: number) => {
            motionSpeedRef.current = value;
          });
        
        const motionOptions = Object.keys(cameraMotionPresets);
        motionFolder.add({ motion: "Zoom In" }, "motion", motionOptions)
          .name("Motion Preset")
          .onChange((value: string) => {
            startCameraMotion(value);
          });
        
        // Add individual motion buttons for quick access
        const motionButtons = {
          "🎬 Zoom In": () => startCameraMotion("Zoom In"),
          "🎬 Zoom Out": () => startCameraMotion("Zoom Out"),
          "🎬 Pan Left": () => startCameraMotion("Pan Left"),
          "🎬 Pan Right": () => startCameraMotion("Pan Right"),
          "🎬 Orbit CW": () => startCameraMotion("Orbit Clockwise"),
          "🎬 Orbit CCW": () => startCameraMotion("Orbit Counter-Clockwise"),
          "🎬 Spiral Down": () => startCameraMotion("Spiral Down"),
          "🎬 Figure 8": () => startCameraMotion("Figure 8"),
          "🎬 Dive Into Particles": () => startCameraMotion("Dive Into Particles"),
          "🎬 Rise From Below": () => startCameraMotion("Rise From Below"),
          "🎬 Close Orbit": () => startCameraMotion("Close Orbit"),
          "🎬 Tight Spiral": () => startCameraMotion("Tight Spiral"),
          "🎬 Side Sweep Close": () => startCameraMotion("Side Sweep Close"),
          "🎬 Vertical Rise": () => startCameraMotion("Vertical Rise"),
          "🎬 Corner Approach": () => startCameraMotion("Corner Approach"),
          "🎬 Tunnel Through": () => startCameraMotion("Tunnel Through"),
          "🎬 Wide Orbit": () => startCameraMotion("Wide Orbit"),
          "🎬 Particle Dance": () => startCameraMotion("Particle Dance"),
          "🎬 Zoom Out Slow": () => startCameraMotion("Zoom Out Slow"),
        };
        
        Object.entries(motionButtons).forEach(([name]) => {
          motionFolder.add(motionButtons, name as keyof typeof motionButtons).name(name);
        });

        // Camera Settings Folder
        const cameraFolder = gui.addFolder("Camera Settings");
        cameraFolder.add(camera.position, "x", -50, 50).name("Camera X").onChange(() => camera.updateProjectionMatrix());
        cameraFolder.add(camera.position, "y", -50, 50).name("Camera Y").onChange(() => camera.updateProjectionMatrix());
        cameraFolder.add(camera.position, "z", 1, 100).name("Camera Z").onChange(() => camera.updateProjectionMatrix());

        // Look At Settings
        cameraFolder.add(particleWaveConfig.camera.lookAt, "x", -50, 50).name("Look At X").onChange(() => {
          camera.lookAt(
            particleWaveConfig.camera.lookAt.x,
            particleWaveConfig.camera.lookAt.y,
            particleWaveConfig.camera.lookAt.z
          );
        });
        cameraFolder.add(particleWaveConfig.camera.lookAt, "y", -50, 50).name("Look At Y").onChange(() => {
          camera.lookAt(
            particleWaveConfig.camera.lookAt.x,
            particleWaveConfig.camera.lookAt.y,
            particleWaveConfig.camera.lookAt.z
          );
        });
        cameraFolder.add(particleWaveConfig.camera.lookAt, "z", -50, 50).name("Look At Z").onChange(() => {
          camera.lookAt(
            particleWaveConfig.camera.lookAt.x,
            particleWaveConfig.camera.lookAt.y,
            particleWaveConfig.camera.lookAt.z
          );
        });

        // Reset Button
        gui.add({ reset: () => {
          // Stop any camera animations
          if (cameraAnimationRef.current) {
            cameraAnimationRef.current.isAnimating = false;
          }
          
          // Reset motion speed
          motionSpeedRef.current = 1.0;
          
          // Reset wave settings
          material.uniforms.uAmplitude.value = particleWaveConfig.uniforms.uAmplitude;
          material.uniforms.uFrequency.value = particleWaveConfig.uniforms.uFrequency;
          material.uniforms.uSpeed.value = particleWaveConfig.uniforms.uSpeed;
          material.uniforms.uColorWaveSpeed.value = particleWaveConfig.uniforms.uColorWaveSpeed;
          material.uniforms.pointSize.value = particleWaveConfig.uniforms.pointSize;
          material.uniforms.uBlurStrength.value = particleWaveConfig.uniforms.uBlurStrength;
          
          // Reset colors
          material.uniforms.uPrimaryColor.value.set("#ffdbb8");
          material.uniforms.uSecondaryColor.value.set("#ffae00");
                  
          // Reset bloom settings
          bloomPass.strength = 0.74;
          bloomPass.radius = 1.0;
          bloomPass.threshold = 0.08;
                  
          // Reset camera to default preset
          applyCameraPreset("Default View");
                  
          // Reset lights
          const defaultLightPositions = [
            { x: -10, y: 15, z: 20 },
            { x: 10, y: 15, z: 20 },
            { x: 0, y: -10, z: 10 },
          ];
          pointLightsRef.current.forEach((light, index) => {
            light.intensity = 5;
            light.position.set(
              defaultLightPositions[index].x,
              defaultLightPositions[index].y,
              defaultLightPositions[index].z
            );
          });
          updateLights();

          // Safely update GUI controllers if they exist
          // Safely update GUI controllers if they exist
          const guiAny = gui as unknown as {
            controllers?: Record<string, { updateDisplay: () => void }>;
            folders?: Record<string, { controllers: { updateDisplay: () => void }[] }>;
          };

          if (guiAny.controllers) {
            Object.values(guiAny.controllers).forEach((controller) => controller.updateDisplay());
          }
          if (guiAny.folders) {
            Object.values(guiAny.folders).forEach((folder) => {
              if (folder.controllers) {
                folder.controllers.forEach((controller) => controller.updateDisplay());
              }
            });
          }
        }}, "reset").name("🔄 Reset Settings");

        gui.close();
      }
    };

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      composer.setSize(window.innerWidth, window.innerHeight);
    });

    init();

    return () => {
      console.log('ParticleWave unmounting...');
      cancelAnimationFrame(animationFrameId);
      guiRef.current?.destroy();
      guiRef.current = null;
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute w-full h-full" />;
}