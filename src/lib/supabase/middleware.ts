import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function getSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, response };
}

export async function middleware(request: NextRequest) {
  const { session, response } = await getSession(request);
  const { pathname } = request.nextUrl;

  const userIsLoggedIn = !!session;

  // 1. Si el usuario YA está logueado y visita /login
  if (userIsLoggedIn && pathname.startsWith("/login")) {
    // Redirígelo al panel de admin
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Si el usuario NO está logueado e intenta acceder a /admin
  if (!userIsLoggedIn && pathname.startsWith("/admin")) {
    // Redirígelo a la página de login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}