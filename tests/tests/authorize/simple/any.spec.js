import authorize from "../../../utils/authorize";

describe("authorize.js - any", () => {
  it("should check for authorization correctly - success", () => {
    // foo.release expects user to have either "foo.x", "foo.y" or "foo.z" permissions
    const successCombinations = [
      ["foo.x"],
      ["foo.y"],
      ["foo.z"],
      ["foo.x", "foo.y"],
      ["foo.x", "foo.y", "foo.z"]
    ];

    successCombinations.forEach(permissions => {
      expect(authorize("foo", "release", permissions)).toEqual(true);
    });
  });

  it("should check for authorization correctly - failure", () => {
    // foo.release expects user to have either "foo.x", "foo.y" or "foo.z" permissions
    const failureCombinations = [[], ["foo.p", "foo.q", "foo.r"]];

    failureCombinations.forEach(permissions => {
      expect(authorize("foo", "release", permissions)).toEqual(false);
    });
  });
});
