import * as THREE from "three";

/** Deterministic pseudo-random smooth value noise based on sines (no external deps). */
function hashNoise(x: number, y: number, z: number, seed: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 17.113) * 43758.5453;
  return s - Math.floor(s);
}

function smoothNoise3(v: THREE.Vector3, seed: number): number {
  // Blend a few octaves of hashed sine noise for an organic, lumpy surface.
  let n = 0;
  n += Math.sin(v.x * 3.1 + seed) * Math.cos(v.y * 2.7 - seed) * 0.5;
  n += Math.sin(v.y * 4.3 - seed * 1.7) * Math.cos(v.z * 3.6 + seed) * 0.3;
  n += (hashNoise(v.x, v.y, v.z, seed) - 0.5) * 0.4;
  return n;
}

function lerpArray(arr: number[], t: number): number {
  if (arr.length === 1) return arr[0];
  const clamped = Math.min(Math.max(t, 0), 1);
  const scaled = clamped * (arr.length - 1);
  const i0 = Math.floor(scaled);
  const i1 = Math.min(i0 + 1, arr.length - 1);
  const f = scaled - i0;
  return arr[i0] * (1 - f) + arr[i1] * f;
}

export interface TubeBuildOptions {
  /** Adds low-frequency bulges along the tube length, used for large-intestine haustra. */
  haustra?: boolean;
  /** Overall subtle organic surface noise amplitude. */
  organicNoise?: number;
  /** Extra tubular resolution multiplier. */
  resolution?: number;
  closed?: boolean;
}

export interface BuiltTube {
  geometry: THREE.BufferGeometry;
  curve: THREE.CatmullRomCurve3;
}

/**
 * Builds a smooth, variable-radius tube geometry along a Catmull-Rom curve.
 * This is the base technique used for the esophagus, stomach, intestines, etc,
 * giving organic tapered/bulging organ silhouettes instead of a uniform pipe.
 */
export function buildVariableRadiusTube(
  points: [number, number, number][],
  radii: number[],
  radialSegments = 14,
  options: TubeBuildOptions = {}
): BuiltTube {
  const { haustra = false, organicNoise = 0.012, resolution = 1, closed = false } = options;
  const vecPoints = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vecPoints, closed, "catmullrom", 0.5);
  const length = curve.getLength();
  const tubularSegments = Math.max(24, Math.round(length * 26 * resolution));

  const geometry = new THREE.TubeGeometry(curve, tubularSegments, 1, radialSegments, closed);
  const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
  const ringCount = tubularSegments + 1;
  const vertsPerRing = radialSegments + 1;

  for (let ring = 0; ring < ringCount; ring++) {
    const t = ring / tubularSegments;
    const center = curve.getPointAt(Math.min(Math.max(t, 0), 1));
    const baseRadius = lerpArray(radii, t);
    let radiusMod = 1;
    if (haustra) {
      radiusMod += 0.14 * Math.sin(t * Math.PI * 2 * Math.max(6, length * 3.2));
    }
    for (let j = 0; j < vertsPerRing; j++) {
      const idx = ring * vertsPerRing + j;
      const vx = posAttr.getX(idx);
      const vy = posAttr.getY(idx);
      const vz = posAttr.getZ(idx);
      const vertex = new THREE.Vector3(vx, vy, vz);
      const dir = vertex.clone().sub(center);
      let r = baseRadius * radiusMod;
      if (organicNoise > 0) {
        r *= 1 + smoothNoise3(vertex, ring * 0.37 + j * 0.11) * organicNoise;
      }
      const newVertex = center.clone().add(dir.multiplyScalar(r));
      posAttr.setXYZ(idx, newVertex.x, newVertex.y, newVertex.z);
    }
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  return { geometry, curve };
}

export interface BlobDefinition {
  center: [number, number, number];
  scale: [number, number, number];
  detail?: number;
  noiseAmp?: number;
  seed?: number;
}

/**
 * Builds an organic, non-spherical "blob" geometry (used for liver lobes,
 * gallbladder, and the body silhouette) from a displaced icosahedron.
 */
export function buildOrganicBlob(def: BlobDefinition): THREE.BufferGeometry {
  const { scale, detail = 3, noiseAmp = 0.03, seed = 1 } = def;
  const geometry = new THREE.IcosahedronGeometry(1, detail);
  const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    v.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    const n = v.clone().normalize();
    const disp = 1 + smoothNoise3(n, seed) * noiseAmp * 3;
    v.copy(n.multiplyScalar(disp));
    posAttr.setXYZ(i, v.x * scale[0], v.y * scale[1], v.z * scale[2]);
  }
  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}
