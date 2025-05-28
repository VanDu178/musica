import Cookies from "js-cookie";

export const removeCookie = () => {
  if (Cookies.get("access_token")) {
    Cookies.remove("access_token");
  }
  if (Cookies.get("secrect_key")) {
    Cookies.remove("secrect_key");
  }
  // if (Cookies.get("is_premium")) {
  //   Cookies.remove("is_premium");
  // }
  // if (Cookies.get("premium_plan")) {
  //   Cookies.remove("premium_plan");
  // }
};

export const addCookie = (
  access_token,
  secrect_key
  // is_peremium,
  // premium_plan
) => {
  removeCookie();
  Cookies.set("access_token", access_token, {
    expires: 7,
  });
  Cookies.set("secrect_key", secrect_key, {
    expires: 7,
  });
  // Cookies.set("is_premium", is_peremium, {
  //   expires: 7,
  // });
  // Cookies.set("premium_plan", premium_plan, {
  //   expires: 7,
  // });
};
