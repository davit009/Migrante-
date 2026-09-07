// ============================================================
// utils/safe-redirect.utils.ts
// Valida el parámetro `next` (usado para volver a la página que
// pedía login) para que solo pueda apuntar a una ruta interna.
//
// Sin esto, un enlace como /login?next=https://sitio-falso.com
// permitiría a un atacante usar nuestro dominio de confianza para
// redirigir a la víctima a un sitio de phishing (open redirect).
// ============================================================

/**
 * Devuelve `path` solo si es una ruta interna segura (empieza con un
 * único "/", no es protocol-relative "//host" y no trae un esquema
 * "algo://"). Si no, devuelve `fallback`.
 */
export function getSafeRedirectPath(path: string | null | undefined, fallback = '/dashboard'): string {
  if (!path) return fallback;
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//') || path.startsWith('/\\')) return fallback;
  if (path.includes('://')) return fallback;
  return path;
}
