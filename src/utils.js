export const createException = (message) => {
  return Error(`[rbactrl]: ${message}`);
};
