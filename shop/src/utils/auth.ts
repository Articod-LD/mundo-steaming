import Cookie from "js-cookie";
import SSRCookie from "cookie";

import { COSTUMER, PERMISSIONS, SUPER_ADMIN, TOKEN } from "./constants";
export const adminOnly = [SUPER_ADMIN];

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "authToken";

export const allowedRoles = [SUPER_ADMIN, COSTUMER];

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}

export function setAuthCredentials(token: string, permissions: any) {
  Cookie.set(AUTH_TOKEN_KEY, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
  role: string | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_TOKEN_KEY];
  } else {
    authCred = Cookie.get(AUTH_TOKEN_KEY);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null, role: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? "");
}

export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS]) &&
    !!_cookies[PERMISSIONS].length
  );
}
