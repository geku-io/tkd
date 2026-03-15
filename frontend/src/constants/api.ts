const BASEPATH = process.env.NEXT_PUBLIC_API_URL;

export const API = {
   ARENAS: BASEPATH + "/arenas",
   LOGIN: BASEPATH + "/auth/login",
   LOGOUT: BASEPATH + "/auth/logout",
   REFRESH: BASEPATH + "/auth/refresh",
   VALIDATE: BASEPATH + "/auth/validate",
   USERS: BASEPATH + "/users",
   CATEGORIES: BASEPATH + "/categories",
   DISCIPLINES: BASEPATH + "/disciplines",
   COMPETITIONS: BASEPATH + "/competitions",
   REORDER_COMPETITIONS: BASEPATH + "/competitions/reorder",
   MOVE_COMPETITIONS: BASEPATH + "/competitions/move",
   TOURNAMENTS: BASEPATH + "/tournaments",
   ARENAS_IN_TOURNAMENT: BASEPATH + "/tournaments-arenas",
} as const;
