import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { BODY_CENTER, ORGAN_LAYOUT } from "../../three/organLayout";

const TARGET: [number, number, number] = [BODY_CENTER[0], BODY_CENTER[1], BODY_CENTER[2]];

export default function CameraRig() {
  const controlsRef = useRef<CameraControls>(null);
  const cameraCommand = useAppStore((s) => s.cameraCommand);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !cameraCommand) return;
    const { type, organId } = cameraCommand;
    const [tx, ty, tz] = TARGET;

    switch (type) {
      case "front":
        controls.setLookAt(0, ty + 0.6, 8.6, tx, ty, tz, true);
        break;
      case "back":
        controls.setLookAt(0, ty + 0.6, -8.6, tx, ty, tz, true);
        break;
      case "left":
        controls.setLookAt(-8.6, ty + 0.6, 0, tx, ty, tz, true);
        break;
      case "right":
        controls.setLookAt(8.6, ty + 0.6, 0, tx, ty, tz, true);
        break;
      case "top":
        controls.setLookAt(0.01, ty + 9, 0.01, tx, ty, tz, true);
        break;
      case "reset":
        controls.setLookAt(0.6, 1.1, 8.4, tx, ty, tz, true);
        break;
      case "focus":
        if (organId) {
          const c = ORGAN_LAYOUT[organId].centroid;
          const dist = 1.8;
          controls.setLookAt(c[0] + dist * 0.6, c[1] + dist * 0.35, c[2] + dist, c[0], c[1], c[2], true);
        }
        break;
    }
  }, [cameraCommand]);

  useEffect(() => {
    controlsRef.current?.setLookAt(0.6, 1.1, 8.4, TARGET[0], TARGET[1], TARGET[2], false);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const controls = controlsRef.current;
      if (!controls) return;
      switch (e.key) {
        case "ArrowLeft":
          controls.rotate(-Math.PI / 24, 0, true);
          break;
        case "ArrowRight":
          controls.rotate(Math.PI / 24, 0, true);
          break;
        case "ArrowUp":
          controls.rotate(0, -Math.PI / 32, true);
          break;
        case "ArrowDown":
          controls.rotate(0, Math.PI / 32, true);
          break;
        case "+":
        case "=":
          controls.dolly(0.6, true);
          break;
        case "-":
          controls.dolly(-0.6, true);
          break;
        case "0":
          useAppStore.getState().requestCamera("reset");
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={1.2}
      maxDistance={13}
      dollyToCursor
      smoothTime={0.45}
    />
  );
}
