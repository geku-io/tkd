import { UserRole } from "../types/entities.types";

export interface IRoute {
   path: string;
   roles: UserRole[] | "public";
}

export type RouteRolesType = UserRole[] | "public";

export const ROUTES = {
   LOGIN: "/login",
   HOME: "/dashboard",
   USERS: "/dashboard/users",
   COMPETITIONS: "/dashboard/competitions",
   DISCIPLINES: "/dashboard/disciplines",
   CATEGORIES: "/dashboard/categories",
   NEW_COMPETITION: "/dashboard/new-competition",
} as const;

export const ROUTES_ROLES: Record<keyof typeof ROUTES, RouteRolesType> = {
   LOGIN: "public",
   HOME: [UserRole.ADMIN, UserRole.EDITOR],
   USERS: [UserRole.ADMIN],
   COMPETITIONS: [UserRole.ADMIN, UserRole.EDITOR],
   DISCIPLINES: [UserRole.ADMIN, UserRole.EDITOR],
   CATEGORIES: [UserRole.ADMIN, UserRole.EDITOR],
   NEW_COMPETITION: [UserRole.ADMIN],
};
