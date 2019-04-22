import authorize from "../../../../utils/authorize";

describe("authorize.js - callback", () => {
  it("should check for authorization correctly - success", () => {
    // foo.start policy callback returns true
    expect(authorize("foo", "start", [])).toEqual(true);
  });

  it("should check for authorization correctly - failure", () => {
    // foo.stop policy callback returns false
    expect(authorize("foo", "stop", [])).toEqual(false);
  });

  it("should check for authorization correctly for request arg - success", () => {
    const req = { body: { status: 0 } };
    expect(authorize("foo", "pause", [], req)).toEqual(true);
  });

  it("should check for authorization correctly for request arg - failure", () => {
    const req = { body: { status: 1 } };
    expect(authorize("foo", "pause", [], req)).toEqual(false);
  });

  it("should check for authorization correctly for promise - success", async () => {
    expect(await authorize("foo", "rewind", [])).toEqual(true);
  });

  it("should check for authorization correctly for promise - failure", async () => {
    expect(await authorize("foo", "proceed", [])).toEqual(false);
  });
});
