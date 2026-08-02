import { UserRole } from "../../../types/entities.types";
import { IAuthUser } from "../../../types/main.types";

export const SESSIONS = {
   ADMIN: {
      id: "asdjklfjasfdlgjflxzscv",
      name: "Super Admin",
      role: UserRole.ADMIN,
   },
   EDITOR: {
      id: "asdjklfjasfdlgjflxzscv",
      name: "Worker",
      role: UserRole.EDITOR,
   },
} as const satisfies Record<string, IAuthUser>;
