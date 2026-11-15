
import { calculateMission, getResourceStatus } from "./missionEngine.js";
import { calculateMissionScore } from "./scoring.js";
import { analyzeWhatIf } from "./whatIf.js";

// Converts the current Builder component IDs into Member 3 engine IDs.
const COMPONENT_ID_MAP = {
  "structure-1": "structure_6u",
  "power-1": "solar_body_6u",
  "battery-1": "battery_standard",
  "camera-1": "camera_basic",
  "camera-2": "camera_advanced",
  "computer-1": "computer_standard",
  "communication-1": "comms_basic",
  "communication-2": "comms_high_rate",

  // These will be available when the Builder adds these systems.
  "adcs-1": "adcs_basic",
  "adcs-2": "adcs_precise",
  "eps-1": "eps_standard",
};

export function convertBuilderSelection(selectedComponents = []) {
  return selectedComponents.map((component) => {
    const engineId = COMPONENT_ID_MAP[component.id];

    if (!engineId) {
      throw new Error(
        `Component "${component.name}" has no engineering engine mapping.`
      );
    }

    return engineId;
  });
}

export function runEngineeringAnalysis(selectedComponents = []) {
  const selection = convertBuilderSelection(selectedComponents);

  const mission = calculateMission(selection);

  // Compatibility layer for the current scoring module.
  // Member 3's original files remain unchanged.
  const scoreInput = {
    ...mission,
    metrics: {
      ...mission.metrics,
      targetMassKg: mission.constraints.targetMassKg,
      budgetCreditsRemaining: mission.metrics.budgetRemainingCredits,
    },
  };

  const score = calculateMissionScore(scoreInput);
  const resourceStatus = getResourceStatus(mission);

  return {
    mission,
    score,
    resourceStatus,
    feasible: mission.feasible,
    status: mission.status,
    violations: mission.violations,
    warnings: mission.warnings,
  };
}

export function runEngineeringWhatIf(
  originalComponents = [],
  changedComponents = []
) {
  const originalSelection = convertBuilderSelection(originalComponents);
  const changedSelection = convertBuilderSelection(changedComponents);

  return analyzeWhatIf(originalSelection, changedSelection);
}
