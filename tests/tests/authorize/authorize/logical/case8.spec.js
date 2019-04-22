import authorize from "../../../../utils/authorize";

describe("authorize.js - complex - case 8", () => {
  it("should check for authorization correctly - success", () => {
    const successCombinations = [
      ["bar.x"],
      ["bar.y"],
      ["bar.x", "bar.y"],
      ["bar.x", "bar.y", "bar.g"]
    ];

    successCombinations.forEach(permissions => {
      expect(authorize("bar", "pause", permissions)).toEqual(true);
    });
  });

  it("should check for authorization correctly - failure", () => {
    const failureCombinations = [[], ["bar.g"]];

    failureCombinations.forEach(permissions => {
      expect(authorize("bar", "pause", permissions)).toEqual(false);
    });
  });
});
