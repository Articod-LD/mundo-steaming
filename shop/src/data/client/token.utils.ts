import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "authToken";

export const getAuthToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get(AUTH_TOKEN_KEY);
};

export function setAuthToken(token: string) {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 1 });
}

export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY);
}
export function checkHasAuthToken() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) return false;
  return true;
}
