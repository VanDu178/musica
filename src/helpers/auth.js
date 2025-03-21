let logoutFn = null;

export const setLogoutFn = (logout) => {
  logoutFn = logout;
};

export const getLogoutFn = () => {
  return logoutFn;
};
