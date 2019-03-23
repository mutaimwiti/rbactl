import authorize from "../../../utils/authorize";

describe("authorize.js - complex - case 2", () => {
  it("should check for authorization correctly - success", () => {
    const successCombinations = [
      ["bar.p"],
      ["bar.q"],
      ["bar.p", "bar.q"],

      ["bar.n"],
      ["bar.o"],
      ["bar.n", "bar.o"],

      ["bar.p", "bar.n"],
      ["bar.p", "bar.o"],
      ["bar.p", "bar.n", "bar.o"],

      ["bar.q", "bar.n"],
      ["bar.q", "bar.o"],
      ["bar.q", "bar.n", "bar.o"],

      ["bar.p", "bar.q", "bar.n"],
      ["bar.p", "bar.q", "bar.o"],
      ["bar.p", "bar.q", "bar.n", "bar.o"]
    ];

    successCombinations.forEach(permissions => {
      expect(authorize("bar", "edit", permissions)).toEqual(true);
    });
  });

  it("should check for authorization correctly - failure", () => {
    expect(authorize("bar", "edit", [])).toEqual(false);
  });
});
