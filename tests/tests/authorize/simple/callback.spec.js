import authorize from "../../../utils/authorize";

describe("authorize.js - callback", () => {
  it("should check for authorization correctly - success", () => {
    // foo.start policy callback returns true
    expect(authorize("foo", "start", []));
  });

  it("should check for authorization correctly - failure", () => {
    // foo.stop policy callback returns false
    expect(authorize("foo", "stop", []));
  });
});
