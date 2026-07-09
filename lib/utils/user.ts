export function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function capitalizeRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
