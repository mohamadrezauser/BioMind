import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "../../store/useAppStore";
import { getExplodeDirection, ORGAN_LAYOUT, type OrganId } from "../../three/organLayout";
import { getOrganMeshParts } from "../../three/precomputedGeometry";
import { ORGAN_EDUCATION } from "../../data/organEducation";

interface Props {
  id: OrganId;
}

export default function OrganMesh({ id }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const def = ORGAN_LAYOUT[id];
  const parts = useMemo(() => getOrganMeshParts(id), [id]);
  const explodeDir = useMemo(() => getExplodeDirection(id), [id]);
  const nameFa = ORGAN_EDUCATION[id]?.nameFa ?? id;

  const selectedOrganId = useAppStore((s) => s.selectedOrganId);
  const hoveredOrganId = useAppStore((s) => s.hoveredOrganId);
  const visibility = useAppStore((s) => s.visibility[id]);
  const isolateMode = useAppStore((s) => s.isolateMode);
  const transparencyMode = useAppStore((s) => s.transparencyMode);
  const explodeOn = useAppStore((s) => s.explodeOn);
  const showLabels = useAppStore((s) => s.showLabels);
  const selectOrgan = useAppStore((s) => s.selectOrgan);
  const setHoveredOrgan = useAppStore((s) => s.setHoveredOrgan);
  const journeyActive = useAppStore((s) => s.journey.active);
  const journeySelected = useAppStore((s) => s.selectedOrganId);

  const isSelected = selectedOrganId === id;
  const isHovered = hoveredOrganId === id;
  const isJourneyHighlight = journeyActive && journeySelected === id;

  const effectiveVisible = visibility && (!isolateMode || !selectedOrganId || isSelected);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = explodeOn
      ? new THREE.Vector3(explodeDir[0], explodeDir[1], explodeDir[2])
      : new THREE.Vector3(0, 0, 0);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, target.x, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, target.y, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, target.z, 4, delta);
  });

  if (!effectiveVisible) return null;

  const baseColor = new THREE.Color(def.color);
  let opacity = 1;
  if (transparencyMode && !isSelected) opacity = 0.22;

  let emissive = new THREE.Color("#000000");
  let emissiveIntensity = 0;
  if (isSelected) {
    emissive = new THREE.Color("#ffb703");
    emissiveIntensity = 0.55;
  } else if (isJourneyHighlight) {
    emissive = new THREE.Color("#38bdf8");
    emissiveIntensity = 0.6;
  } else if (isHovered) {
    emissive = new THREE.Color("#ffffff");
    emissiveIntensity = 0.18;
  }

  const labelOffset = def.labelOffset ?? [0, 0.2, 0];
  const labelPos: [number, number, number] = [
    def.centroid[0] + labelOffset[0],
    def.centroid[1] + labelOffset[1],
    def.centroid[2] + labelOffset[2],
  ];

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        selectOrgan(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHoveredOrgan(null);
        document.body.style.cursor = "auto";
      }}
    >
      {parts.map((part, i) => (
        <mesh key={i} geometry={part.geometry} position={part.position} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={baseColor}
            roughness={def.roughness}
            clearcoat={def.clearcoat ?? 0.12}
            clearcoatRoughness={0.35}
            sheen={0.15}
            transparent={opacity < 1}
            opacity={opacity}
            depthWrite={opacity >= 0.9}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
      {showLabels && (
        <Html position={labelPos} center distanceFactor={9} occlude={false} zIndexRange={[10, 0]}>
          <div
            className={`pointer-events-none select-none whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-lg backdrop-blur-sm transition-colors ${
              isSelected
                ? "border-amber-400/70 bg-amber-500/20 text-amber-200"
                : "border-white/10 bg-slate-950/60 text-slate-200"
            }`}
          >
            {nameFa}
          </div>
        </Html>
      )}
    </group>
  );
}
