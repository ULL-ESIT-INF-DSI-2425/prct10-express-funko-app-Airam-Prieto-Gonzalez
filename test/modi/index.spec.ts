import { describe, test, expect } from "vitest";
import { findSpells } from "../../src/modi/index.js";

describe("Modi Tests", () => {
  test("Unitary Test Yes", () => {
    return findSpells('Levitation Charm', 'Charm', 'Wingardium Leviosa').then((data) => {
      expect(data.body.length).toBe(1)
    })
  });
  test("Unitary Property", () => {
    return findSpells('Levitation Charm', 'Charm', 'Wingardium Leviosa').then((data) => {
      expect(data.body[0].name).toBe("Levitation Charm") 
    })
  })
  test("Type Property", () => {
    return findSpells('', 'Charm', '').then((data) => {
      expect(data.body.length).toBeGreaterThan(0)
    })
  })
  test("Unitary Test No", () => {
    return findSpells("Charm").catch((err) => {
      expect(err).toBe('No spells found matching the criteria.')
    })
    
  });
});