import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "../../store/useAppStore";
import AnatomyModel from "./AnatomyModel";
import CameraRig from "./CameraRig";

export default function Scene() {
  const selectOrgan = useAppStore((s) => s.selectOrgan);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0.6, 1.1, 8.4] }}
      onPointerMissed={() => selectOrgan(null)}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={["#070b14"]} />
      <fog attach="fog" args={["#070b14", 9, 21]} />

      <hemisphereLight args={["#cfe8ff", "#1a1410", 0.45]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow
        position={[4.2, 6.5, 5]}
        intensity={1.75}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0015}
      />
      <directionalLight position={[-5, 3, -2.5]} intensity={0.45} color="#9db8ff" />
      <directionalLight position={[0, 3.5, -6]} intensity={0.55} color="#8ec9ff" />
      <pointLight position={[0, 1, 3.5]} intensity={0.3} color="#ffe8d6" />

      <mesh position={[0, -2.95, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.4, 64]} />
        <meshStandardMaterial color="#0c1322" roughness={0.85} metalness={0.15} />
      </mesh>
      <ContactShadows position={[0, -2.93, 0]} opacity={0.6} scale={10} blur={2.4} far={4} resolution={512} />

      <AnatomyModel />
      <CameraRig />
    </Canvas>
  );
}
