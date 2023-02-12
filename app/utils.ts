import { Location, useNavigation, useNavigationType } from "@remix-run/react";
import { useLoaderData, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function insertIf(condition: boolean, expression: any) {
  return condition ? [expression] : [];
}

export function useAnimatedLoaderData<T>() {
  const data = useLoaderData<T>();
  const previous = useRef<typeof data>();

  useEffect(() => {
    if (data) previous.current = data;
  }, [data]);

  return data || previous.current!;
}

type NavigationDirection = "LEFT" | "RIGHT";
export function useNavigationAnimation(): {
  x: [string, string];
} {
  const xRef = useRef<{ x: [string, string] }>({ x: ["20%", "-30%"] });
  const { location: toLocation } = useNavigation();
  const location = useLocation();

  if (!toLocation) {
    return xRef.current;
  }

  xRef.current = { x: ["20%", "-30%"] };

  const toDepth = [...toLocation.pathname].filter((c) => c === "/").length;
  const fromDepth = [...location.pathname].filter((c) => c === "/").length;

  const direction = toDepth > fromDepth ? "RIGHT" : "LEFT";
  if (direction === "LEFT") {
    xRef.current.x = ["-30%", "20%"];
  }

  return xRef.current;
}
