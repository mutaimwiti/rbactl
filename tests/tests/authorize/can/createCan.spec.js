import { createCan } from "../../../../src/authorize";
import { systemPolicies } from "../../../utils/authorize";

describe("authorize.js - createCan()", () => {
  it("should successfully create can function", () => {
    const can = createCan(systemPolicies, jest.fn(), jest.fn(), jest.fn());
    expect(can).toBeInstanceOf(Function);
  });
});
