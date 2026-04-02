import { NextResponse } from "next/server";

const COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
];

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  for (const name of COOKIE_NAMES) {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  }

  return response;
}
