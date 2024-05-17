import  Cookies  from 'js-cookie'

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  return Cookies.remove(name);
};

export const setCookie = (name: string, data: any) => {
  return Cookies.set(name, data);
};
