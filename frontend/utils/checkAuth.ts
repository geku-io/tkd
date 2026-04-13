import { RouteRolesType } from "../constants/routes";
import { UserRole } from "../types/entities.types";

export const checkAuth = (accessedRoles: RouteRolesType, role?: UserRole) => {
   if (accessedRoles === "public") {
      return true;
   }
   if (!role) return false;
   return accessedRoles.includes(role);
};
