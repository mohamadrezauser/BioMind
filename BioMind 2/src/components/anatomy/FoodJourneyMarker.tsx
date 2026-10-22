import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "../../store/useAppStore";
import { ORGAN_LAYOUT, TRACT_ORDER } from "../../three/organLayout";
import { getOrganCurve } from "../../three/precomputedGeometry";

export default function FoodJourneyMarker() {
  const meshRef = useRef<THREE.Mesh>(null);
  const journey = useAppStore((s) => s.journey);
  const journeyTick = useAppStore((s) => s.journeyTick);

  useFrame((_, delta) => {
    if (journey.active && journey.playing) {
      journeyTick(delta * 0.35);
    }
    if (!meshRef.current) return;
    if (!journey.active) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    const stageId = TRACT_ORDER[journey.stageIndex];
    const curve = getOrganCurve(stageId);
    if (curve) {
      const p = curve.getPointAt(Math.min(Math.max(journey.localT, 0), 1));
      meshRef.current.position.copy(p);
    } else {
      // Mouth / blob organs without a tube curve: just sit at the centroid.
      const c = ORGAN_LAYOUT[stageId].centroid;
      meshRef.current.position.set(c[0], c[1], c[2]);
    }
    const s = 1 + Math.sin(performance.now() * 0.006) * 0.12;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <sphereGeometry args={[0.085, 20, 20]} />
      <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  );
}
