export const createException = (message) => {
  return Error(`[rbac-js]: ${message}`);
};
