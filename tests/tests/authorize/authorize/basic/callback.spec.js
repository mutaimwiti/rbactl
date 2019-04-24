import authorize from "../../../../utils/authorize";

describe("authorize.js - callback", () => {
  it("should check for authorization correctly - success", () => {
    // foo.start policy callback returns true
    expect(authorize("start", "foo", [])).toEqual(true);
  });

  it("should check for authorization correctly - failure", () => {
    // foo.stop policy callback returns false
    expect(authorize("stop", "foo", [])).toEqual(false);
  });

  it("should check for authorization correctly for request arg - success", () => {
    const req = { body: { status: 0 } };
    expect(authorize("pause", "foo", [], req)).toEqual(true);
  });

  it("should check for authorization correctly for request arg - failure", () => {
    const req = { body: { status: 1 } };
    expect(authorize("pause", "foo", [], req)).toEqual(false);
  });

  it("should check for authorization correctly for promise - success", async () => {
    expect(await authorize("rewind", "foo", [])).toEqual(true);
  });

  it("should check for authorization correctly for promise - failure", async () => {
    expect(await authorize("proceed", "foo", [])).toEqual(false);
  });
});
