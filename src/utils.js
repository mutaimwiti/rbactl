export const createException = (message) => {
  return Error(`[rbactl]: ${message}`);
};
