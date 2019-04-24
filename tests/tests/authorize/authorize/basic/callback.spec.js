import authorize from "../../../../utils/authorize";
import { createException } from "../../../../../src/utils";

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

  it("should throw exception when a callback returns a non-boolean value", () => {
    expect(() => authorize("renew", "foo", [])).toThrow(
      createException(`Unexpected return type [string] from a callback.`)
    );
  });
});
