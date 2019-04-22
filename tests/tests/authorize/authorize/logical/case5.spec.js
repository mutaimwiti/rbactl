import authorize from "../../../../utils/authorize";

describe("authorize.js - complex - case 5", () => {
  it("should check for authorization correctly - success", () => {
    const successReq = { params: { id: 3 } };
    const successCombinations = [
      { perm: ["bar.x"], req: successReq },
      { perm: ["bar.y"], req: successReq },
      { perm: ["bar.x", "bar.y"], req: successReq }
    ];

    successCombinations.forEach(item => {
      expect(authorize("bar", "archive", item.perm, item.req)).toEqual(true);
    });
  });

  it("should check for authorization correctly - failure", () => {
    const successReq = { params: { id: 3 } };
    const failureReq = { params: { id: 7 } };
    const failureCombinations = [
      { perm: [], req: successReq },
      { perm: [], req: failureReq },
      { perm: ["bar.x"], req: failureReq },
      { perm: ["bar.y"], req: failureReq },
      { perm: ["bar.x", "bar.y"], req: failureReq }
    ];

    failureCombinations.forEach(item => {
      expect(authorize("bar", "archive", item.perm, item.req)).toEqual(false);
    });
  });
});
