import { useAppStore } from "../../store/useAppStore";
import { BODY_SHELL_PARTS } from "../../three/precomputedGeometry";

export default function BodyShell() {
  const showBody = useAppStore((s) => s.showBody);
  const isolateMode = useAppStore((s) => s.isolateMode);
  const selected = useAppStore((s) => s.selectedOrganId);

  if (!showBody || (isolateMode && selected)) return null;

  return (
    <group renderOrder={-1}>
      {BODY_SHELL_PARTS.map((part, i) => (
        <mesh key={i} geometry={part.geometry} position={part.position}>
          <meshPhysicalMaterial
            color="#e8c4ad"
            transparent
            opacity={0.07}
            roughness={0.9}
            depthWrite={false}
            side={2}
          />
        </mesh>
      ))}
    </group>
  );
}
