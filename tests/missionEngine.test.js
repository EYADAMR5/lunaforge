import { describe, expect, it } from "vitest";
import { calculateMission } from "../src/engine/missionEngine.js";
import { analyzeWhatIf } from "../src/engine/whatIf.js";
import { calculateMissionScore } from "../src/engine/scoring.js";

const valid = ["structure_6u","camera_basic","solar_deployable_6u","battery_high_capacity","comms_basic","adcs_basic","computer_standard","eps_standard"];

describe("LUNAFORGE EarthWatch-1 engineering engine", () => {
 it("uses the researched 6U mass and budget constraints", () => {
  const m=calculateMission(valid);
  expect(m.constraints.maxMassKg).toBe(12);
  expect(m.constraints.targetMassKg).toBe(8);
  expect(m.constraints.budgetCredits).toBe(1000);
 });
 it("calculates stored energy and onboard storage", () => {
  const m=calculateMission(valid);
  expect(m.metrics.batteryEnergyWh).toBe(88.8);
  expect(m.metrics.storageGb).toBe(32);
 });
 it("flags missing ADCS and EPS", () => {
  const m=calculateMission(valid.filter(x=>x!=="adcs_basic"&&x!=="eps_standard"));
  expect(m.violations.some(x=>x.includes("adcs"))).toBe(true);
  expect(m.violations.some(x=>x.includes("eps"))).toBe(true);
 });
 it("compares what-if design changes", () => {
  const r=analyzeWhatIf(valid,valid.map(x=>x==="camera_basic"?"camera_advanced":x));
  expect(r.changedComponents.added).toContain("camera_advanced");
  expect(r.comparison.scienceScore.absolute).toBe(30);
 });
 it("returns a finite bounded score", () => {
  const s=calculateMissionScore(calculateMission(valid));
  expect(Number.isFinite(s.total)).toBe(true);
  expect(s.total).toBeGreaterThanOrEqual(0);
  expect(s.total).toBeLessThanOrEqual(100);
 });
});
