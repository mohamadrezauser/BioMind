import { ALL_ORGAN_IDS } from "../../three/organLayout";
import BodyShell from "./BodyShell";
import FoodJourneyMarker from "./FoodJourneyMarker";
import OrganMesh from "./OrganMesh";

export default function AnatomyModel() {
  return (
    <group>
      <BodyShell />
      {ALL_ORGAN_IDS.map((id) => (
        <OrganMesh key={id} id={id} />
      ))}
      <FoodJourneyMarker />
    </group>
  );
}
