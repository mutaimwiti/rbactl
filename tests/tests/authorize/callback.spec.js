import { authorize } from "../../../src";

const policiesPath = `${__dirname}/../../helpers/samplePolicies`;

describe("authorize.js - callback", () => {
  it("should check for authorization correctly - success", () => {
    // foo.start policy callback returns true
    expect(authorize("foo", "start", [], policiesPath));
  });

  it("should check for authorization correctly - failure", () => {
    // foo.stop policy callback returns false
    expect(authorize("foo", "stop", [], policiesPath));
  });
});
