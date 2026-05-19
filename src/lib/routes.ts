export function isAdminPath(pathname: string) {
  return (
    pathname.startsWith("/redazione") || pathname.startsWith("/gestione")
  );
}
