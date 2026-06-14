import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Todo excepto archivos estáticos e imágenes
    "/((?!_next/static|_next/image|favicon.ico|brand|heroes|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
