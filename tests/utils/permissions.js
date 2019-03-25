import { loadPermissions } from "../../src";

const permissionsPath = `${__dirname}/samplePermissions`;

export const systemPermissions = loadPermissions(permissionsPath);
