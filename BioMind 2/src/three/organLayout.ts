import type { TubeBuildOptions } from "./geometryBuilders";
import type { BlobDefinition } from "./geometryBuilders";

export type OrganId =
  | "mouth"
  | "pharynx"
  | "esophagus"
  | "stomach"
  | "smallIntestine"
  | "largeIntestine"
  | "rectum"
  | "anus"
  | "liver"
  | "gallbladder"
  | "pancreas";

export type OrganGroup = "tract" | "accessory";

export interface TubeShape {
  kind: "tube";
  points: [number, number, number][];
  radii: number[];
  radialSegments: number;
  options?: TubeBuildOptions;
}

export interface BlobShape {
  kind: "blob";
  blobs: BlobDefinition[];
}

export type OrganShape = TubeShape | BlobShape;

export interface OrganLayoutDef {
  id: OrganId;
  group: OrganGroup;
  color: string;
  roughness: number;
  clearcoat?: number;
  centroid: [number, number, number];
  labelOffset?: [number, number, number];
  shape: OrganShape;
}

/** Ordered path of the alimentary canal, used for the guided tour & food-journey animation. */
export const TRACT_ORDER: OrganId[] = [
  "mouth",
  "pharynx",
  "esophagus",
  "stomach",
  "smallIntestine",
  "largeIntestine",
  "rectum",
  "anus",
];

export const ACCESSORY_ORDER: OrganId[] = ["liver", "gallbladder", "pancreas"];

export const BODY_CENTER: [number, number, number] = [0, 0.3, 0.1];

