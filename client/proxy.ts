import { NextResponse, type NextRequest } from "next/server";

function getCanonicalOrigin() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN;
  if (!origin) {
    return null;
  }

  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const canonicalOrigin = getCanonicalOrigin();
  if (!canonicalOrigin) {
    return NextResponse.next();
  }

  const currentHost = request.nextUrl.hostname;
  const canonicalHost = canonicalOrigin.hostname;

  if (currentHost === canonicalHost) {
    return NextResponse.next();
  }

  if (!currentHost.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.protocol = canonicalOrigin.protocol;
  redirectUrl.host = canonicalOrigin.host;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|sitemap.xml|robots.txt).*)"],
};
