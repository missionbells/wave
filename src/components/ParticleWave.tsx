"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "lil-gui";

// Post-processing modules
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { vertexShader, fragmentShader } from "@/shaders/ParticleWaveShader";
import particleWaveConfig from "@/config/particleWaveConfig";

export default function ParticleWave() {
  const mountRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<GUI | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let particles: THREE.Points;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.BufferGeometry;
    let animationFrameId: number;
    let composer: EffectComposer;
    let bloomPass: UnrealBloomPass;

    // Update lights in the shader uniforms
    const updateLights = () => {
      material.uniforms.uLightPositions.value = pointLightsRef.current.map((light) => light.position);
      material.uniforms.uLightIntensities.value = pointLightsRef.current.map((light) => light.intensity);
      material.uniforms.uLightPositions.needsUpdate = true;
      material.uniforms.uLightIntensities.needsUpdate = true;
    };

    const init = () => {
      // 1. Scene
      scene = new THREE.Scene();

      // 2. Camera
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

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // 4. Post-processing (Bloom)
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.74, // strength
        1.0,  // radius
        0.08  // threshold
      );
      composer.addPass(bloomPass);

      clock = new THREE.Clock();

      // 5. Particle Grid
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

      // 6. Shader Material
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
          pointSize: { value: particleWaveConfig.uniforms.pointSize },
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

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // 7. Multiple Point Lights
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

      // 8. Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        material.uniforms.uTime.value = clock.getElapsedTime();

        // Optional: Pulsing lights (commented out for manual GUI control)
        // pointLightsRef.current.forEach((light, index) => {
        //   light.intensity = 3 + Math.sin(clock.getElapsedTime() * (0.5 + index * 0.3)) * 2;
        // });

        updateLights();
        composer.render();
      };
      animate();

      // 9. GUI Configuration
      if (!guiRef.current) {
        const gui = new GUI();
        guiRef.current = gui;

        // We won't explicitly type 'controls' to avoid the `any` issue
        const controls = {};

        // Wave Settings Folder
        const waveFolder = gui.addFolder("Wave Settings");
        waveFolder.add(material.uniforms.uAmplitude, "value", 0.1, 10).name("Amplitude");
        waveFolder.add(material.uniforms.uFrequency, "value", 0.01, 1).name("Frequency");
        waveFolder.add(material.uniforms.uSpeed, "value", 0.1, 10).name("Speed");
        waveFolder.add(material.uniforms.uColorWaveSpeed, "value", 0.1, 3).name("Color Speed");
        waveFolder.add(material.uniforms.pointSize, "value", 0.5, 5).name("Particle Size");

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
        const resetSettings = () => {
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

          // Reset camera
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
          camera.updateProjectionMatrix();

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
          if (gui.__controllers) {
            Object.values(gui.__controllers).forEach((controller) => controller.updateDisplay());
          }
          if (gui.__folders) {
            Object.values(gui.__folders).forEach((folder) => {
              if (folder.__controllers) {
                folder.__controllers.forEach((controller) => controller.updateDisplay());
              }
            });
          }
        };
        gui.add({ reset: resetSettings }, "reset").name("🔄 Reset Settings");

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
      cancelAnimationFrame(animationFrameId);
      guiRef.current?.destroy();
      guiRef.current = null;
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute w-full h-full" />;
}