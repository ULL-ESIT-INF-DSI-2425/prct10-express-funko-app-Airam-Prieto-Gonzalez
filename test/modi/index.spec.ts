import { describe, test, expect } from "vitest";
import { my_func } from "../../src/modi/index.js";

describe("Modi Tests", () => {
  test("Unitary Test", () => {
    expect(my_func()).toStrictEqual(1)
  });
});