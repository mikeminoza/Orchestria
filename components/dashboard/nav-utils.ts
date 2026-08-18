export function isNavItemActive(pathname: string, url: string) {
  return url === "/dashboard"
    ? pathname === url
    : pathname === url || pathname.startsWith(`${url}/`);
}

export function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}
