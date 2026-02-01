import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Generar Nonce único
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 2. Definir la política CSP Estricta (Sin unsafe-inline)
  // Nota: Agregamos 'https:' y 'data:' en font-src e img-src para evitar bloqueos de recursos externos
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Limpiar espacios
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 3. Preparar los headers de la solicitud para pasar el Nonce a Next.js
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce); // 👈 CLAVE: Pasamos el nonce al layout
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // 4. Crear respuesta con los nuevos headers de solicitud
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Configurar headers de seguridad en la respuesta final (Para el navegador)
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};