export const ORGAN_LAYOUT: Record<OrganId, OrganLayoutDef> = {
  mouth: {
    id: "mouth",
    group: "tract",
    color: "#d98a7a",
    roughness: 0.55,
    centroid: [0, 3.3, 0.55],
    labelOffset: [0, 0.25, 0.2],
    shape: {
      kind: "blob",
      blobs: [{ center: [0, 3.3, 0.55], scale: [0.32, 0.2, 0.3], detail: 2, noiseAmp: 0.025, seed: 4.1 }],
    },
  },
  pharynx: {
    id: "pharynx",
    group: "tract",
    color: "#c97b6d",
    roughness: 0.5,
    centroid: [0, 3.0, 0.3],
    shape: {
      kind: "tube",
      points: [
        [0, 3.25, 0.52],
        [0.01, 3.05, 0.35],
        [0, 2.85, 0.15],
      ],
      radii: [0.18, 0.17, 0.15],
      radialSegments: 12,
    },
  },
  esophagus: {
    id: "esophagus",
    group: "tract",
    color: "#c27367",
    roughness: 0.48,
    centroid: [-0.15, 1.8, 0.08],
    shape: {
      kind: "tube",
      points: [
        [0, 2.85, 0.15],
        [0.03, 2.55, 0.0],
        [-0.02, 2.15, -0.05],
        [-0.12, 1.75, -0.02],
        [-0.22, 1.4, 0.05],
        [-0.28, 1.15, 0.12],
      ],
      radii: [0.14, 0.135, 0.13, 0.125, 0.12, 0.12],
      radialSegments: 12,
    },
  },
  stomach: {
    id: "stomach",
    group: "tract",
    color: "#e0716b",
    roughness: 0.42,
    clearcoat: 0.25,
    centroid: [-0.55, 0.75, 0.17],
    labelOffset: [-0.3, 0.3, 0.1],
    shape: {
      kind: "tube",
      points: [
        [-0.28, 1.15, 0.12],
        [-0.75, 1.35, 0.18],
        [-0.95, 1.05, 0.1],
        [-0.85, 0.7, 0.05],
        [-0.55, 0.45, 0.08],
        [-0.2, 0.4, 0.15],
        [0.05, 0.5, 0.22],
      ],
      radii: [0.2, 0.42, 0.47, 0.42, 0.3, 0.24, 0.18],
      radialSegments: 18,
      options: { organicNoise: 0.018 },
    },
  },
  smallIntestine: {
    id: "smallIntestine",
    group: "tract",
    color: "#e2a08f",
    roughness: 0.5,
    centroid: [0.0, -0.55, 0.27],
    labelOffset: [0.5, 0, 0.2],
    shape: {
      kind: "tube",
      points: [
        [0.05, 0.5, 0.22],
        [0.42, 0.42, 0.18],
        [0.55, 0.15, 0.1],
        [0.4, -0.05, 0.15],
        [0.1, -0.05, 0.25],
        [-0.35, -0.02, 0.3],
        [0.35, -0.16, 0.32],
        [-0.35, -0.3, 0.3],
        [0.35, -0.44, 0.32],
        [-0.35, -0.58, 0.3],
        [0.35, -0.72, 0.32],
        [-0.3, -0.86, 0.3],
        [0.25, -0.99, 0.32],
        [-0.2, -1.12, 0.3],
        [0.15, -1.25, 0.32],
        [-0.05, -1.38, 0.3],
        [0.1, -1.5, 0.28],
        [0.35, -1.58, 0.27],
        [0.55, -1.62, 0.28],
      ],
      radii: [
        0.12, 0.115, 0.11, 0.108, 0.105, 0.105, 0.102, 0.1, 0.1, 0.098, 0.098, 0.096, 0.096, 0.094, 0.092, 0.09,
        0.088, 0.086, 0.085,
      ],
      radialSegments: 12,
      options: { organicNoise: 0.015 },
    },
  },
  largeIntestine: {
    id: "largeIntestine",
    group: "tract",
    color: "#b5513f",
    roughness: 0.46,
    centroid: [0.0, -0.3, 0.22],
    labelOffset: [0.85, 0.2, 0.1],
    shape: {
      kind: "tube",
      points: [
        [0.65, -1.62, 0.3],
        [0.8, -1.3, 0.35],
        [0.82, -0.6, 0.35],
        [0.8, 0.2, 0.35],
        [0.75, 0.85, 0.3],
        [0.35, 1.05, 0.15],
        [-0.1, 1.08, 0.08],
        [-0.55, 1.0, 0.1],
        [-0.8, 0.8, 0.2],
        [-0.82, 0.1, 0.32],
        [-0.8, -0.6, 0.33],
        [-0.7, -1.15, 0.3],
        [-0.4, -1.5, 0.28],
        [-0.1, -1.68, 0.2],
        [0.05, -1.78, 0.12],
      ],
      radii: [0.16, 0.18, 0.185, 0.185, 0.18, 0.17, 0.17, 0.17, 0.175, 0.18, 0.18, 0.175, 0.17, 0.165, 0.16],
      radialSegments: 16,
      options: { haustra: true, organicNoise: 0.01 },
    },
  },
  rectum: {
    id: "rectum",
    group: "tract",
    color: "#9c4536",
    roughness: 0.46,
    centroid: [0.02, -2.1, 0.02],
    shape: {
      kind: "tube",
      points: [
        [0.05, -1.78, 0.12],
        [0.02, -2.1, 0.02],
        [0, -2.38, -0.02],
      ],
      radii: [0.16, 0.155, 0.13],
      radialSegments: 14,
    },
  },
  anus: {
    id: "anus",
    group: "tract",
    color: "#7d392c",
    roughness: 0.46,
    centroid: [0, -2.55, 0.0],
    shape: {
      kind: "tube",
      points: [
        [0, -2.38, -0.02],
        [0, -2.58, 0.02],
      ],
      radii: [0.13, 0.09],
      radialSegments: 12,
    },
  },
  liver: {
    id: "liver",
    group: "accessory",
    color: "#7a2e2e",
    roughness: 0.38,
    clearcoat: 0.35,
    centroid: [0.5, 1.52, 0.25],
    labelOffset: [0.5, 0.35, 0.2],
    shape: {
      kind: "blob",
      blobs: [
        { center: [0.75, 1.55, 0.3], scale: [0.55, 0.4, 0.35], detail: 3, noiseAmp: 0.03, seed: 1.3 },
        { center: [0.05, 1.45, 0.15], scale: [0.3, 0.28, 0.26], detail: 3, noiseAmp: 0.03, seed: 2.7 },
      ],
    },
  },
  gallbladder: {
    id: "gallbladder",
    group: "accessory",
    color: "#5a7d4a",
    roughness: 0.32,
    clearcoat: 0.5,
    centroid: [0.62, 1.05, 0.55],
    labelOffset: [0.35, -0.05, 0.25],
    shape: {
      kind: "blob",
      blobs: [{ center: [0.62, 1.05, 0.55], scale: [0.11, 0.19, 0.11], detail: 2, noiseAmp: 0.02, seed: 3.9 }],
    },
  },
  pancreas: {
    id: "pancreas",
    group: "accessory",
    color: "#d9b26a",
    roughness: 0.5,
    centroid: [0.0, 0.6, -0.17],
    labelOffset: [-0.4, -0.2, -0.3],
    shape: {
      kind: "tube",
      points: [
        [0.5, 0.55, -0.1],
        [0.15, 0.6, -0.2],
        [-0.2, 0.65, -0.22],
        [-0.5, 0.6, -0.15],
      ],
      radii: [0.16, 0.17, 0.13, 0.07],
      radialSegments: 12,
    },
  },
};

export const ALL_ORGAN_IDS: OrganId[] = [...TRACT_ORDER, ...ACCESSORY_ORDER];

export function getExplodeDirection(id: OrganId): [number, number, number] {
  const c = ORGAN_LAYOUT[id].centroid;
  const dx = c[0] - BODY_CENTER[0];
  const dy = (c[1] - BODY_CENTER[1]) * 0.35;
  const dz = c[2] - BODY_CENTER[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const scale = 1.1;
  return [(dx / len) * scale, (dy / len) * scale * 0.6, (dz / len) * scale];
}
