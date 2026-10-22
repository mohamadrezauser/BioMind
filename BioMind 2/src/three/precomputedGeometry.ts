import * as THREE from "three";
import { buildOrganicBlob, buildVariableRadiusTube } from "./geometryBuilders";
import { ALL_ORGAN_IDS, ORGAN_LAYOUT, type OrganId } from "./organLayout";

export interface OrganMeshPart {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
}

const geometryCache: Partial<Record<OrganId, OrganMeshPart[]>> = {};
const curveCache: Partial<Record<OrganId, THREE.CatmullRomCurve3>> = {};

for (const id of ALL_ORGAN_IDS) {
  const shape = ORGAN_LAYOUT[id].shape;
  if (shape.kind === "tube") {
    const built = buildVariableRadiusTube(shape.points, shape.radii, shape.radialSegments, shape.options);
    geometryCache[id] = [{ geometry: built.geometry, position: [0, 0, 0] }];
    curveCache[id] = built.curve;
  } else {
    geometryCache[id] = shape.blobs.map((b) => {
      const geo = buildOrganicBlob(b);
      return { geometry: geo, position: b.center };
    });
  }
}

export function getOrganMeshParts(id: OrganId): OrganMeshPart[] {
  return geometryCache[id] ?? [];
}

export function getOrganCurve(id: OrganId): THREE.CatmullRomCurve3 | undefined {
  return curveCache[id];
}

// A simplified, low-poly translucent torso silhouette purely for spatial context.
export const BODY_SHELL_PARTS: OrganMeshPart[] = [
  { geometry: buildOrganicBlob({ center: [0, 0, 0], scale: [1.05, 2.05, 0.78], detail: 3, noiseAmp: 0.01, seed: 9 }), position: [0, 0.35, 0.05] },
  { geometry: buildOrganicBlob({ center: [0, 0, 0], scale: [0.5, 0.55, 0.5], detail: 2, noiseAmp: 0.01, seed: 8 }), position: [0, 3.0, 0.3] },
  { geometry: buildOrganicBlob({ center: [0, 0, 0], scale: [0.22, 0.55, 0.3], detail: 1, noiseAmp: 0.0, seed: 7 }), position: [0, 2.35, 0.1] },
];
