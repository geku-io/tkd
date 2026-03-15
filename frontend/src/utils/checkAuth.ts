import { RouteRolesType } from "@/constants/routes";
import { UserRole } from "@/types/entities.types";

export const checkAuth = (role: UserRole, accessedRoles: RouteRolesType) => {
   if (accessedRoles === "public") {
      return true;
   }
   return accessedRoles.includes(role);
};
