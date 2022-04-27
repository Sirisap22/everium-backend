import UserRole from "../users/user-role.enum";

export function excludeRoles(forbiddenRoles: UserRole[]) {
  const roles: UserRole[] = Object.values(UserRole);
  const allowedRoles = roles.filter((role) => !forbiddenRoles.includes(role));
  return allowedRoles;
}