// Create an Error namespaced to the library so consumers can tell rbactl
// exceptions apart from others.
export const createException = (message: string): Error =>
  new Error(`[rbactl]: ${message}`);
