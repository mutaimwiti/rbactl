export const createException = message => {
  return Error(`[xps-rbac]: ${message}`);
};
