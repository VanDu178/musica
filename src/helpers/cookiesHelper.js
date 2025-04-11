import Cookies from "js-cookie";

export const removeCookie = () => {
  if (Cookies.get("access_token")) {
    Cookies.remove("access_token");
  }
  if (Cookies.get("refresh_token")) {
    Cookies.remove("refresh_token");
  }
  if (Cookies.get("secrect_key")) {
    Cookies.remove("secrect_key");
  }
  if (Cookies.get("is_premium")) {
    Cookies.remove("is_premium");
  }
};

export const addCookie = (
  access_token,
  refresh_token,
  secrect_key,
  is_peremium
) => {
  removeCookie();
  Cookies.set("access_token", access_token, {
    expires: 7,
  });
  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
  });
  Cookies.set("secrect_key", secrect_key, {
    expires: 7,
  });
  Cookies.set("is_premium", is_peremium, {
    expires: 7,
  });
};
